from channels.generic.websocket import AsyncWebsocketConsumer, WebsocketConsumer
from channels.db import database_sync_to_async
from django.db.utils import DatabaseError
from rest_framework_simplejwt.exceptions import TokenBackendError
from rest_framework_simplejwt.backends import TokenBackend
from .models import Message
from account.models import CustomUser
from group.models import Group
import json

class Consumer(AsyncWebsocketConsumer):
    def save_message(self, data, group: Group, user: CustomUser):
        Message.objects.create(data, group, user)


    def get_group(self, group_id: str, user_id: int):
        try:
            return Group.objects.all().filter(
                group_id=group_id
            ).filter(
                group_user_id=user_id
            ).first()
        except DatabaseError:
            return None


    def user_online(self, user: CustomUser, online: bool):
        user.online = online
        user.save()

    def get_user(self, data: dict[str, str]):
            try:
                user = TokenBackend(
                    algorithm='HS256'
                    ).decode(data['token'], verify=False)
                return CustomUser.objects.get(pk=user['user_id'])
            except TokenBackendError:
                return None

    async def connect(self):
        await database_sync_to_async(self.user_online)(self.scope['user'], True)
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()



    async def disconnect(self, close_code):
        await database_sync_to_async(self.user_online)(self.scope['user'], False)
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )


    async def receive(self, text_data=None):
        user = None
        text_data_json = json.loads(text_data)
        user = await database_sync_to_async(self.get_user)(
            text_data_json
        )
        if user is None:
            await self.close()
            return
        group = await database_sync_to_async(self.get_group)(
            text_data_json['group_id'],
            text_data_json['user_id'])
        await database_sync_to_async(self.save_message)(
            text_data_json, group, user
        )
        message = text_data_json['message']
        await self.channel_layer.group_send(
            self.room_group_name, {
                'type': 'chat_message',
                'message': {
                    'message': message,
                    'readable_date': 'Just now',
                    'handle': user.handle,
                    'avatar_url': user.avatar_url,
                    'room': self.room_name,
                    'user': user.id
                }
            }
        )


    async def chat_message(self, event):
        message = event['message']

        await self.send(
            text_data=json.dumps({
                    'message': message
                })
        )
