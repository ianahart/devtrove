from django.db import models
from django.db.utils import DatabaseError
from django.utils import timezone
import logging
logger = logging.getLogger('django')


class LikeManager(models.Manager):
    def create(self, creds,  **validated_data):
        try:
            already_liked = Like.objects.all() \
            .filter(user_id=creds['user_id']) \
            .filter(post_id=creds['post_id']) \
            .filter(comment_id=creds['comment_id']).first()

            if already_liked is not None:
                return

            dict = {}
            for field, value in validated_data['validated_data'].items():
                dict[field] = value

            like = self.model(**dict)

            like.save()
        except DatabaseError:
            logger.error('Unable to create a like for a comment.')
class Like(models.Model):



    objects: LikeManager = LikeManager()

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey('account.CustomUser',
                             on_delete=models.CASCADE, related_name='user_like')
    post = models.ForeignKey(
        'post.Post', on_delete=models.CASCADE, related_name='post_like')
    comment = models.ForeignKey(
        'comment.Comment', on_delete=models.CASCADE,
        related_name='likes', default=None)





