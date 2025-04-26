import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.fixture
def api_client():
    """Return an authenticated API client."""
    return APIClient()

@pytest.fixture
def authenticated_client():
    """Return an authenticated API client."""
    user = User.objects.create_user(username='testuser', password='testpass123')
    client = APIClient()
    client.force_authenticate(user=user)
    return client, user

@pytest.fixture
def admin_client():
    """Return an admin API client."""
    admin = User.objects.create_superuser(
        username='admin', 
        password='adminpass123',
        email='admin@example.com'
    )
    client = APIClient()
    client.force_authenticate(user=admin)
    return client, admin
