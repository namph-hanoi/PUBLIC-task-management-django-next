from dj_rest_auth.registration.serializers import RegisterSerializer
from django.conf import settings
from django.contrib.auth import authenticate, get_user_model
from django.utils.translation import gettext as _
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenRefreshSerializer


from .exceptions import (
    AccountDisabledException,
    InvalidCredentialsException,
)
from .models import Profile

User = get_user_model()


class UserRegistrationSerializer(RegisterSerializer):
    """
    Serializer for registrating new users using email or phone number.
    """
    username = None
    first_name = serializers.CharField(required=True, write_only=True)
    last_name = serializers.CharField(required=True, write_only=True)
    
    email = serializers.EmailField(required=False)

    def validate(self, validated_data):
        email = validated_data.get("email", None)

        if not email:
            raise serializers.ValidationError(_("Enter an email."))

        if validated_data["password1"] != validated_data["password2"]:
            raise serializers.ValidationError(
                _("The two password fields didn't match.")
            )

        return validated_data

    def get_cleaned_data_extra(self):
        return {
            "first_name": self.validated_data.get("first_name", ""),
            "last_name": self.validated_data.get("last_name", ""),
        }

    def create_extra(self, user, validated_data):
        user.first_name = self.validated_data.get("first_name")
        user.last_name = self.validated_data.get("last_name")
        user.save()


    def custom_signup(self, request, user):
        self.create_extra(user, self.get_cleaned_data_extra())


class UserLoginSerializer(serializers.Serializer):
    """
    Serializer to login users with email .
    """

    email = serializers.EmailField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, style={"input_type": "password"})

    def _validate_email(self, email, password):
        user = None

        if email and password:
            user = authenticate(username=email, password=password)
        else:
            raise serializers.ValidationError(
                _("Enter an email and password.")
            )

        return user

    def validate(self, validated_data):
        email = validated_data.get("email")
        password = validated_data.get("password")

        user = None

        user = self._validate_email(email, password)

        if not user:
            raise InvalidCredentialsException()

        if not user.is_active:
            raise AccountDisabledException()


        validated_data["user"] = user
        return validated_data


class ProfileSerializer(serializers.ModelSerializer):
    """
    Serializer class to serialize the user Profile model
    """

    class Meta:
        model = Profile
        fields = (
            "role",
            "created_at",
            "updated_at",
        )




class UserSerializer(serializers.ModelSerializer):
    """
    Serializer class to seralize User model
    """

    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "is_active",
            "profile",
        )

class CustomTokenRefreshSerializer(TokenRefreshSerializer):
    """
    Custom Token Refresh Serializer that validates using cookies
    """
    token = serializers.CharField(required=False)
    
    def validate(self, attrs):
        request = self.context['request']
        
        # Check for token in request data
        token = attrs.get('token')
        if not token:
            raise serializers.ValidationError(_("Missing data token."))
        # If token not in request data, check cookie
        refresh_token = request.COOKIES.get(settings.JWT_AUTH_REFRESH_COOKIE)
            
        if not refresh_token:
            raise serializers.ValidationError(_('No valid refresh token found.'))
            
        # Add the token back to the validated data
        attrs['refresh'] = refresh_token
        super().validate(self, attrs)
        return attrs