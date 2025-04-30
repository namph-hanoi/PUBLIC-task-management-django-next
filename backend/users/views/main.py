from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import RegisterView, SocialLoginView
from dj_rest_auth.views import LoginView
from rest_framework_simplejwt.views import TokenRefreshView
from django.contrib.auth import get_user_model
from django.utils.translation import gettext as _
from rest_framework import permissions, status
from rest_framework.generics import (
    GenericAPIView,
    RetrieveAPIView,
    RetrieveUpdateAPIView,
)
from rest_framework.response import Response
from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from users.models import Profile
from tasks.models import Task
from django.contrib.auth import get_user_model
from django.db.models import Count, Q

from users.permissions import IsUserProfileOwner
from users.serializers import (
    CustomTokenRefreshSerializer,
    ProfileSerializer,
    UserLoginSerializer,
    UserRegistrationSerializer,
    UserSerializer,
)
from django.conf import settings


User = get_user_model()


class UserRegisterationAPIView(RegisterView):
    """
    Register new users using email and password.
    """
    serializer_class = UserRegistrationSerializer
    authentication_classes = []

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        response_data = ""

        email = request.data.get("email", None)

        if email:
            response_data = {"detail": _("User regitstered.")}

        return Response(response_data, status=status.HTTP_201_CREATED, headers=headers)


class UserLoginAPIView(LoginView):
    """
    Authenticate existing users using email and password.
    """
    authentication_classes = []
    serializer_class = UserLoginSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        # If login is successful, add the user's role to the response
        if response.status_code == status.HTTP_200_OK:
            user = None
            # Try to get user from serializer context or request
            if hasattr(response, 'data') and 'user' in getattr(getattr(self, 'serializer', None), 'validated_data', {}):
                user = self.serializer.validated_data['user']
            else:
                user = getattr(request, 'user', None)
            if user and hasattr(user, 'profile'):
                response.data['user_role'] = user.profile.role
        return response


class GoogleLogin(SocialLoginView):
    """
    Social authentication with Google
    """

    adapter_class = GoogleOAuth2Adapter
    callback_url = "call_back_url"
    client_class = OAuth2Client


class ProfileAPIView(RetrieveUpdateAPIView):
    """
    Get, Update user profile
    """

    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = (IsUserProfileOwner,)

    def get_object(self):
        return self.request.user.profile


class UserAPIView(RetrieveAPIView):
    """
    Get user details
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user

    
class CustomTokenRefreshView(TokenRefreshView):

    serializer_class = CustomTokenRefreshSerializer
    
    def post(self, request, *args, **kwargs):
        response = super().post(
            request, 
            *args, **kwargs,
        )
        
        if response.status_code == status.HTTP_200_OK and 'refresh' in response.data:
            cookie_max_age = settings.JWT_AUTH_COOKIE_MAX_AGE
            response.set_cookie(
            settings.JWT_AUTH_REFRESH_COOKIE,
            response.data['refresh'],
            max_age=cookie_max_age,
            httponly=True,
            samesite=settings.JWT_AUTH_COOKIE_SAMESITE,
            secure=settings.JWT_AUTH_COOKIE_SECURE
            )
            
        return response


class EmployeeSummaryView(APIView):
    permission_classes = [IsAuthenticated]


    def get(self, request, *args, **kwargs):
        user = request.user
        if not hasattr(user, 'profile') or user.profile.role != Profile.EMPLOYER:
            return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)

        User = get_user_model()
        employees = User.objects.filter(profile__role=Profile.EMPLOYEE).annotate(
            no_task_total=Count('tasks'),
            no_task_completed=Count('tasks', filter=Q(tasks__status=Task.STATUS_COMPLETED))
        )
        data = [
            {
                'employee_id': employee.id,
                'employee_email': employee.email,
                'no_task_total': employee.no_task_total,
                'no_task_completed': employee.no_task_completed,
            }
            for employee in employees
        ]
        return Response(data)