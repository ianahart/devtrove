from rest_framework import serializers
from upvote.models import Upvote


class UpvoteCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Upvote
        fields = ('post', 'user', 'type', )

    def validate(self, data):
        if data['type'] != 'post' and data['type'] != 'comment':
            raise serializers \
            .ValidationError('<Type> must be either "post" or "comment".')
        return data

    def create(self,**validated_data):

        Upvote.objects.create_upvote(**validated_data['validated_data'])

