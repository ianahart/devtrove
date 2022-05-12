from django.core.exceptions import BadRequest, ObjectDoesNotExist, PermissionDenied
from typing import Optional
from django.db.utils import OperationalError
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from chat.serializers import MessageSerializer
from .models import Message
from group.models import Group
from account.permissions import AccountPermission

class ListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated, ]


    def get(self, request):
        try:

            group = None

            if 'group' not in request.query_params or 'page' not in request.query_params:
                raise BadRequest('Unable to fetch group messages...')
            group = int(request.query_params['group'])
            page = int(request.query_params['page'])
            if group is not None:

                group = Group.objects.get(pk=group)
                messages, pagination = Message.objects.messages(group, page)

                if len(messages) == 0 and len(pagination) == 0:
                    raise ObjectDoesNotExist('No more messages to show.')
                serializer = MessageSerializer(messages, many=True)
                return Response({
                                    'message': 'success',
                                    'messages': serializer.data,
                                    'pagination': pagination
                                }, status=status.HTTP_200_OK)

        except (Exception, BadRequest, ObjectDoesNotExist) as e:
            print(e, type(e))
            if isinstance(e, ObjectDoesNotExist):
                return Response(
                    {'error': str(e)},
                    status=status.HTTP_404_NOT_FOUND
                )
            if isinstance(e, BadRequest):
                return Response(
                                {'error': str(e)},
                    status=status.HTTP_400_BAD_REQUEST)
            return Response(
                {'message': 'Something went wrong'}
                ,status=status.HTTP_500_INTERNAL_SERVER_ERROR)

