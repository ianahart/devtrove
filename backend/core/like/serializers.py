from rest_framework import serializers

from .models import Like

class LikeCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ('post', 'comment', 'user', )


    def validate(self, data):
        if not all(isinstance(data[item].id, int) for item in data):
            raise serializers.ValidationError(
                dict(field=['Paramters are invalid. they must be all numbers.'])
            )

        return data


    def create(self, creds, **validated_data):
        Like.objects.create(creds, **validated_data)
