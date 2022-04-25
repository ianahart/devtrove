from rest_framework import generics
from rest_framework.exceptions import PermissionDenied
from django.core.exceptions import BadRequest
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken

from account.models import CustomUser
from .serializers import ChangePasswordSerializer, LoginSerializer, LogoutSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from account.serializers import CreateUserSerializer, UserSerializer
from setting.models import Setting
from account.permissions import AccountPermission
import logging
logger = logging.getLogger('django')



class ChangePasswordAPIView(APIView):
    permission_classes = [IsAuthenticated, AccountPermission, ]

    def patch(self, request, pk=None):
        try:

            user = CustomUser.objects.get(pk=pk)
            self.check_object_permissions(request, user)

            serializer = ChangePasswordSerializer(data=request.data)
            if serializer.is_valid():
                result = serializer.update(user_id=pk, **serializer.data)
                if result['type'] == 'error':
                    raise BadRequest
                return Response(
                    {
                        'message': 'success'
                    }, status.HTTP_200_OK)
            else:
                return Response(
                    {
                        'message': 'Validation errors.',
                        'error': serializer.errors
                    }, status=status.HTTP_400_BAD_REQUEST)
        except (Exception, PermissionDenied, BadRequest, ) as e:
            print(e, type(e))
            if isinstance(e, PermissionDenied):
                return Response(
                    {
                      'errors': str(e)
                    },status.HTTP_403_FORBIDDEN)
            elif isinstance(e, BadRequest):
                return Response(
                    {
                        'error':{'error': ['Password cannot be the same as old password.']},
                    }, status=status.HTTP_400_BAD_REQUEST)
            return Response(
                {
                    'message': 'Something went wrong. Unable to process request.'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
            user = serializer.create(serializer.data)
            Setting.objects.create(user.id)
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
                            'setting_id': user.user_settings.id,
                                'theme': user.user_settings.theme.lower(),
                            'avatar_url': user.avatar_url,
                            }
                        })
            except Exception as e:
                logger.error(msg='Problems with the login system')

                return Response({
                                'email': 'Please create an account.'
                                }, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.errors,
                status=status.HTTP_400_BAD_REQUEST)
