from django.db import models, DatabaseError
from django.utils import timezone
from datetime import timedelta, datetime
import calendar
import logging
logger = logging.getLogger('django')

class PostManager(models.Manager):
    def create(self):
        pass

    def get_post(self, pk: int):
        try:
            post = self.model.objects.all().filter(pk=pk).first()
            if post is None:
                raise DatabaseError
            return post
        except DatabaseError:
            logger.error(msg="Unable to retrieve a single post for details page.")


    def get_posts(self):
        try:
            now = datetime.now(tz=timezone.utc)
            days = calendar.monthrange(now.year, now.month)[1]

            time_threshold = now - timedelta(days=days)
            posts = self.all().order_by('-created_at') \
            .filter(created_at__gte=time_threshold)[0:20]

            if posts:
                return posts

            raise DatabaseError
        except DatabaseError:
            logger.error(msg='Unable to retrieve scraped posts from the database.')

class Post(models.Model):

    objects: PostManager = PostManager()
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    title = models.CharField(max_length=250, blank=True, null=True)
    author = models.CharField(max_length=250, blank=True, null=True)
    upvotes = models.IntegerField(blank=True, null=True, default=0)
    logo = models.URLField(max_length=350, blank=True, null=True)
    cover_image = models.URLField(max_length=500, blank=True, null=True)
    snippet = models.TextField(max_length=600, blank=True, null=True)
    slug = models.TextField(max_length=300, blank=True, null=True)
    details_url = models.URLField(max_length=400, blank=True, null=True)
    author_pic = models.URLField(max_length=400, blank=True, null=True)
    tags = models.JSONField(blank=True, null=True)
    published_date = models.CharField(max_length=100, blank=True, null=True)
    min_to_read = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self) -> str:
        return self.title
