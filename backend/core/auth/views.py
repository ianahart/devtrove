from rest_framework import permissions
from rest_framework_simplejwt.views import TokenObtainPairView

from account.models import CustomUser
from .serializers import LoginSerializer, LogoutSerializer
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated



class LogoutViewSet(viewsets.ViewSet):
    """
    A Viewset for logging out a user.
    """
    queryset = CustomUser.objects.all()
    permissions = (IsAuthenticated,)
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

class LoginViewSet(viewsets.ModelViewSet, TokenObtainPairView):
    """
    A Viewset for logging out a user.
    """
    def create(self, request):
        context = {'request': request.user}
        serializer = LoginSerializer(data=request.data, context=context)
        if serializer.is_valid():
            try:
                token, user = serializer.login(serializer.data)
                if token and user:
                    return Response(
                        { 'message': 'User authenticated. ',
                            'tokens': {
                            'access_token': str(token.access_token),
                            'refresh_token': str(token)
                            },
                            'user': {
                            'logged_in': True,
                            'handle': user.handle,
                            'id': user.id,
                            }
                        })
            except  Exception:
                return Response({
                                'email': 'Unauthorized, please create an account.'
                                }, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response(serializer.errors,
                status=status.HTTP_400_BAD_REQUEST)
