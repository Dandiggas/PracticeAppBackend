from rest_framework import generics
from .models import Session
from .permissions import IsAdminOrOwner
from .serializers import SessionSerializer

class SessionList(generics.ListCreateAPIView):
    permission_classes = (IsAdminOrOwner,)
    serializer_class = SessionSerializer

    def get_queryset(self):
        # If the user is an admin (or superuser), return all sessions
        if self.request.user.is_superuser:
            return Session.objects.all()

        # Otherwise, return only the sessions that belong to the user
        return Session.objects.filter(user=self.request.user)


class SessionDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAdminOrOwner,)
    serializer_class = SessionSerializer

    def get_queryset(self):
        # If the user is an admin (or superuser), return all sessions
        if self.request.user.is_superuser:
            return Session.objects.all()

        # Otherwise, return only the sessions that belong to the user
        return Session.objects.filter(user=self.request.user)
