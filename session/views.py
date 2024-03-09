from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .models import Session
from .permissions import IsAdminOrOwner
from .serializers import SessionSerializer
from django.db.models import Max
import openai
import os

openai.api_key = os.environ.get('OPENAI_API_KEY')

class SessionList(generics.ListCreateAPIView):
    permission_classes = (IsAdminOrOwner,)
    serializer_class = SessionSerializer

    def get_queryset(self):
        if self.request.user.is_superuser:
            return Session.objects.all()
        return Session.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        max_display_id = Session.objects.filter(user=self.request.user).aggregate(Max('display_id'))['display_id__max'] or 0
        serializer.save(user=self.request.user, display_id=max_display_id + 1)

class SessionDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAdminOrOwner,)
    serializer_class = SessionSerializer

    def get_queryset(self):
        if self.request.user.is_superuser:
            return Session.objects.all()
        return Session.objects.filter(user=self.request.user)

class PracticeRecommendationView(APIView):
    permission_classes = (IsAdminOrOwner,)

    def post(self, request):
        user_id = request.data.get('user_id')
        skill_level = request.data.get('skill_level')
        instrument = request.data.get('instrument')
        goals = request.data.get('goals')

        if not user_id or not skill_level or not instrument or not goals:
            return Response({'error': 'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        prompt = f"Generate a practice recommendation for a {skill_level} level {instrument} player who wants to focus on {goals}."

        try:
            response = openai.Completion.create(
                engine='text-davinci-002',
                prompt=prompt,
                max_tokens=100,
                n=1,
                stop=None,
                temperature=0.7,
            )
            recommendation = response.choices[0].text.strip()

            session_data = {
                'user': user.id,
                'instrument': instrument,
                'skill_level': skill_level,
                'goals': goals,
                'recommendation': recommendation,
            }

            serializer = SessionSerializer(data=session_data)
            if serializer.is_valid():
                session = serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)