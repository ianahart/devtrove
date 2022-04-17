from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
import json

from account.permissions import AccountPermission
from language.serializers import LanguageCreateSerializer
from .serializers import UserSerializer, UserUpdateFormSerializer, UserPhotoSerializer
from account.models import CustomUser


#class ProfileAPIView(APIView):
#     queryset = CustomUser.objects.all()
#     permission_classes = [IsAuthenticated, ]
#
#    def get(self, request, pk=None)
#
class DetailAPIView(APIView):
    queryset = CustomUser.objects.all()
    permission_classes = [IsAuthenticated, AccountPermission, ]
    parser_classes = [ MultiPartParser, FormParser, ]

    def get(self, request, pk=None):
        user = CustomUser.objects.get(pk=pk)
        if user:
            self.check_object_permissions(request, user)

        if user:
            userSerializer = UserSerializer(user)
            return Response(userSerializer.data, status=status.HTTP_200_OK)
        else:
            return Response(
                {'message': 'User does not exist.'},
                status=status.HTTP_404_NOT_FOUND)



    def patch(self, request, pk=None):

        account = get_object_or_404(CustomUser, pk=pk)
        self.check_object_permissions(request, account)
        context = {'request': self.request}

        formSerializer = UserUpdateFormSerializer(context=context,
        data=json.loads(request.data['form'])
        )

        photoSerializer = UserPhotoSerializer(data=request.data)

        langSerializer = LanguageCreateSerializer(
        data=json.loads(request.data['languages']),
        many=True
        )
        serializers = [photoSerializer, langSerializer, formSerializer]
        if all([serializer.is_valid() for serializer in serializers]):
            try:
                file = photoSerializer.validated_data
                refresh_token = json.loads(request.data['form'])['refresh_token']
                if file is None:
                    raise Exception
                has_email_changed = formSerializer.update(
                                languages=langSerializer.data,
                                file=file['avatar'] if 'avatar' in file else None,
                                refresh_token=refresh_token,
                                validated_data=formSerializer.data,
                                pk=pk)
                if has_email_changed:
                    return Response({
                            'message': 'Email changed. Logging out',
                            'dir': 'no refresh'
                            },
                    status=status.HTTP_401_UNAUTHORIZED
                    )

                account.refresh_from_db()
                serializer = UserSerializer(account)
                user = serializer.data

                user_auth = {
                    'user': {
                        'id': user['id'],
                        'handle':user['handle'],
                        'logged_in': user['logged_in'],
                        'avatar_url':user['avatar_url'],
                    }
                }


                return Response(
                    {'message': 'Updating user.',
                        'user_auth': user_auth,
                    }, 
                    status=status.HTTP_200_OK)

            except Exception as e:
                print(e)
                return Response({
                                'message' : 'Internal Server Error. Something went wrong.',
                                'errors' : str(e)
                                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR
                                )
        else:
            errors = [serializer.errors for serializer in serializers]
            return Response(
                {
                    'message' : 'Something is wrong', 
                    'errors': errors
                }, status=status.HTTP_400_BAD_REQUEST
            )




