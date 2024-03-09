from django.urls import path
from .views import SessionList, SessionDetail, PracticeRecommendationView


urlpatterns = [
    path("<int:pk>/", SessionDetail.as_view(), name="session_detail"),
    path("", SessionList.as_view(), name="session_list"),
    path('recommendations/', PracticeRecommendationView.as_view(), name='practice-recommendation'),
]
