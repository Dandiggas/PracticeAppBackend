from django.urls import path
from .views import current_user_view, logout_view



urlpatterns = [
        path('api/v1/current-user/', current_user_view, name='current-user'),
        path('api/v1/logout/', logout_view, name='logout'),
]


