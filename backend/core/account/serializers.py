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
    confirmpassword = serializers.CharField()
    class Meta:
        model = CustomUser
        fields = ('email', 'username','password', 'confirmpassword')
        extra_kwargs = {'password': {'write_only': True}}

    def validate_email(self, value):
        if CustomUser.objects.user_exists(email=value):
            raise serializers.ValidationError('A user with that email already exists.')
        else:
            return value

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

            raise serializers.ValidationError(msg)

    def validate(self, validated_data):
        compare_fields = ['password', 'confirmpassword']
        passwords = [value for field, value in validated_data.items() if field in compare_fields]
        if passwords[0] != passwords[1]:
            raise serializers.ValidationError(
                {
                    'password': ['Passwords do not match.']
                })
        elif len(passwords[0]) < 8:
            raise serializers.ValidationError(
                {
                    'password': ['Password must be at least 8 characters']
                })
        return validated_data

    def create(self):
        user = CustomUser.objects.create_user(
            email=self.data.get('email'),
            username=self.data.get('username'),
            password=self.data.get('password'),
        )
        return user
