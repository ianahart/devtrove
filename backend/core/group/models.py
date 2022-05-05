from django.db import models
from django.core.paginator import Paginator
from django.db.utils import DatabaseError
from django.utils import timezone
import logging

from account.models import CustomUser
logger = logging.getLogger('django')
import random

class GroupMananger(models.Manager):



    def __group_avatar(self):
        try:
            colors = ['#00CED1', '#00BFFF', '#FF8C00', '#FFD700', '#FF00FF', '#B22222', '#228B22', '#4B0082']
            rand_i = random.randint(0, len(colors) - 1)

            return colors[rand_i]
        except IndexError:
            logger.error('Unable to generate random color for group avatar')
            return '#F0E68C'

    def create(self, data: dict, user: CustomUser):
        try:
            new_group = self.model(
                group_user=user,
                host=user,
                post_id=int(data['post'].id),
                title=data['title'],
                avatar=self.__group_avatar(),
            )

            new_group.save()
            new_group.refresh_from_db()

            return new_group
        except DatabaseError:
            logger.error('Unable to create a reading group for user.')


    def groups(self, user_id: int, cur_page: int):
        try:
            objects = Group.objects.all().order_by(
                '-id'
            ).filter(
                group_user=user_id
            )

            paginator = Paginator(objects, 3)
            cur_page = cur_page + 1

            page = paginator.page(cur_page)
            groups = page.object_list

            pagination = {'has_next': page.has_next(), 'page': cur_page}
            return groups, pagination

        except DatabaseError as e:
            return [], []
            logger.error('Unable to retrieve user\'s reading group list.')

class Group(models.Model):
    objects: GroupMananger = GroupMananger()


    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    avatar = models.CharField(max_length=75, blank=True, null=True)
    title = models.CharField(max_length=200, blank=True, null=True)
    host = models.ForeignKey('account.CustomUser',
                             on_delete=models.CASCADE,
                             related_name='group_host',
                             blank=True,
                             null=True
                             )
    post = models.ForeignKey(
        'post.Post', on_delete=models.CASCADE, related_name='group_post')

    group_user = models.ForeignKey(
        'account.CustomUser',
        on_delete=models.CASCADE,
        related_name='group_users',
        blank=True,
        null=True,
    )


    def __str__(self):
        return str(self.created_at)



