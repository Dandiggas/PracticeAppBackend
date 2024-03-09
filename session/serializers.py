from rest_framework import serializers

from .models import Session


class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            "session_id",
            "display_id",
            "user",
            "instrument",
            "duration",
            "description",
            "session_date",
        )
        model = Session
        read_only_fields = ['display_id']

