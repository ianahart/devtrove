from django.db import models
from django.db.models.fields import DateTimeField
from django.utils import timezone


class Language(models.Model):
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    language = models.CharField(max_length=150, null=True, blank=True)
    icon = models.TextField(null=True, blank=True)
    user = models.ForeignKey(
        'account.CustomUser',
        on_delete=models.CASCADE,
        related_name='owner'
    )



    def __str__(self):
        return self.language
