from django.core.exceptions import ObjectDoesNotExist
from django.db import models
from django.core.paginator import Paginator
from django.db.utils import DatabaseError
from django.utils import timezone
import logging
import uuid
from account.models import CustomUser
logger = logging.getLogger('django')
import random

class GroupMananger(models.Manager):



    def delete(self, user_id: int, group_id: str):
        try:
            group = Group.objects.all().filter(
                group_user=user_id
            ).filter(
                group_id=group_id
            ).first()

            if group is not None:
               group.delete()
            else:
                raise DatabaseError

        except DatabaseError:
            logger.error('Unable to leave group for specified user.')



    def users(self, group_id: int, user_id: int):
        try:
            group = Group.objects.order_by(
                '-id'
            ).select_related(
            'group_user'
            ).all().filter(
                group_id=group_id
            )
            if group.count() == 0:
                raise ObjectDoesNotExist('No users were found for this group.')

            group_slice = group[0:4]
            count = len(group) - len(group_slice)
            count_text = f'{count} more...' if count > 0 else ''


            for user in group_slice:
                user.avatar_url = user.group_user.avatar_url
            post ={
            'title': group[0].post.title,
            'cover_image': group[0].post.cover_image,
            'post_id': group[0].post.id,
            'host': group[0].host.id,
             'user_id': user_id,
             'slug': group[0].post.slug,
            'count': count_text,
            }
            return post, group_slice
        except (DatabaseError, ObjectDoesNotExist, ) as e:
            return {'error': str(e)}, {}
            logger.error('Unable to get group users for group view.')


    def add(self, data):
        try:
           group = Group.objects.all().filter(
                pk=data['group_id']
            ).first()


           new_group = self.model(
                group_user=data['user'],
                host=group.host,
                post_id=group.post_id,
                title=group.title,
                avatar=group.avatar,
                group_id=group.group_id
            )
           new_group.save()

        except DatabaseError as e:
            logger.error('Unable to add a user\'s new group that they joined.')

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
                group_id=uuid.uuid4()
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
    group_id = models.CharField(max_length=200, blank=True, null=True)
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



