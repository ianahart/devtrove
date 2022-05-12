from django.core.paginator import Paginator, EmptyPage
from django.db import models, DatabaseError
import logging
from django.db.models.query import QuerySet
from django.utils import timezone
from datetime import timedelta, datetime
import json
logger = logging.getLogger('django')

class HistoryManager(models.Manager):


    def __disect_history_posts(self, queryset):
        history_posts = [[], []]
        for post in queryset:
            if 'ago' in post.readable_date or 'now' in post.readable_date:
                history_posts[0].append(post)
            else:
                history_posts[1].append(post)
        return history_posts

    def __craft_readable_date(self, created_at) -> str:
        now, readable_date = datetime.now(tz=timezone.utc), None
        clock = now - created_at

        if 'day' in str(clock):
            readable_date = created_at.strftime('%b,%d')
        else:
            hrs = str(clock).split(':')[0]
            readable_date =  f'{hrs}hrs ago.' if int(hrs) >0 else 'Just now.'
        return readable_date



    def __daily_read_count(self, user_id: int):
        try:
            read_count = History.objects.all() \
            .filter(user_id=user_id) \
            .filter(
                created_at__gte=datetime.now(
                        tz=timezone.utc) - timedelta(days=1)).count()
            return read_count
        except DatabaseError:
            return 0
            logger.error('Unable to get the daily read count')


    def get_history(self, user_id: int, cur_page: int):
        try:
            queryset = History.objects.all().order_by('-id', '-created_at')\
            .filter(user_id=user_id) \


            read_count = History.objects.all() \
            .filter(user_id=user_id) \
            .filter(
                created_at__gte=datetime.now(tz=timezone.utc) - timedelta(days=1)).count()

            for post in queryset:
                post.readable_date = self.__craft_readable_date(post.created_at)

            paginator = Paginator(queryset, 3)
            if cur_page is None or cur_page == 0:
                cur_page = 1
            else:
                cur_page = cur_page + 1

            try:
                page = paginator.page(cur_page)
                history = self.__disect_history_posts(page.object_list)
                read_count = self.__daily_read_count(user_id)
                pagination = {'read_count': int(read_count),
                    'page': cur_page, 'has_next_page': page.has_next()}
            except EmptyPage:
                return [[], []], {}

            return history, pagination
        except DatabaseError:
            logger.error('Unable to retrieve a user\'s reading history.')




    def add_to_history(self, user: int, validated_data: dict):
        try:

            if user != validated_data['user']:
                return

            max_limit = History.objects.all().order_by('created_at') \
            .filter(user_id=validated_data['user']) \
            .filter(
                created_at__gte=datetime.now(
                        tz=timezone.utc) - timedelta(days=1)).count() \


            if max_limit >= 3:
                return

            already_read_post = History.objects.all() \
            .order_by('id') \
            .filter(post_id=validated_data['post']) \
            .filter(user_id=validated_data['user']).count()

            if already_read_post > 0:
                return

            history = self.model(
                user_id=validated_data['user'],
                post_id=validated_data['post'],
                tags=json.dumps(validated_data['tags'])
            )
            history.save()
        except DatabaseError:
            logger.error('Unable to add post to user\'s reading history.')



class History(models.Model):

    objects: HistoryManager = HistoryManager()

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey('account.CustomUser',
                             on_delete=models.CASCADE,
                             related_name='user_history'
                             )
    post = models.ForeignKey('post.Post',
                            on_delete=models.CASCADE,
                             related_name='history_post'
                             )
    tags = models.JSONField()

