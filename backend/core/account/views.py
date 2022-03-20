from rest_framework import  viewsets, status
from rest_framework.response import Response
from .serializers import CreateUserSerializer

class UserViewSet(viewsets.ViewSet):
    """
    A Viewset for creating a user.
    """
    def create(self, request):
        serializer = CreateUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.create(serializer.data)
            return Response(
                {'message': 'User Created.'},
                status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors,
            status=status.HTTP_400_BAD_REQUEST)

