from django.db import models
from django.utils import timezone


class Like(models.Model):
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey('account.CustomUser',
                             on_delete=models.CASCADE, related_name='liker')
    post = models.ForeignKey(
        'post.Post', on_delete=models.CASCADE, related_name='liked_post')
