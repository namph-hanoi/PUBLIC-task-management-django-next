from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

class Task(models.Model):
    STATUS_IN_PROGRESS = 1
    STATUS_COMPLETED = 2
    STATUS_PENDING = 3
    STATUS_CHOICES = [
        (STATUS_IN_PROGRESS, 'In Progress'),
        (STATUS_COMPLETED, 'Completed'),
        (STATUS_PENDING, 'Pending'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    status = models.IntegerField(
        choices=STATUS_CHOICES,
        default=STATUS_IN_PROGRESS
    )
    assignee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')
    date_creation = models.DateTimeField(default=timezone.now)
    date_due = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
