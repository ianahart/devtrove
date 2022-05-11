import json
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from django.core.exceptions import ObjectDoesNotExist
from django.db import DatabaseError
from account.models import CustomUser
from invitation.models import Client, Invitation
from invitation.serializers import InvitationAllSerializer

class Consumer(AsyncWebsocketConsumer):



    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['user_id']
        await database_sync_to_async(self.remove_client)()
        self.room_group_name = 'invitation_%s' % self.room_name
        await database_sync_to_async(Client.objects.create)(channel_name=self.channel_name, user=self.scope['user'])

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )


        await self.accept()


    async def disconnect(self, close_code):
        await database_sync_to_async(self.remove_client)()


    def remove_client(self):
        Client.objects.all().filter(user_id=self.room_name).delete()


    def get_client(self, receiver):
        return Client.objects.filter(user_id=receiver.id).first()


    def get_receiver(self, handle: str):
        try:
            receiver = CustomUser.objects.filter(
                handle__iexact=handle).first()
            if receiver is None:
                raise ObjectDoesNotExist('User with that handle was not found.')
            return receiver
        except (DatabaseError, ObjectDoesNotExist,) as e:
            if isinstance(e, ObjectDoesNotExist):
                return {'error': str(e)}


    async def receive(self, text_data=None):
        text_data_json = json.loads(text_data)
        channel_layer = get_channel_layer()
        invitation = await database_sync_to_async(Invitation.objects.create)(text_data_json)

        if 'error' in invitation:
            message = {'error': invitation['error']}
        else:
            message = {'error': None}
        await channel_layer.send(
        self.channel_name,{
                    'type': 'invitation',
                    'message': message,
                })

        if message['error'] is not None:
            return

        serializer = InvitationAllSerializer(invitation['data'])
        receiver = await database_sync_to_async(self.get_receiver)(text_data_json['handle'])
        client = await database_sync_to_async(self.get_client)(receiver)

        await channel_layer.send(
            client.channel_name, {
                         'type': 'invitation',
                         'message': serializer.data,
                     })

    async def invitation(self, event):
        message = event['message']
        await self.send(
            text_data=json.dumps({
                    'message': message
                })
        )



