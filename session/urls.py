from django.urls import path
from .views import SessionList, SessionDetail


urlpatterns = [
    path("<int:pk>/", SessionDetail.as_view(), name="session_detail"),
    path("", SessionList.as_view(), name="session_list"),
]
