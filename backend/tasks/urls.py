from rest_framework.routers import DefaultRouter
from .views import TaskViewSet

app_name = "tasks"

router = DefaultRouter()
router.register(r'', TaskViewSet)

urlpatterns = router.urls
