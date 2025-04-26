import datetime

from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import models
from django.utils.translation import gettext as _
from django_countries.fields import CountryField

User = get_user_model()


class Profile(models.Model):
    EMPLOYER = "employer"
    EMPLOYEE = "employee"
    ROLE_CHOICES = [
        (EMPLOYER, "Employer"),
        (EMPLOYEE, "Employee"),
    ]

    user = models.OneToOneField(User, related_name="profile", on_delete=models.CASCADE)
    role = models.CharField(
        max_length=50,
        choices=ROLE_CHOICES,
        blank=False,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-created_at",)

    def __str__(self):
        return self.user.get_full_name()

