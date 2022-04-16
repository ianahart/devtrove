from django.core.exceptions import PermissionDenied
from django.db.utils import OperationalError
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .serializers import LikeCreateSerializer
from like.models import Like
from account.permissions import AccountPermission



class ListCreateAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly, ]
    queryset = Like.objects.all()


    def post(self, request):
        try:
            serializer = LikeCreateSerializer(data=request.data)


            if serializer.is_valid(raise_exception=True):
                data = serializer.validated_data
                creds = {
                    'post_id': data['post'],
                    'comment_id': data['comment'],
                    'user_id': request.user.id
                }
                serializer.create(creds, validated_data=data)

            return Response({
                                'message': 'succesres'
                            }, status=status.HTTP_201_CREATED)

        except OperationalError as e:
            print(e, 'ERROR~!@~!@')
            return Response({
                        'message': 'Something went wrong. Unable like comment.'
                        },
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )




class DetailAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly, AccountPermission, ]
    def delete(self, request, pk=None):
        try:
            id = None

            like = Like.objects.all().filter(comment_id=pk) \
            .filter(user_id=request.user.id).first()
            if like:
               id = like.id
               self.check_object_permissions(request, like.user)
               like.delete() 
            return Response({
                        'message': 'Comment unliked',
                        'id': id,
                        },
                        status=status.HTTP_200_OK
                        )
        except PermissionDenied as e:
                print(e)
                return Response({
                            'message': 'You are not allowed to delete another user\'s like.'
                            },
                        status=status.HTTP_403_FORBIDDEN
                            )



