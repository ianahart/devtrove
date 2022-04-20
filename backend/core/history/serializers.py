from rest_framework import serializers
from .models import History
from account.models import CustomUser
from post.models import Post
from post.serializers import PostHistorySerializer


class HistorySerializer(serializers.ModelSerializer):
    readable_date = serializers.CharField()
    post = PostHistorySerializer()
    class Meta:
        model = History
        fields = (
        'post',
        'user_id',
        'post_id',
        'id',
        'readable_date',
    )


class HistoryCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = History
        fields = ('user', 'post', 'tags', )

    def validate(self, data):
        for field in data.items():
            key, value = field
            if key == 'tags' and isinstance(value, list):
                if not all(isinstance(item, str) for item in value):
                    raise serializers.ValidationError(
                dict(field=['Hashtags must be of type string.']))
            else:
                message = f'{key} must be of type number.'
                if not isinstance(value, CustomUser) and key == 'user':
                    raise serializers.ValidationError(
                        dict(field=[message])
                    )
                if not isinstance(value, Post) and key == 'post':
                    raise serializers.ValidationError(
                        dict(field=[message])
                    )

        return data

    def create(self, user, validated_data):
        History.objects.add_to_history(user, validated_data)
