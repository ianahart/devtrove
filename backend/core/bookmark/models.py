from django.db import models
from django.db.models.fields import DateTimeField
from django.db.utils import DatabaseError
from django.core.paginator import Paginator
from django.utils import timezone
import logging
logger = logging.getLogger('django')


class BookmarkManager(models.Manager):



    def get_bookmarks(self, user, params: dict):
        try:
            if 'page' not in params:
                cur_page = 1
            else:
                if int(params['page'])== 0:
                    cur_page = 0
                else:
                    cur_page = params['page']

            if 'dir' not in params:
                dir = 'next'
            else:
                dir = params['dir']


            bookmarks = user.user_bookmarks.all().order_by('id')
            paginator = Paginator(bookmarks, 3)

            if dir == 'next':
                cur_page = int(cur_page) + 1
            elif dir == 'previous':
                cur_page = int(cur_page) - 1

            if bookmarks is None or len(bookmarks) < 0:
                raise DatabaseError

            page = paginator.page(cur_page)

            bookmarks = page.object_list
            pagination = {
                'page': cur_page,
                'start': min(paginator.page_range),
                'end': max(paginator.page_range)
            }
            return bookmarks, pagination

        except DatabaseError:
            logger.error('Unable to retrieve user\'s bookmarked posts.')
            return []


    def create(self, **validated_data):
        try:
            post_id = validated_data['post'].id
            user_id = validated_data['user'].id

            exists = Bookmark.objects.all().filter(user=user_id) \
            .filter(post_id=post_id).first()
            if exists:
                return

            bookmark = self.model(post_id=post_id,user_id=user_id)
            bookmark.save()
        except DatabaseError:
            logger.error('Unable to bookmark post for user.')


class Bookmark(models.Model):


    objects:BookmarkManager = BookmarkManager()

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    marked_before = models.BooleanField(default=False, null=True, blank=True)
    post = models.ForeignKey(
        'post.Post', on_delete=models.CASCADE, related_name='bookmarks')

    user = models.ForeignKey(
        'account.CustomUser',
        on_delete=models.CASCADE,
        related_name='user_bookmarks'
    )
