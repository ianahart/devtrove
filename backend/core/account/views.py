from rest_framework import generics,  serializers, viewsets, status
from rest_framework.response import Response
from .serializers import UserSerializer
from account.models import CustomUser
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404


class UserView(generics.ListCreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = [IsAuthenticated, ]

    def get(self, request, pk=None):
        if request.user.id != pk:
            return Response(
        {'message': 'Forbidden action'},
        status=status.HTTP_403_FORBIDDEN)
    
        user = CustomUser.objects.get(pk=pk)

        if user:
            user_serializers = UserSerializer(user)
            return Response(user_serializers.data, status=status.HTTP_200_OK)
        else:
            return Response(
                {'message': 'User does not exist.'},
                status=status.HTTP_404_NOT_FOUND)




