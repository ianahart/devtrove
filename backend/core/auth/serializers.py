from datetime import timedelta
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from account.models import CustomUser
import re



class ChangePasswordSerializer(serializers.ModelSerializer):
    confirmpassword = serializers.CharField()
    refresh_token = serializers.CharField()
    password = serializers.CharField()
    class Meta:

        model = CustomUser
        fields = ('confirmpassword', 'password',  'refresh_token', )
        extra_kwargs = {'password': {'write_only': True},
            'confirmpassword': {'write_only': True}}

    def validate_password(self, value):
        pattern = re.compile(r'^(?=.*[\w])(?=.*[\W])[\w\W]{8,}$')
        matched = re.fullmatch(pattern, value)
        if not matched:
            raise serializers.ValidationError('Password must contain 1 special character, 1 number, and a lowercase and uppercase letter.')
        return value


    def validate(self, data):
        if data['password'] != data['confirmpassword']:
            raise serializers.ValidationError({'confirmpassword': 'Passwords do not match.'})

        return data

    def update(self,user_id:int, **validated_data):
        result = CustomUser.objects.change_password(user_id=user_id, **validated_data) 
        if result['type'] == 'ok': 
            token = RefreshToken(validated_data['refresh_token'])
            user = CustomUser.objects.get(pk=user_id)
            user.set_logged_in(False)
            token.blacklist()
        return result



class LogoutSerializer(serializers.ModelSerializer):
    refresh_token = serializers.CharField()
    class Meta:
        model = CustomUser
        fields = ('id', 'refresh_token')

    def logout(self, data, req_user):
        refresh_token = data['refresh_token']

        try:
            if req_user.pk != data['pk']:
                raise TokenError

            user = CustomUser.objects.get(pk=req_user.pk)
            if  user:
                token = RefreshToken(refresh_token)
                token.blacklist()

                user.set_logged_in(False)
                return True
        except TokenError:
            return False

class LoginSerializer(TokenObtainPairSerializer):

    class Meta:
        model = CustomUser
        fields = ('id', 'email')
        extra_kwargs = {
            'id': {'read_only': True},
            'email': {'read_only': True}
        }

    def validate(self, data):
        user = CustomUser.objects.retrieve_user_by_email(email=data['email'])

        if user is None:
            raise serializers.ValidationError(dict(email=['User does not exist.']))

        if not user.check_password(data['password']):
            raise serializers.ValidationError(dict(password=['Invalid email and password.']))
        return data

    def login(self, validated_data):
        user = CustomUser.objects.retrieve_user_by_email(self.data.get('email'))

        if user is not None:
            user.set_logged_in(True)

            refresh_token = RefreshToken.for_user(user)
            access_token = refresh_token.access_token

            access_token.set_exp(lifetime=timedelta(days=3))

            tokens = {
                'access_token': str(access_token),
                'refresh_token': str(refresh_token)
            }
            return tokens, user
        else:
            raise serializers.ValidationError(
                dict(
                    email=['Invalid Crendentials or something went wrong.']
                ))

