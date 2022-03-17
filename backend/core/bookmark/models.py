from django.db import models
from django.db.models.fields import DateTimeField
from django.utils import timezone


class Bookmark(models.Model):
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    marked_before = models.BooleanField(default=False, null=True, blank=True)
    user = models.OneToOneField(
        'account.CustomUser',
        on_delete=models.CASCADE,
        related_name='bookmarker'
    )
