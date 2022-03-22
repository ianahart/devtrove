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
        user = get_object_or_404(CustomUser, id=pk)
        user_serializers = UserSerializer(user)
        return Response(user_serializers.data, status=status.HTTP_200_OK)




