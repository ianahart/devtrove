from datetime import timedelta
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from account.models import CustomUser


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

