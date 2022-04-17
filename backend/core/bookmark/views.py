from django.core.exceptions import PermissionDenied
from django.db.utils import OperationalError
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from account.permissions import AccountPermission
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .serializers import BookmarkCreateSerializer
from .models import Bookmark

class ListCreateAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly, AccountPermission, ]
    queryset = Bookmark.objects.all()
    def post(self, request):
        try:
            serializer = BookmarkCreateSerializer(data=request.data)
            if serializer.is_valid():
                serializer.create(serializer.validated_data)

            else:
                return Response(
                    {'message': 'Make sure you have post id and user id.',
                     'error': serializer.errors
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            return Response(
                {
                    'message': 'success'
                },
                status=status.HTTP_201_CREATED
            )

        except OperationalError as e:
            print(e)
            return Response(
                {
                    'message': 'Something went wrong.'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )



class DetailAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly, AccountPermission, ]

    def delete(self, request, pk=None):
            try:
                bookmark = Bookmark.objects \
            .filter(post_id=pk) \
            .filter(user_id=request.user.id).first()
                if bookmark:
                    self.check_object_permissions(request, bookmark.user)
                    bookmark.delete()
                return Response(
                    {
                        'message': 'success'
                    },
                    status=status.HTTP_201_CREATED
                )

            except PermissionDenied as e:
                print(e)
                return Response(
                    {
                        'message': 'Something went wrong.'
                    },
                    status=status.HTTP_403_FORBIDDEN
                )

