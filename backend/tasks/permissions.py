from rest_framework.permissions import BasePermission, SAFE_METHODS
from users.models import Profile

class IsEmployer(BasePermission):
    """Allow access only to employer users."""
    def has_permission(self, request, view):
        return hasattr(request.user, 'profile') and getattr(request.user.profile, 'role', None) == 'EMPLOYER'

class IsEmployee(BasePermission):
    """Allow access only to employee users."""
    def has_permission(self, request, view):
        return hasattr(request.user, 'profile') and getattr(request.user.profile, 'role', None) == 'EMPLOYEE'

class TaskRBACPermission(BasePermission):
    """Custom RBAC for TaskViewSet: Employees can only view/update their own tasks, cannot create; Employers can do all."""
    def has_permission(self, request, view):
        user = request.user
        if not user.is_authenticated:
            return False
        role = getattr(getattr(user, 'profile', None), 'role', None)
        if view.action == 'create':
            return role == Profile.EMPLOYER
        if view.action in ['list', 'retrieve', 'update', 'partial_update']:
            return True
        return False

    def has_object_permission(self, request, view, obj):
        user = request.user
        role = getattr(getattr(user, 'profile', None), 'role', None)
        if role == Profile.EMPLOYER:
            return True
        if role == Profile.EMPLOYEE:
            # Employees can only access their own tasks
            return obj.assignee == user
        return False
