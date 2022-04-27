from rest_framework import serializers
import re 

from .models import PasswordReset


class PasswordResetSerializer(serializers.ModelSerializer):
    token = serializers.CharField(max_length=400)
    password = serializers.CharField()
    confirmpassword = serializers.CharField()

    class Meta:
        model = PasswordReset
        fields = ('token', 'password', 'confirmpassword', )
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



    def create(self, pk:int, validated_data):
        return PasswordReset.objects.update_reset_password(user_id=pk, validated_data=validated_data)
    






