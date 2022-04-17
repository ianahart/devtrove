from rest_framework import serializers

from .models import Bookmark

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

