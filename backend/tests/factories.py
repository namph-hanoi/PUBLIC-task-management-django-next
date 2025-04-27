import factory
from django.contrib.auth import get_user_model
from factory.django import DjangoModelFactory
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

