from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import CustomUserSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user_view(request):
    print("User:", request.user)  # Print the user's information
    print("Request data:", request.data)  # Print the request data (may be empty for GET requests)
    serializer = CustomUserSerializer(request.user)
    return Response(serializer.data)
