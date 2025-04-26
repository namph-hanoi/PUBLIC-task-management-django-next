import factory
from django.contrib.auth import get_user_model
from factory.django import DjangoModelFactory
from products.models import Product, ProductCategory
import random
from allauth.account.models import EmailAddress

User = get_user_model()

class UserFactory(DjangoModelFactory):
    class Meta:
        model = User
        
    username = factory.Sequence(lambda n: f"user_{n}")
    email = factory.LazyAttribute(lambda o: f"{o.username}@example.com")
    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')
    
    @factory.post_generation
    def password(self, create, extracted, **kwargs):
        password = extracted or 'testpass123'
        self.set_password(password)
        if create:
            self.save()
            
class EmailAddressFactory(DjangoModelFactory):
    class Meta:
        model = EmailAddress
    
    email = factory.LazyAttribute(lambda o: f"email_{random.randint(1, 1000)}@example.com")
    user = factory.SubFactory(UserFactory)
    verified = True
    primary = True


class ProductCategoryFactory(DjangoModelFactory):
    class Meta:
        model = ProductCategory
    name = factory.Sequence(lambda n: f"Category {n}")

class ProductFactory(DjangoModelFactory):
    class Meta:
        model = Product
    name = factory.Sequence(lambda n: f"Product {n}")
    # Fix: Use SubFactory to properly associate with ProductCategory
    category = factory.SubFactory(ProductCategoryFactory)
    price = factory.LazyFunction(lambda: random.uniform(10.0, 100.0))
