from django.urls import path
from .views import SeedAllView

app_name = 'seeds'

urlpatterns = [
    path('all/', SeedAllView.as_view(), name='seed_all'),
]
