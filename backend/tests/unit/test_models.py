import pytest
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

from tests.factories import UserFactory

User = get_user_model()

@pytest.mark.unit
class TestUserModel:
    """Test the User model."""
    @pytest.mark.django_db
    def test_create_user(self):
        """Test creating a user is successful."""
        username = 'testuser'
        email = 'test@example.com'
        password = 'testpass123'
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
        )
        
        assert user.username == username
        assert user.email == email
        assert user.check_password(password)
        assert not user.is_staff
    
    @pytest.mark.django_db
    def test_create_superuser(self):
        """Test creating a superuser."""
        user = User.objects.create_superuser(
            'admin@example.com',
            'admin',
            'password123',
        )
        
        assert user.is_superuser
        assert user.is_staff
    
    @pytest.mark.django_db    
    def test_user_factory(self):
        """Test the UserFactory."""
        user = UserFactory()
        
        assert User.objects.filter(pk=user.pk).exists()
        assert user.username.startswith('user_')
        assert '@example.com' in user.email
