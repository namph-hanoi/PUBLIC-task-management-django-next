from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AddressViewSet,
    ProfileAPIView,
    SendOrResendSMSAPIView,
    UserAPIView,
    LoginViewCustom,
    UserRegisterationAPIView,
    VerifyPhoneNumberAPIView,
    CustomTokenRefreshView,
    TokenRefreshView,
)
# from rest_framework_simplejwt.views import TokenRefreshView



app_name = "users"

router = DefaultRouter()
router.register(r"", AddressViewSet)

urlpatterns = [
    path("register/", UserRegisterationAPIView.as_view(), name="user_register"),
    path("login/", LoginViewCustom.as_view(), name="user_login"),
    path("refresh-token/", TokenRefreshView.as_view(), name="refresh_token"),
    path("custom-refresh/", CustomTokenRefreshView.as_view(), name="custom_refresh_token"),
    path("send-sms/", SendOrResendSMSAPIView.as_view(), name="send_resend_sms"),
    path(
        "verify-phone/", VerifyPhoneNumberAPIView.as_view(), name="verify_phone_number"
    ),
    path("", UserAPIView.as_view(), name="user_detail"),
    path("profile/", ProfileAPIView.as_view(), name="profile_detail"),
    path("profile/address/", include(router.urls)),
]
