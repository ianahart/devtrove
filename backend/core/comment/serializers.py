from rest_framework import serializers

from account.serializers import UserSerializer, UserCommentSerializer

from .models import Comment




class CommentSerializer(serializers.ModelSerializer):
    user = UserCommentSerializer()
    readable_date = serializers.SerializerMethodField()
    class Meta:
        model = Comment
        fields = ('id',
                  'user',
                  'language',
                  'code_snippet',
                  'post_id',
                  'readable_date',
                  'created_at',
                  'text', )


    def get_readable_date(self, obj):
        return obj.get_readable_date()



class CommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('user',  'post','language','code_snippet','text', )

    def validate(self, data):
        exclude = ['user', 'post', 'language']
        counter = 0
        for key, value in data.items():
            if key not in exclude and len(value) == 0:
                counter = counter + 1
            else:
                if key not in exclude:
                    data[key] = value.strip()
        if counter == len(data) / 2:
            raise serializers.ValidationError(
                dict(field=['You need to write something to add a comment.']))
        return data


    def create(self, **validated_data):
        Comment.objects.create_comment(**validated_data['validated_data'])
        return validated_data
