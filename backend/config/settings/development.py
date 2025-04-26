import os

from .base import *

MEDIA_URL = "/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "../", "mediafiles")


STATIC_URL = "static/"
STATIC_ROOT = os.path.join(BASE_DIR, "../", "staticfiles")

INSTALLED_APPS = [*INSTALLED_APPS, "django_extensions"]
