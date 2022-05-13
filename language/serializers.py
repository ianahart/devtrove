from rest_framework import serializers
from .models import Language


class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ('snippet', 'id', 'name', 'user_id')
    def validate(self, data):
        if data is not None:
            return data

class LanguageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ('snippet', 'id', 'name', )


    def validate(self, data):
        if data is not None:
            return data

