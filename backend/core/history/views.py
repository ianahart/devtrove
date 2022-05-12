# pyright: reportGeneralTypeIssues=false
import logging
from django.core.exceptions import EmptyResultSet
from django.db import OperationalError, DatabaseError
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed, PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from account.permissions import AccountPermission
from .models import History
from .serializers import HistoryCreateSerializer, HistorySerializer
logger = logging.getLogger('django')



class DetailAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly, AccountPermission, ]


    def delete(self, request, pk=None):
        try:
            history = History.objects.get(pk=pk)
            self.check_object_permissions(request, history.user)
            history.delete()

            return Response({'message':'success'},status=status.HTTP_200_OK)
        except PermissionDenied:
            message = 'User does not have permission to delete another user\'s history'
            logger.error(message)
            return Response(
                {'message': message},
                status=status.HTTP_403_FORBIDDEN
            )





class ListCreateAPIView(APIView):
    queryset = History.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly, ]

    def get(self, request):
        try:
            if not request.user.is_authenticated:
                raise AuthenticationFailed

            history, pagination = History.objects.get_history(
                request.user.id, int(request.query_params['page']))

            today, previous = history
            if len(today) == 0 and len(previous) == 0:
                raise EmptyResultSet

            today_serializer = HistorySerializer(history[0], many=True)
            previous_serializer = HistorySerializer(history[1], many=True)
            return Response({
                                'message': 'success',
                                'today_posts': today_serializer.data,
                                'previous_posts': previous_serializer.data,
                                'pagination':pagination,
                            }, status=status.HTTP_200_OK)


        except (EmptyResultSet, AuthenticationFailed, ) as e:
            if isinstance(e, EmptyResultSet):
                return Response({
                    'message': 'success',
                    'today_posts': [],
                    'previous_posts': [],
                    'pagination': {}
                }, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response(
                    {
                        'message': 'User is not authenticated.'
                    },
                    status=status.HTTP_401_UNAUTHORIZED
                )



    def post(self, request):
        try:
            serializer = HistoryCreateSerializer(data=request.data)

            if serializer.is_valid():
                serializer.create(request.user.id, serializer.data)
                return Response(
                    {
                        'message': 'success'
                    },
                    status=status.HTTP_201_CREATED
                )

            else:
                return Response(
                    {
                        'message': 'Validation failed.',
                        'error': serializer.errors
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
        except (OperationalError, DatabaseError):
            return Response(
                {
                    'message': 'Did not find any prior reading history.'
                },
                status=status.HTTP_404_NOT_FOUND
            )

