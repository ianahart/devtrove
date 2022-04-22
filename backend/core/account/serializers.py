from typing import OrderedDict
from rest_framework import serializers, status
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
import re
import json

from language.serializers import LanguageSerializer
from .models import CustomUser
from language.models import Language
from .services.file_upload import FileUpload
from .validators import CustomValidator, CustomAccountValidator



class UserCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'handle', 'avatar_url', )

class UserSerializer(serializers.ModelSerializer):
    languages = LanguageSerializer(many=True)

    class Meta:
        model = CustomUser
        fields = ('logged_in',
                  'first_name',
                  'id',
                  'last_name',
                  'github',
                  'languages',
                  'avatar_file',
                  'avatar_url',
                  'website',
                  'twitter',
                  'job_title',
                  'company',
                  'bio',
                  'email',
                  'handle'
                  )



class UserProfileSerializer(serializers.ModelSerializer): 
    languages = LanguageSerializer(many=True)
    count_tags = serializers.JSONField()
    articles_read = serializers.IntegerField()
    joined = serializers.CharField(max_length=70)

    class Meta:
        model = CustomUser
        fields = (
              'first_name',
              'id',
              'last_name',
              'joined',
              'count_tags',
              'articles_read',
              'github',
              'languages',
              'avatar_url',
              'website',
              'twitter',
              'job_title',
              'company',
              'bio',
              'handle'
        )

class CreateUserSerializer(serializers.ModelSerializer):
    confirmpassword = serializers.CharField()

    class Meta:
        model = CustomUser
        fields = ('email', 'password',  'handle', 'confirmpassword')
        extra_kwargs = {'password': {'write_only': True}}

    def validate_email(self, value):
        if CustomUser.objects.user_exists(email=value):
            raise serializers.ValidationError(
                'A user with that email already exists.')
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
                msg += f'1 {req}, ' if index < len(missing) - \
                    1 else f'and 1 {req} character.'

            raise serializers.ValidationError(msg)

    def validate(self, data):
        cleaned_data = {}

        for field, value in data.items():
            cleaned_data[field] = value.replace(' ', '').strip()

        compare_fields = ['password', 'confirmpassword']
        passwords = [value for field,
                     value in data.items() if field in compare_fields]
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
        return cleaned_data

    def create(self, validated_data):

        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['confirmpassword'],
            handle=validated_data['handle'],
        )
        return user


class UserPhotoSerializer(serializers.Serializer):
    avatar = serializers.ImageField(required=False)

    class Meta:
        model = CustomUser
        fields = ('avatar', )

    def validate(self, data):
        if 'avatar' in data:
            if data['avatar'].size > 1500000:
                raise serializers.ValidationError(
                    'Your avatar must be under 1.5MB.')

        return data


class UserUpdateFormSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=False, allow_blank=True)
    handle = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = CustomUser
        fields = ('email',
                  'handle',
                  'last_name',
                  'first_name',
                  'job_title',
                  'company',
                  'bio',
                  'website',
                  'github',
                  'twitter',
                  )

    def validate_handle(self, value):
        user = self.context['request'].user
        validator = CustomAccountValidator()
        return validator.validate(user, value, 'handle')

    def validate_email(self, value):
        user = self.context['request'].user
        validator = CustomAccountValidator()
        return validator.validate(user, value, 'email',)

    def validate_first_name(self, value):
        return value.title()

    def validate_last_name(self, value):
        return value.title()

    def validate_company(self, value):
        return value.title()

    def validate_job_title(self, value):
        return value.title()

    def validate(self, data):
        to_validate = ['handle', 'last_name',
                       'first_name', 'bio', 'job_title', 'company']
        format_exclude = ['bio', 'job_title', 'company']
        for key, value in data.items():
            if key in to_validate and value is not None:
                pattern = re.compile(r"^[a-zA-Z0-9,\s+.]*$")
                matched = re.fullmatch(pattern, value)
                if not matched:
                    raise CustomValidator(
                        'cannot contain special characters',
                        key,
                        status_code=status.HTTP_400_BAD_REQUEST
                    )
        fields = dict()
        for key, value in data.items():
            if key not in format_exclude:
                fields[key] = value.strip().replace(' ', '')
            else:
                fields[key] = value
        return OrderedDict(fields.items())

    def update(self, pk: int, file, refresh_token, languages,  **validated_data):

        user = CustomUser.objects.get_user(pk=pk)   

        file_upload = FileUpload(file, 'avatars')
        languages = json.loads(json.dumps(languages.copy()))
        for lang in languages:
            lang['user_id'] = pk

        if user:
            Language.objects \
                .delete_language(langs=languages, pk=pk, cur_langs=user.languages.all())

            Language.objects \
                .update_language(langs=languages, pk=pk, cur_langs=user.languages.all())

        result = file_upload.put_object(user)
        if result is None:
            result = {'avatar_fn': None, 'avatar_url': None}
        email_changed = CustomUser.objects.update_user(pk=pk,
                                                       avatar_fn=result['avatar_fn'],
                                                       avatar_url=result['avatar_url'],
                                                       **validated_data
                                                       )
        try:
            if user and email_changed:
                token = RefreshToken(refresh_token)
                token.blacklist()
                return True
            else:
                return False
        except TokenError as e:
            return True
