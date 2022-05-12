from rest_framework import serializers

from .models import Message


class MessageSerializer(serializers.ModelSerializer):
    avatar_url = serializers.URLField()
    handle = serializers.CharField()
    readable_date = serializers.CharField()

    class Meta:
        model = Message
        fields = (
            'avatar_url',
            'handle',
            'readable_date',
            'room',
            'message',
            'user',
        )
