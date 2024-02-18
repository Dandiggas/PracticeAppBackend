from django.urls import path
from .views import current_user_view



urlpatterns = [
        path('api/v1/current-user/', current_user_view, name='current-user'),
]


