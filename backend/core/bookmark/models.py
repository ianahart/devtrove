from django.db import models
from django.db.models.fields import DateTimeField
from django.db.utils import DatabaseError
from django.utils import timezone
import logging
logger = logging.getLogger('django')




class BookmarkManager(models.Manager):
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
