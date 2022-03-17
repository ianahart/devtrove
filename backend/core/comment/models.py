from django.db import models
from django.utils import timezone


class Comment(models.Model):
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey(
        'account.CustomUser', on_delete=models.CASCADE, related_name='commenter')
    post = models.ForeignKey(
        'post.Post', on_delete=models.CASCADE, related_name='post')
    edited = models.BooleanField(default=False, null=True, blank=True)
    text = models.CharField(max_length=150, null=True, blank=True)
    flagged = models.BooleanField(default=False, null=True, blank=True)
