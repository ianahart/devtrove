from django.db import models
from django.db.utils import DatabaseError
from django.utils import timezone
from datetime import datetime, timedelta
import logging
logger = logging.getLogger('django')


class TagManager(models.Manager):
    def create_tag(self):
        pass


class Tag(models.Model):



    objects: TagManager = TagManager()
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    text = models.CharField(max_length=75)
    post = models.ForeignKey(
        'post.Post', on_delete=models.CASCADE, related_name='post_tags')



    def __str__(self) -> str:
        return self.text



