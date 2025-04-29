from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    ProfileAPIView,
    UserAPIView,
    UserLoginAPIView,
    UserRegisterationAPIView,
    CustomTokenRefreshView,
    TokenRefreshView,
    EmployeeSummaryView,
)
# from rest_framework_simplejwt.views import TokenRefreshView

app_name = "users"

router = DefaultRouter()

urlpatterns = [
    path("register/", UserRegisterationAPIView.as_view(), name="user_register"),
    path("login/", UserLoginAPIView.as_view(), name="user_login"),
    path("refresh-token/", TokenRefreshView.as_view(), name="refresh_token"),
    path("custom-refresh/", CustomTokenRefreshView.as_view(), name="custom_refresh_token"),
    path("", UserAPIView.as_view(), name="user_detail"),
    path("profile/", ProfileAPIView.as_view(), name="profile_detail"),
    path("profile/address/", include(router.urls)),
    path("employee-summary/", EmployeeSummaryView.as_view(), name="employee-summary"),
]
