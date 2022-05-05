from django.core.exceptions import BadRequest, PermissionDenied
from django.db import DatabaseError
from django.core.paginator import EmptyPage
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .models import Group
from .serializers import GroupCreateSerializer, GroupSerializer
from rest_framework.parsers import FormParser, MultiPartParser
from account.permissions import AccountPermission
import json


class ListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated, ]


    def get(self, request):
        try:
            group = Group.objects.all().filter(
                group_user=request.user.id
            ).first()
            self.check_object_permissions(request, group.group_user)
            if 'page' not in request.query_params:
                raise BadRequest
            groups, pagination = Group.objects.groups(int(request.user.id),
                                 int(request.query_params['page']))

            if len(groups) == 0 and len(pagination) == 0:
                raise RuntimeError

            serializer = GroupSerializer(groups, many=True)
            return Response({
                                'message': 'success',
                                'groups': serializer.data,
                                'pagination': pagination
                            }, status=status.HTTP_200_OK)
        except (Exception, BadRequest, ) as e:
            if isinstance(e, BadRequest):
                return Response({
                                'message': 'Something went wrong'
                                }, status=status.HTTP_400_BAD_REQUEST)
            elif isinstance(e, RuntimeError):
                return Response({
                                'message': 'Something went wrong'
                                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response({
                                'message': 'Something went wrong'
                            }, status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        try:
            serializer = GroupCreateSerializer(data=request.data)
            if serializer.is_valid():
                group = serializer.create(serializer.validated_data, request.user)
                if group is not None:
                    group_serializer = GroupSerializer(group)
                    return Response({
                            'message': 'success',
                            'group': group_serializer.data
                        }, status=status.HTTP_201_CREATED)
            else:
                error = ''
                if 'title' in serializer.errors:
                    error = serializer.errors['title']
                return Response({
                                    'error': error,
                                }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e, type(e))
            return Response(
                {
                    'message': 'Something went wrong.'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
