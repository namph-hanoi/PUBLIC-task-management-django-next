from django.test import TestCase
from django.contrib.auth import get_user_model
from products.models import Product, ProductCategory
from .factories import UserFactory, ProductCategoryFactory, ProductFactory

User = get_user_model()

class FactoriesTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        """Set up data for the whole TestCase."""
        cls.seller = UserFactory()
        
        
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
    
    def test_product_category_factory(self):
        """Test that ProductCategoryFactory creates valid ProductCategory instances."""
        category = ProductCategoryFactory()
        
        # Test instance is created
        self.assertIsInstance(category, ProductCategory)
        
        # Test attributes are set
        self.assertTrue(category.name.startswith('Category '))
    
    def test_product_factory(self):
        """Test that ProductFactory creates valid Product instances."""
        product = ProductFactory(seller=self.seller)
        # Test instance is created
        self.assertIsInstance(product, Product)
        
        # Test attributes are set
        self.assertTrue(product.name.startswith('Product '))
        self.assertIsInstance(product.category, ProductCategory)
        self.assertGreater(product.price, 0)
    
    def test_product_with_specific_category(self):
        """Test creating a product with a specific category."""
        # Create a seller user that will be associated with the product
        category = ProductCategoryFactory(name="Specific Category")
        product = ProductFactory(category=category, seller=self.seller)
        
        self.assertEqual(product.category.name, "Specific Category")
