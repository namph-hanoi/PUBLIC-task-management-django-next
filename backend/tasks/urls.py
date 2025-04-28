from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import TaskItemViewSet, TaskViewSet

app_name = "tasks"

router = DefaultRouter()
router.register(r"^(?P<task_id>\d+)/task-item", TaskItemViewSet)
router.register(r"", TaskViewSet)


urlpatterns = [
    path("", include(router.urls)),
]
