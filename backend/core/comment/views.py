from django.core.exceptions import BadRequest, ObjectDoesNotExist, PermissionDenied
from django.db.utils import DatabaseError, OperationalError
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.views import APIView
from account.permissions import AccountPermission
from .serializers import CommentCreateSerializer, CommentSerializer
from .models import Comment




class DetailAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly, AccountPermission, ]

    def delete(self, request, pk=None):
        try:
            comment = Comment.objects.get(pk=pk)
            if comment:
                self.check_object_permissions(request, comment.user)
                comment.delete()
            return Response({
                            'message': 'success'
                        },status=status.HTTP_200_OK)

        except PermissionDenied:
                return Response({
                                'message': 'Cannot delete another user comment'
                                },
                                status=status.HTTP_403_FORBIDDEN
                                )




class ListCreateAPIView(APIView):

    permission_classes = [IsAuthenticatedOrReadOnly, ]
    queryset = Comment.objects.all()


    def get(self, request):
        try:
            queryset = Comment.objects.get_comments(params=request.query_params)
            serializer = CommentSerializer(queryset['comments'], many=True)


            return Response({

                            'message': 'success',
                            'comments': serializer.data,
                            'page': queryset['page'], 
                            'has_next_page': queryset['has_next_page']
                            }, status=status.HTTP_200_OK)
        except ValueError as e:
            print(e)
            if isinstance(e, type(e)):
                return Response(
                        {'message': 'Bad Request.',
                         'error': 'URL was malformed.'
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )
            else:
                return Response({
                                    'message': 'Something went wrong'
                                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            create_serializer = CommentCreateSerializer(data=request.data)
            try:
                comment_exceeded = Comment.objects.check_comment_limit(
                            request.data['post'], 
                            request.data['user']
                            )

                if comment_exceeded:
                    raise BadRequest
            except BadRequest:
                return Response(
                    {'error': {'field': ['Five comments per Five minutes on the same post.']}},
                    status=status.HTTP_400_BAD_REQUEST
                )


            if create_serializer.is_valid():
                create_serializer.create(validated_data=create_serializer.validated_data)
                new_comment = Comment.objects.get_comment_by_user(
                    pk=create_serializer.validated_data['user'])

                if not new_comment:
                    raise ObjectDoesNotExist

                serializer = CommentSerializer(new_comment)


                return Response(
                    {
                        'message': 'success',
                        'comment': serializer.data
                    }, status=status.HTTP_201_CREATED)
            else:
                return Response(
                    {'message': 'Something went wrong, make suring you have filled out a field.',
                     'error': create_serializer.errors
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

        except (OperationalError, ObjectDoesNotExist):
            return Response(
                {'message': 'Something went wrong adding a new comment'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
