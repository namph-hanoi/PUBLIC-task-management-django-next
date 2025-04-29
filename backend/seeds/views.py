from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from users.models import Profile
from tasks.models import Task
from faker import Faker

class SeedAllView(APIView):
    def post(self, request, *args, **kwargs):
        User = get_user_model()
        fake = Faker()

        # Create employer
        employer, _ = User.objects.get_or_create(
            email='employer@localhost.com',
            defaults={'username': 'employer@localhost.com'}
        )
        employer.set_password('password')
        employer.save()
        Profile.objects.get_or_create(user=employer, defaults={'role': Profile.EMPLOYER})

        # Create employees
        employee_a, _ = User.objects.get_or_create(
            email='employee_a@localhost.com',
            defaults={'username': 'employee_a@localhost.com'}
        )
        employee_a.set_password('password')
        employee_a.save()
        Profile.objects.get_or_create(user=employee_a, defaults={'role': Profile.EMPLOYEE})

        employee_b, _ = User.objects.get_or_create(
            email='employee_b@localhost.com',
            defaults={'username': 'employee_b@localhost.com'}
        )
        employee_b.set_password('password')
        employee_b.save()
        Profile.objects.get_or_create(user=employee_b, defaults={'role': Profile.EMPLOYEE})

        # Create 2 random tasks for each employee
        for assignee in [employee_a, employee_b]:
            for _ in range(2):
                date_creation = fake.date_this_year(before_today=False, after_today=False)
                date_due = fake.date_between(start_date=date_creation, end_date="+10d")
                Task.objects.create(
                    title=fake.sentence(),
                    description=fake.text(),
                    assignee=assignee,
                    date_creation=date_creation,
                    date_due=date_due
                )

        return Response({'status': 'seeded'}, status=status.HTTP_201_CREATED)
