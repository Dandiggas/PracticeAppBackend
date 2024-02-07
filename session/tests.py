from django.contrib.auth import get_user_model
from django.test import TestCase
from datetime import timedelta, date

from .models import Session

class SessionTests(TestCase):
    @classmethod
    def setUpTestData(cls) -> None:
        cls.user = get_user_model().objects.create_user(
            username="testuser",
            email="test@email.com",
            password="secret",
        )
        duration = timedelta(hours=1) 
        session_date = date(2024, 2, 7)

        cls.session = Session.objects.create(
            user=cls.user,
            instrument="drums",
            duration=duration,
            description="rudiments",
            session_date=session_date  
        )

    def test_session_model(self):
        self.assertEqual(self.session.user.username, "testuser")
        self.assertEqual(self.session.instrument, "drums")
        self.assertEqual(self.session.duration, timedelta(hours=1))  
        self.assertEqual(self.session.description, "rudiments") 
        self.assertEqual(self.session.session_date, date(2024, 2, 7))  


