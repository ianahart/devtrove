from django.core.exceptions import BadRequest, ObjectDoesNotExist
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from .models import Invitation
from .serializers import InvitationCreateSerializer, InvitationAllSerializer

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
