from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Task
from .serializers import TaskSerializer
from .permissions import TaskRBACPermission

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated, TaskRBACPermission]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['date_creation', 'date_due', 'status']
    ordering = ['-date_creation']

    def get_queryset(self):
        user = self.request.user
        role = getattr(getattr(user, 'profile', None), 'role', None)
        qs = super().get_queryset()
        # Manual filtering by assignee and status
        assignee = self.request.query_params.get('assignee')
        status_param = self.request.query_params.get('status')
        if role == 'EMPLOYEE':
            qs = qs.filter(assignee=user)
        if assignee:
            qs = qs.filter(assignee=assignee)
        if status_param:
            qs = qs.filter(status=status_param)
        return qs

    def perform_create(self, serializer):
        serializer.save()

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user
        role = getattr(getattr(user, 'profile', None), 'role', None)
        # Employees cannot change date_due
        if role == 'EMPLOYEE' and 'date_due' in request.data:
            return Response({'detail': 'Employees cannot change date_due.'}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)
