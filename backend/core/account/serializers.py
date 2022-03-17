from .models import CustomUser
from rest_framework import serializers, validators
from rest_framework.validators import UniqueValidator


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('logged_in',
                  'last_login',
                  'username',
                  'first_name',
                  'last_name',
                  'avatar_file',
                  'avatar_url',
                  'created_at',
                  'updated_at',)

class CreateUserSerializer(serializers.ModelSerializer):

    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=CustomUser.objects.all())]
    )

    class Meta:
        model = CustomUser
        fields = ('email', 'username','password')
        extra_kwargs = {'password': {'write_only': True}}

    def validate_password(self, value):

        reqs = {
            'lower': False,
            'upper': False,
            'digit': False,
            'special': False
        }

        for ch in value:
            if not ch.isalnum():
                reqs['special'] = True
            elif ch.lower() == ch and not ch.isdigit():
                reqs['lower'] = True
            elif ch.upper() == ch and not ch.isdigit():
                reqs['upper'] = True
            elif ch.isdigit():
                reqs['digit'] = True
        if all(reqs.values()):
            return value
        else:
            msg = 'Please include '
            missing = [req for req, val in reqs.items() if not val]
            for index, req in enumerate(missing):
                if len(missing) == 1:
                    msg += f'1 {req} character.'
                    break
                msg += f'1 {req}, ' if index < len(missing) - 1 else f'and 1 {req} character.'
            raise serializers.ValidationError({'message': msg})

    def create(self):
        user = CustomUser.objects.create_user(
            email=self.data.get('email'),
            username=self.data.get('username'),
            password=self.data.get('password'),
        )
        return user
