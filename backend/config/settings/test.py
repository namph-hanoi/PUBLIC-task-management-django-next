"""
Test settings for the Django project.
Extended from the base settings.
"""

from .base import *  # noqa

# Use in-memory SQLite for tests for speed
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",
    }
}

# Turn off debug mode for tests
DEBUG = False

# Speed up password hashing in tests
PASSWORD_HASHERS = ["django.contrib.auth.hashers.MD5PasswordHasher"]

# Disable caching in tests
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.dummy.DummyCache",
    }
}

# Media files handling for tests
DEFAULT_FILE_STORAGE = "django.core.files.storage.InMemoryStorage"

# Email backend for testing
EMAIL_BACKEND = "django.core.mail.backends.locmem.EmailBackend"
