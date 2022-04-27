from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from account.permissions import AccountPermission
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import OperationalError, DatabaseError
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed, PermissionDenied
from .models import Setting


class PreferredLanguageAPIView(APIView):

    permission_classes = [IsAuthenticated, AccountPermission, ]

    def patch(self, request, pk=None): 
        try:
            setting = Setting.objects.get(pk=pk)
            self.check_object_permissions(request, setting.user)

            settings = request.data['preferred_language']
            Setting.objects.update_preferred_language(settings, pk)

            return Response(
                {
                    'message': 'success'
                }, status=status.HTTP_200_OK)

        except (PermissionDenied, AttributeError,  Exception, ) as e:
            if isinstance(e, PermissionDenied):
                return Response({
                                    'message': "You don't have necessary permission for this action"
                                }, status=status.HTTP_403_FORBIDDEN)
            return Response(
                {'message': 'Something went wrong. Internal Server Error'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ThemeAPIView(APIView):
    permission_classes = [IsAuthenticated, AccountPermission, ]
    def patch(self, request, pk=None):
        try:
            setting = Setting.objects.get(pk=pk)
            if int(request.data['data']['user']) != setting.user_id:
                raise PermissionDenied
            self.check_object_permissions(request, setting.user)

            updated_setting = Setting.objects.update_theme(request.data, pk)

            return Response(
                {'message': 'success',
                'theme': updated_setting.theme
                },
                        status=status.HTTP_200_OK
                            )

        except (PermissionDenied, AttributeError,  Exception, ) as e:
            if isinstance(e, PermissionDenied):
                return Response({
                                    'message': "You don't have necessary permission for this action"
                                }, status=status.HTTP_403_FORBIDDEN)
            return Response(
                {'message': 'Something went wrong. Internal Server Error'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
