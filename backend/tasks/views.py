from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


from .models import Task
from users.models import Profile
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
        query_parameters = self.request.query_params
        assignee = query_parameters.get('assignee')
        status_param = query_parameters.get('status')
        query_filters = {}
        
        if role == Profile.EMPLOYEE:
            query_filters['assignee'] = user
        elif assignee:
            query_filters['assignee'] = assignee
            
        if status_param:
            query_filters['status'] = status_param
        if query_filters:
            qs = qs.filter(**query_filters)
        return qs

    def perform_create(self, serializer):
        serializer.save()
    
    # TODO: move to the TaskItemViewSet
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user
        role = getattr(getattr(user, 'profile', None), 'role', None)
        # Employees cannot change date_due
        if role == Profile.EMPLOYEE and \
        ('date_due' in request.data or \
        'date_creation' in request.data):
            return Response({'detail': 'Employees cannot change date.'}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)


class TaskItemViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    # permission_classes = [IsTaskByBuyerOrAdmin]

    # def get_serializer_class(self):
    #     if self.action in ("create", "update", "partial_update", "destroy"):
    #         return TaskWriteSerializer

    #     return TaskReadSerializer

    # def get_queryset(self):
    #     res = super().get_queryset()
    #     user = self.request.user
    #     return res.filter(buyer=user)

    # def get_permissions(self):
    #     if self.action in ("update", "partial_update", "destroy"):
    #         self.permission_classes += [IsTaskPending]

    #     return super().get_permissions()