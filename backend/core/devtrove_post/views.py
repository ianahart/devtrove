from django.core.exceptions import BadRequest, ObjectDoesNotExist, PermissionDenied
from django.core.paginator import EmptyPage
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.views import APIView
from account.permissions import AccountPermission
from .models import DevtrovePost
from .serializers import DevtrovePostMinimalSerializer, DevtrovePostCreateSerializer, DevtrovePostSerializer



class DetailAPIView(APIView):
    def get(self, request, pk=None):
        permission_classes = [IsAuthenticatedOrReadOnly, ]
        try:
            instance = DevtrovePost.objects.get(pk=pk)
            if instance:
                serializer = DevtrovePostSerializer(instance)
                return Response({
                                'message': 'success',
                                'post': serializer.data,
                                }, status=status.HTTP_200_OK)
            else:
                raise ObjectDoesNotExist('Could not find post.')
        except (Exception, BadRequest, ValueError, ) as e:
            if isinstance(e, ObjectDoesNotExist):
                return Response({
                                'error': str(e)
                                }, status=status.HTTP_404_NOT_FOUND)
            elif isinstance(e, ValueError):
                return Response({
                                'error': str(e)
                                }, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response(
                    {
                        'message': 'Something went wrong.'
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated, ]
    def post(self, request):
        try:
            if request.user.id != request.data['user']:
                raise PermissionDenied('You do not have access.')

            serializer = DevtrovePostCreateSerializer(data=request.data)
            if serializer.is_valid():
                result = serializer.create(validated_data=serializer.data)

                if isinstance(result, dict):
                    raise ValueError(str(result['error']))

                serializer = DevtrovePostMinimalSerializer(result)
                return Response(
                                {'message': 'success',
                                    'devtrove_post': serializer.data
                                    },
                                status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except (BadRequest, ValueError, PermissionDenied ) as e:
            if isinstance(e, ValueError):
                return Response({
                        'error': str(e),
                    },status=status.HTTP_400_BAD_REQUEST)

            if isinstance(e, PermissionDenied):
                return Response({
                                    'message': str(e),
                                },status=status.HTTP_403_FORBIDDEN)
            return Response({
                            'message': 'Something went wrong'
                            },status=status.HTTP_500_INTERNAL_SERVER_ERROR)

