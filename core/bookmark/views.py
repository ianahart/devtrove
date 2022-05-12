from django.core.exceptions import ObjectDoesNotExist, PermissionDenied
from django.db.utils import OperationalError
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from account.permissions import AccountPermission
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .serializers import BookmarkCreateSerializer, BookMarkSerializer
from post.serializers import PostSerializer
from .models import Bookmark


class ListCreateAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly, AccountPermission, ]
    queryset = Bookmark.objects.all()


    def get(self, request):
        try:
            if request.user.is_authenticated:
                bookmarks, paginator = Bookmark.objects.get_bookmarks(
                                                user=request.user,
                                                params=request.query_params
                                                                      )
                serializer = BookMarkSerializer(bookmarks, many=True)

                return Response(
                            {
                                'message': 'success',
                                'bookmarked_posts': serializer.data,
                                'paginator': paginator
                            },status=status.HTTP_200_OK)

        except ObjectDoesNotExist:
            return Response(
                {
                    'message': 'All bookmarked posts have been loaded.'
                })
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
                bookmark = None
                if 'initiator' in request.query_params:
                    bookmark = Bookmark.objects \
                .filter(post_id=pk) \
                .filter(user_id=request.user.id).first()
                else:
                    bookmark = Bookmark.objects.get(pk=pk)
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

