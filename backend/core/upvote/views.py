from django.db.utils import OperationalError
from rest_framework import status
from rest_framework.exceptions import ParseError
from django.core.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.views import APIView
from account.permissions import AccountPermission
from upvote.models import Upvote
from upvote.serializers import UpvoteCreateSerializer




class DetailAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly, AccountPermission, ]

    def delete(self, request, pk=None):
        try:
            upvote = Upvote.objects.all().filter(post_id=pk) \
            .filter(user_id=request.user.id).first()
            if upvote:
                self.check_object_permissions(request, upvote.user)
                upvote.delete()
            return Response({
                            'message': 'success'
                        },status=status.HTTP_200_OK)

        except PermissionDenied:
                return Response({
                                'message': 'Cannot delete another user\'s vote'
                                },
                                status=status.HTTP_403_FORBIDDEN
                                )



class ListCreateAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly, AccountPermission, ]


    def post(self, request):
        try:
            if request.data['user'] != request.user.id:
                raise PermissionDenied

            serializer = UpvoteCreateSerializer(data=request.data)
            try:
                if not serializer.is_valid():
                    raise ParseError
            except ParseError:
                return Response(serializer.errors,
                                status=status.HTTP_400_BAD_REQUEST)

            upvote = serializer.create(
                              validated_data=serializer.validated_data)

            return Response({
                                'message': 'success'
                            }, status=status.HTTP_201_CREATED)
        except (PermissionDenied, OperationalError, ) as e:
            if isinstance(e, PermissionDenied):
                return Response({
                                'message:' 'Access Forbidden',
                            }, status=status.HTTP_403_FORBIDDEN)
            else:
                return Response({
                                'message:' 'Something went wrong.',
                            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



#class DetailAPIView(APIView):
#    permission_classes = [IsAuthenticatedOrReadOnly, AccountPermission, ]
#
#
#    def post(self, request):
#        try:
#            return Response({
#                                'message': 'success'
#                            }, status=status.HTTP_201_CREATED)
#        except Exception as e: 
#            print(e)
#            return Response({
#                                'message:' 'Something went wrong',
#                            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
