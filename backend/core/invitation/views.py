from django.core.exceptions import BadRequest, ObjectDoesNotExist, PermissionDenied
from django.db import DatabaseError
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response

from group.models import Group
from .models import Invitation
from .serializers import InvitationCreateSerializer,InvitationUpdateSerializer, InvitationAllSerializer
from account.permissions import AccountPermission





class DetailAPIView(APIView):
    permission_classes = [IsAuthenticated, AccountPermission, ]

    def delete(self, request, pk=None):
        try:
           invitation = Invitation.objects.get(pk=pk)
           if invitation is None:
               raise ObjectDoesNotExist
           self.check_object_permissions(request, invitation.user)
           invitation.delete()


           return Response(
                {
                    'message': 'success'
                }, status=status.HTTP_200_OK)

        except (PermissionDenied, ObjectDoesNotExist, ):
            return Response({
                                'error': 'Not Found'
                            }, status=status.HTTP_404_NOT_FOUND)
            return Response({
                    'error': 'Cannot deny another user\'s invitation.'
                    }, status.HTTP_403_FORBIDDEN)



    def patch(self, request, pk=None):
        try:
           invitation = Invitation.objects.get(pk=pk)
           self.check_object_permissions(request, invitation.user)
           serializer = InvitationUpdateSerializer(data=request.data)

           if serializer.is_valid():
                serializer.update(serializer.validated_data, pk)
                result = Group.objects.add(data=serializer.validated_data)
                if 'error' in result:
                    raise ObjectDoesNotExist
           else:
                return Response({
                                    'error': serializer.errors
                                },status=status.HTTP_400_BAD_REQUEST)

           return Response(
                {
                    'message': 'success'
                }, status=status.HTTP_200_OK)

        except (PermissionDenied, Exception,ObjectDoesNotExist ) as e:
            if isinstance(e, PermissionDenied):
                return Response({
                        'error': 'Cannot accept another user\'s invitation.'
                        }, status.HTTP_403_FORBIDDEN)
            if isinstance(e, ObjectDoesNotExist):
                return Response({'error': 'Not Found'}, status=status.HTTP_404_NOT_FOUND)

            return Response({
                    'error': 'Cannot accept another user\'s invitation.'
                    }, status.HTTP_500_INTERNAL_SERVER_ERROR)


class ListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated, ]


    def get(self, request):
        try:
            page = 0
            if 'page' in request.query_params:
                page = request.query_params['page']

            invitations, pagination = Invitation.objects.invitations(
                user_id=int(request.user.id), page=int(page))
            if len(invitations) == 0 and len(pagination) == 0:
                raise NotFound('Invitations are all loaded.')

            serializer = InvitationAllSerializer(invitations, many=True)
            return Response({
                                'message': 'success',
                                'invitations': serializer.data,
                                'pagination': pagination,
                            }, status.HTTP_200_OK)
        except (Exception, NotFound) as e:
            if isinstance(e, NotFound):
                return Response({'error': str(e)},
                                status=status.HTTP_404_NOT_FOUND)

            return Response({'message': 'Something went wrong.'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    def post(self, request):
        try:
            serializer = InvitationCreateSerializer(data=request.data)
            if serializer.is_valid():
                result = serializer.create(serializer.validated_data)
                if 'error' in result:
                    raise result['type'](result['error'])

                return Response({'message' : 'success'},
                                status=status.HTTP_200_OK
                                )
            else:
                return Response({'error': serializer.errors},
                                status=status.HTTP_400_BAD_REQUEST
                                )
        except (Exception, ObjectDoesNotExist, ) as e:
            if isinstance(e, BadRequest):
                return Response({'error': {'handle': str(e)}},
                                status=status.HTTP_400_BAD_REQUEST)

            if isinstance(e, ObjectDoesNotExist):
                return Response({'error' : str(e)}, status=status.HTTP_404_NOT_FOUND)

            return Response({'message': 'Something went wrong.'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            )
