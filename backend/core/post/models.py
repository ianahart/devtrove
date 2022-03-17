from django.db import models
from django.utils import timezone

class Post(models.Model):
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    url= models.URLField(max_length=200, blank=True, null=True)
    title = models.CharField(max_length=250, blank=True, null=True)
    author = models.CharField(max_length=250, blank=True, null=True)
    cover_image = models.URLField(max_length=200, blank=True, null=True)
    published_date = models.DateTimeField(default=timezone.now)
