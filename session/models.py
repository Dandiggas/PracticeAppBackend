from django.conf import settings 
from django.db import models
import datetime

class Session(models.Model):
    session_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    instrument = models.CharField(max_length=200, default='Insert instrument')
    duration = models.DurationField()
    description = models.CharField(max_length=200, default='Insert description')
    session_date = models.DateField()

    def __str__(self):
        return f"Event on {self.event_date.strftime('%d-%m-%Y')}"