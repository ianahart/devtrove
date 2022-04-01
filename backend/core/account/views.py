from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView
from account.permissions import AccountPermission
from language.serializers import LanguageCreateSerializer
from .serializers import UserSerializer, UserUpdateFormSerializer, UserPhotoSerializer
from account.models import CustomUser
from rest_framework.permissions import IsAuthenticated
import json

class DetailAPIView(APIView):
    queryset = CustomUser.objects.all()
    permission_classes = [IsAuthenticated, AccountPermission, ]
    parser_classes = [ MultiPartParser, FormParser, ]

    def get(self, request, pk=None):
        if request.user.id != pk:
            return Response(
        {'message': 'Forbidden action'},
        status=status.HTTP_403_FORBIDDEN)
        user = CustomUser.objects.get(pk=pk)

        if user:
            user_serializers = UserSerializer(user)
            return Response(user_serializers.data, status=status.HTTP_200_OK)
        else:
            return Response(
                {'message': 'User does not exist.'},
                status=status.HTTP_404_NOT_FOUND)



    def patch(self, request, pk=None):

        # permissions
        #serializing/validation
        # actual updated/s3
        print(request.user)

        # if request.user.id !== pk return 401
        # check if request.data is not empty return 400 if is
        formSerializer = UserUpdateFormSerializer(
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
                result = formSerializer.update(validated_data=formSerializer.data, pk=pk)
                return Response(
                    {'message': 'Updating user.'}, 
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



