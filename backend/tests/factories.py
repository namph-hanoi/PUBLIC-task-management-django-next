import factory
from django.contrib.auth import get_user_model
from factory.django import DjangoModelFactory
import random
from django.utils import timezone
from tasks.models import Task
from users.models import Profile
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

    @factory.post_generation
    def is_employer(self, create, extracted, **kwargs):
        if not create:
            return
        if extracted is not None:
            role = Profile.EMPLOYER if extracted else Profile.EMPLOYEE
            # Create or update the related Profile
            if hasattr(self, "profile"):
                self.profile.role = role
                self.profile.save()
            else:
                Profile.objects.create(user=self, role=role)

class EmailAddressFactory(DjangoModelFactory):
    class Meta:
        model = EmailAddress
    
    email = factory.LazyAttribute(lambda o: f"email_{random.randint(1, 1000)}@example.com")
    user = factory.SubFactory(UserFactory)
    verified = True
    primary = True

class TaskFactory(DjangoModelFactory):
    class Meta:
        model = Task
    
    title = factory.Faker('sentence', nb_words=4)
    description = factory.Faker('paragraph')
    status = factory.LazyFunction(lambda: random.choice([
        Task.STATUS_IN_PROGRESS,
        Task.STATUS_COMPLETED,
        Task.STATUS_PENDING
    ]))
    assignee = factory.SubFactory(UserFactory)
    date_creation = factory.Faker('date_time_this_year', tzinfo=factory.LazyFunction(lambda: timezone.get_current_timezone()))
    date_due = factory.Faker(
        'date_time_between',
        start_date='+1d',
        end_date='+30d',
        tzinfo=timezone.get_current_timezone()
    )



