from rest_framework import serializers
from .models import Language

class LanguageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ('snippet', 'id', 'name', )


    def validate(self, data):
        print('LanguageCreateSerializer in languages dir validate: ', data)
        return data

