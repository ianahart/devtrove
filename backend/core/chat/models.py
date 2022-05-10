from time import strftime
from typing import Optional
from django.core.paginator import Paginator
from django.db import models
from django.db.utils import DatabaseError
from django.utils import timezone
from account.models import CustomUser
from group.models import Group
import logging
import json
logger = logging.getLogger('django')

class MessageManager(models.Manager):


    def messages(self, group: Group, page: int):
        try:
           objects = Message.objects.all().order_by(
                '-id', '-created_at'
            ).filter(room=group.group_id)


           for object in objects:
                object.avatar_url = object.user.avatar_url
                object.handle = object.user.handle
                object.readable_date = object.created_at.strftime('%m/%d/%y')

           p = Paginator(objects, 2)
           cur_page = page + 1
           p = p.get_page(cur_page)

           group_messages = p.object_list
           data = {'has_next': p.has_next(), 'page': cur_page}
           return group_messages, data
        except DatabaseError:
            return [], []
            logger.error('Unable to fetch messages for a specific group.')



    def create(self, data, group, user):
        try:
            message = self.model(
                room=data['group_id'],
                message=data['message'],
                user=user,
                group=group
            )
            message.save()
        except DatabaseError:
            logger.error('Unable to create a a message for a group')



class OnlineUserManager(models.Manager):


    def retrieve(self, room: str):
        try:
            online_users = OnlineUser.objects.all().filter(room=room)
            return [online_user.user.handle for online_user in online_users]

        except DatabaseError:
            logger.error('Unable to retrieve online user list for a room.')

    def delete(self, user: CustomUser, room: str):
        try:
            online_user = OnlineUser.objects.all().filter(
                user=user
            ).filter(
                room=room
            )
            online_user.delete()
        except DatabaseError:
            logger.error('Unable to remove an oneline user when they leave chat')


    def create(self, user: CustomUser, room: str):
        try:
            objects = OnlineUser.objects.all().filter(room=room)
            existing = [object for object in objects if object.user == user]

            if len(existing) == 0:
                online_user = self.model(user=user, room=room)
                online_user.save()
        except DatabaseError:
            logger.error('Unable to create an online user for chat messages.')


class OnlineUser(models.Model):

    objects: OnlineUserManager = OnlineUserManager()

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now) 
    room = models.CharField(max_length=200, blank=True, null=True)
    user = models.ForeignKey('account.CustomUser',
                             on_delete=models.CASCADE, related_name='user_online_users')

class Message(models.Model):



    objects: MessageManager = MessageManager()

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    room = models.CharField(max_length=200, blank=True, null=True)
    message = models.CharField(max_length=255)
    user = models.ForeignKey('account.CustomUser',
                             on_delete=models.CASCADE, related_name='user_messages')
    group = models.ForeignKey('group.Group',
                              on_delete=models.CASCADE, related_name='group_messages')


    def __str__(self):
        return self.message



