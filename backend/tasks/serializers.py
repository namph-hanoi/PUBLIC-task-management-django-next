from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'status', 'assignee',
            'date_creation', 'date_due', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'date_creation']

    def validate(self, data):
        if self.instance is None:  # create
            if not data.get('title'):
                raise serializers.ValidationError({'title': 'This field is required.'})
            if not data.get('assignee'):
                raise serializers.ValidationError({'assignee': 'This field is required.'})
        return data
