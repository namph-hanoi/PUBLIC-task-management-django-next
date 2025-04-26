import pytest
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError

from users.serializers import UserSerializer

User = get_user_model()

@pytest.mark.unit
class TestUserSerializer:
    """Test the user serializer."""
    @pytest.mark.django_db
    def test_user_serialization(self):
        """Test serializing a user."""
        user = User.objects.create_user(
            username='testuser',  # Added username parameter to satisfy the method signature
            email='test@example.com',
            password='testpass123',
        )
        serializer = UserSerializer(user)
        data = serializer.data
        
        assert data['email'] == 'test@example.com'
        assert 'password' not in data

