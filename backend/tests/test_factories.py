from django.test import TestCase
from django.contrib.auth import get_user_model
from django.contrib.sites.models import Site
from .factories import UserFactory

User = get_user_model()

class FactoriesTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        Site.objects.get_or_create(id=1, defaults={"domain": "example.com", "name": "example.com"})

        
        
    def test_user_factory(self):
        """Test that UserFactory creates valid User instances."""
        user = UserFactory()
        
        # Test instance is created
        self.assertIsInstance(user, User)
        
        # Test attributes are set
        self.assertTrue(user.username.startswith('user_'))
        self.assertEqual(user.email, f"{user.username}@example.com")
        self.assertIsNotNone(user.first_name)
        self.assertIsNotNone(user.last_name)
        
        # Test password functionality
        self.assertTrue(user.check_password('testpass123'))
        
        # Test custom password
        custom_user = UserFactory(password='custom123')
        self.assertTrue(custom_user.check_password('custom123'))

