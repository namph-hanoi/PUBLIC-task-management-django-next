import pytest
import re
import time
from rest_framework import status
from django.urls import reverse
from django.core import mail

from tests.factories import UserFactory
from allauth.account.models import EmailAddress
from django.contrib.auth import get_user_model


@pytest.mark.integration
class TestUserAPI:
    
    def get_email_obj(self, emailadress="nam.phan@example.com"):
        email_obj = EmailAddress.objects.get(email=emailadress)
        return email_obj

    def setup_registration_test(self, settings):
        settings.EMAIL_BACKEND = "django.core.mail.backends.locmem.EmailBackend"
        
    def create_registration_data(self, email="nam.phan@example.com", password="P7_for_test"):
        return {
            "email": email,
            "password1": password,
            "password2": password,
            "first_name": "nam",
            "last_name": "phan",
        }
        
    def perform_registration(self, client, registration_data):
        register_url = "/api/user/register/"
        return client.post(register_url, registration_data, format="json")

    @pytest.mark.django_db
    def test_list_users(self, authenticated_client):
        UserFactory.create_batch(3)

        client, user = authenticated_client
        url = reverse("users:profile_detail")
        response = client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) >= 3

    @pytest.mark.django_db
    def test_user_registration_flow(self, client, settings):
        self.setup_registration_test(settings)
        registration_data = self.create_registration_data()
        
        register_response = self.perform_registration(client, registration_data)

        assert register_response.status_code == status.HTTP_201_CREATED
        assert "Verification e-mail sent." in register_response.data.get("detail", "")
        # Check that email is not verified initially
        
        user_email = registration_data["email"]
        email_obj = EmailAddress.objects.get(email=user_email)
        assert not email_obj.verified, "Email should not be verified before confirmation"

        max_retries = 10
        retry_delay = 0.5

        for _ in range(max_retries):
            if len(mail.outbox) > 0:
                break
            time.sleep(retry_delay)

        assert len(mail.outbox) > 0, f"No emails were sent after {max_retries} attempts"
        confirmation_email = mail.outbox[0]

        assert confirmation_email.to[0] == registration_data["email"]

        email_body = confirmation_email.body
        confirmation_link_pattern = r"\/account-confirm-email\/([^\/]+)\/"
        match = re.search(confirmation_link_pattern, email_body)

        assert match, "Confirmation link not found in email"
        key = match.group(1)

        confirm_url = f"/account-confirm-email/{key}/"
        confirm_response = client.post(confirm_url, {"key": key}, format="json")

        assert confirm_response.status_code == status.HTTP_200_OK


        User = get_user_model()

        user = User.objects.get(email="nam.phan@example.com")
        assert user.is_active
        assert user.first_name == "nam"
        assert user.last_name == "phan"


        email_obj = EmailAddress.objects.get(email="nam.phan@example.com")
        assert email_obj.verified

    @pytest.mark.django_db
    def test_user_registration_with_common_password(self, client, settings):
        self.setup_registration_test(settings)
        registration_data = self.create_registration_data(password="password123")
        
        register_response = self.perform_registration(client, registration_data)
        
        assert register_response.status_code == status.HTTP_400_BAD_REQUEST
        assert "password is too common" in str(register_response.data).lower()

    @pytest.mark.django_db
    def test_user_creation_batch(self):
        users = UserFactory.create_batch(3)
        
        User = get_user_model()
        db_users = User.objects.all()
        
        assert len(users) == 3
        assert db_users.count() >= 3
        
        for user in users:
            assert User.objects.filter(id=user.id).exists()