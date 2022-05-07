from rest_framework import serializers
from .models import Group
from account.models import CustomUser




class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('group_id', 'avatar', 'title', 'host', 'post', 'group_user', 'id', )




class GroupUserSerializer(serializers.ModelSerializer):
    avatar_url = serializers.CharField()
    class Meta:
        model = Group
        fields = ('group_id',
                  'id',
                  'title',
                  'host',
                  'post',
                  'group_user',
                  'avatar_url', )



class GroupCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('post', 'title', )


    def validate(self, data):
        if len(data['title']) > 200:
            raise serializers.ValidationError('Character limit exceeded.')
        return data

    def create(self, validated_data, user: CustomUser):
        return Group.objects.create(validated_data, user)
