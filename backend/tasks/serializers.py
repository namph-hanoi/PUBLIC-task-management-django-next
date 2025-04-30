from rest_framework import serializers

from .models import Task
from users.models import Profile

class TaskSerializer(serializers.ModelSerializer):
    assignee_email = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'status', 'assignee',
            'assignee_email',
            'date_creation', 'date_due', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'date_creation']

    def get_assignee_email(self, obj):
        # Return the assignee's email
        return getattr(obj.assignee, 'email', str(obj.assignee))

    def validate(self, data):
        if self.instance is None:  # create
            if not data.get('title'):
                raise serializers.ValidationError({'title': 'This field is required.'})
            if not data.get('assignee'):
                raise serializers.ValidationError({'assignee': 'This field is required.'})
        return data

    def update(self, instance, validated_data):
        request = self.context.get('request')
        user = getattr(request, 'user', None)
        role = getattr(getattr(user, 'profile', None), 'role', None)

        if role == Profile.EMPLOYEE:
            if set(validated_data.keys()) - {'status'}:
                raise serializers.ValidationError('Employees can only update the status field.')
            instance.status = validated_data.get('status', instance.status)
        elif role == Profile.EMPLOYER:
            for field in validated_data:
                if field in ['created_at', 'updated_at']:
                    continue
                setattr(instance, field, validated_data[field])
        else:
            raise serializers.ValidationError('Invalid user role.')
        instance.save()
        return instance
