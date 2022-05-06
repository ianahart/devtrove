from rest_framework import serializers
from .models import Invitation

class InvitationCreateSerializer(serializers.ModelSerializer):
    handle = serializers.CharField(max_length=100)

    class Meta:
        model = Invitation
        fields = ('group', 'host', 'handle', )


    def validate_handle(self, value):
        if len(value.strip()) > 100 or len(value.strip()) == 0:
            serializers.ValidationError('Handle must be between 1 and 100 characters.');
        return value

    def create(self, validated_data):
        return Invitation.objects.create(validated_data)



class InvitationUpdateSerializer(serializers.ModelSerializer):
    accepted = serializers.BooleanField()
    group_id = serializers.IntegerField()
    class Meta:
        model = Invitation
        fields = ('group_id', 'user', 'accepted', )



    def update(self, validated_data, id):
        return Invitation.objects.update(data=validated_data, id=int(id))


class InvitationAllSerializer(serializers.ModelSerializer):
    avatar_url = serializers.URLField()
    handle = serializers.CharField()
    title = serializers.CharField()
    class Meta:
        model =  Invitation
        fields = ('pk',
                  'group',
                  'title',
                  'host',
                  'user',
                  'accepted',
                  'avatar_url',
                  'handle', )
