from django.db import models
from django.db.utils import DatabaseError
from django.utils import timezone
import logging
logger = logging.getLogger('django')


class UpvoteManager(models.Manager):
    def create_upvote(self, **validated_data):
        try:

            already_voted = Upvote.objects \
            .filter(user_id=validated_data['user'])\
            .filter(post_id=validated_data['post']).first()

            if already_voted is not None:
                return
            upvote = self.model(
                user=validated_data['user'],
                post=validated_data['post'],
                type=validated_data['type']
            )
            upvote.save()
        except DatabaseError as e:
            logger.error('Unable to create an upvote on post.')

class Upvote(models.Model):

    objects:UpvoteManager = UpvoteManager()
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    type = models.CharField(max_length=100, null=True, blank=True)
    user = models.ForeignKey(
        'account.CustomUser',
        on_delete=models.CASCADE,
        related_name='upvotes'
    )
    post = models.ForeignKey(
        'post.Post',
        on_delete=models.CASCADE,
        related_name='post_upvotes')


    def __str__(self) -> str:
        return f'Upvote of {self.post}'
