from rest_framework import generics
from rest_framework.decorators import authentication_classes
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken

from account.models import CustomUser
from .serializers import LoginSerializer, LogoutSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from account.serializers import CreateUserSerializer, UserSerializer
import logging
logger = logging.getLogger('django')


class RegisterView(generics.ListCreateAPIView):
    """
    A View for creating/registering a user.
    """
    permission_classes = [AllowAny, ]
    http_method_names = ['post']
    authentication_classes = []

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


class LogoutView(generics.ListCreateAPIView):
    """
    A View for logging out a user.
    """
    queryset = CustomUser.objects.all()
    permissions = [IsAuthenticated, ]
    def create(self, request):

       serializer = LogoutSerializer(data=request.data)
       is_logged_out = serializer.logout(request.data, request.user)
       if is_logged_out:
           return Response(
               {
                   'message': 'user logged out successfully.',
                   'pk': request.user.id},
               status=status.HTTP_200_OK)
       return Response(
                       {'message': 'token blacklisted.'},
                       status=status.HTTP_403_FORBIDDEN
                    )



class TokenObtainPairView(generics.ListCreateAPIView):
    """
    A View for logging a user in.
    """
    permission_classes = [AllowAny, ]
    http_method_names = ['post']
    authentication_classes = []




    def create(self, request):
        context = {'request': request.user}
        serializer = LoginSerializer(data=request.data, context=context)
        if serializer.is_valid():
            try:
                tokens, user = serializer.login(serializer.data)
                if len(tokens) and user:
                    return Response(
                        { 'message': 'User authenticated.',
                            'tokens': {
                                'access_token': tokens['access_token'],
                                'refresh_token': tokens['refresh_token'],
                            },
                            'user': {
                            'logged_in': True,
                           'handle': user.handle,
                            'id': user.id,
                            'avatar_url': user.avatar_url,
                            }
                        })
            except Exception:
                logger.error(msg='Problems with the login system')

                return Response({
                                'email': 'Unauthorized, please create an account.'
                                }, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response(serializer.errors,
                status=status.HTTP_400_BAD_REQUEST)
