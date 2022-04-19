from rest_framework import serializers
from .models import Bookmark
from post.serializers import PostBookmarkSerializer

class BookMarkSerializer(serializers.ModelSerializer):
    post = PostBookmarkSerializer()

    class Meta:
        model = Bookmark
        fields = ('post', 'post_id', 'user_id', 'id', )


class BookmarkCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookmark
        fields = ('post', 'user', )


    def validate(self, data):
        if not all(isinstance(data[item].id, int) for item in data):
            raise serializers.ValidationError(
                dict(field=['Parameters are invalid. they must be all numbers.'])
            )

        return data


    def create(self, validated_data):
        Bookmark.objects.create(**validated_data)

