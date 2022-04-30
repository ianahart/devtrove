from rest_framework import serializers
import re

from .models import DevtrovePost


class DevtrovePostMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = DevtrovePost
        fields = ('id', )

class DevtrovePostSerializer(serializers.ModelSerializer):
    class Meta:
        model= DevtrovePost
        fields = ('post', )

class DevtrovePostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DevtrovePost
        fields = ('user', 'post', )


    def validate(self, data):
        return data

    def create(self, validated_data):
        return DevtrovePost.objects.create_devtrove_post(validated_data)
