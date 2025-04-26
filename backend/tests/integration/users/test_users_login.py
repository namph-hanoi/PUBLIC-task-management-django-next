from django.test import TestCase
import pytest
from rest_framework import status
from django.urls import reverse

from tests.factories import EmailAddressFactory, UserFactory
from django.contrib.auth import get_user_model
from allauth.account.models import EmailAddress


@pytest.mark.integration
class TestUserLoginAPI(TestCase):
    PASSWORD = "P7_for_test"
    
    @classmethod
    def setUpTestData(cls):
        user = UserFactory(password=cls.PASSWORD)
        EmailAddressFactory(user=user, email=user.email)
        cls.user = user
        

    def perform_login(self, email, password):
        login_url = reverse("users:user_login")
        login_data = {"email": email, "password": password}
        return self.client.post(login_url, login_data, format="json")

    @pytest.mark.django_db
    def test_successful_login(self):
        response = self.perform_login(
            email=self.user.email, password=self.PASSWORD
        )

        self.assertContains(response, "token")
        assert response.data["user"]["email"] == self.user.email
        assert response.data["user"]["first_name"] == self.user.first_name
        assert response.data["user"]["last_name"] == self.user.last_name

    @pytest.mark.django_db
    def test_login_with_incorrect_password(self):
        response = self.perform_login(
            email=self.user.email, password="wrong_password"
        )

        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        self.assertIn("Wrong username or password.", str(response.data))
        
        
    @pytest.mark.django_db
    def test_login_with_nonexistent_user(self):

        response = self.perform_login(
            email="random_abc@abc.ccc", password="funfunpass"
        )

        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        self.assertIn("Wrong username or password.", str(response.data))