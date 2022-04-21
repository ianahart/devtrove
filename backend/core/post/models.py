from django.core.paginator import Paginator
from django.db import models, DatabaseError
from django.db.models.query import QuerySet
from django.utils import timezone
from datetime import timedelta, datetime
from typing import Any
import calendar
import logging
logger = logging.getLogger('django')
class PostManager(models.Manager):

    def search(self, **validated_data) ->  \
        tuple[QuerySet['Post'],dict[str, int | bool] ] | tuple[None, None]:
        try:
            search_term, page = validated_data['search_term'], validated_data['page']

            queryset = Post.objects.all() \
            .order_by('-id', '-created_at') \
            .filter(title__icontains=search_term.lower())
            if queryset.count() > 0:
                paginator = Paginator(queryset, 2)

                cur_page = paginator.page(page)
                queryset:QuerySet[Any] = cur_page.object_list

                has_next_page:bool = cur_page.has_next()
                pagination = {'page': int(page) + 1, 'has_next_page': has_next_page}
                return queryset, pagination

            return None, None
        except DatabaseError:
            logger.error('Unable to search for posts in the searchbar component')
            return None, None


    def create(self):
        pass

    def __get_total_counts(self, post, is_authenticated: bool, user=None):
        post.comments_count = post.comments.count()
        post.upvotes_count =  post.post_upvotes.count()
        post.cur_user_voted = False

        if is_authenticated:
            upvote = post.post_upvotes.filter(user_id=user.id).first()
            post.cur_user_voted = True if upvote is not None else False

        return post

    def get_post(self, pk: int, is_authenticated: bool, user=None):
        try:
            post = self.model.objects.all().filter(pk=pk).first()
            if post is None:
                raise DatabaseError
            post = self.__get_total_counts(post, is_authenticated, user)
            post.cur_user_bookmarked = self.__is_bookmarked(post, is_authenticated, user)
            return post
        except DatabaseError:
            logger.error(msg="Unable to retrieve a single post for details page.")


    def __is_bookmarked(self, post, is_authenticated, user):
        try:
            cur_user_bookmarked = None

            if user and is_authenticated:
                cur_user_bookmarked = post.bookmarks.all() \
                .filter(post_id=post.id, user_id=user.id).first()
            return True if cur_user_bookmarked is not None else False


        except DatabaseError:
            logger.error('Unable to determine if post is bookmarked by cur user.')
            return False



    def get_posts(self, is_authenticated: bool, user=None):
        try:
            now = datetime.now(tz=timezone.utc)
            days = calendar.monthrange(now.year, now.month)[1]

            time_threshold = now - timedelta(days=days)
            posts = self.all().order_by('-created_at') \
            .filter(created_at__gte=time_threshold)[0:20]
            for post in posts:
                post = self.__get_total_counts(post, is_authenticated, user)
                post.cur_user_bookmarked = self.__is_bookmarked(post, is_authenticated, user)
            if posts:
                return posts

            raise DatabaseError
        except DatabaseError as e:
            print(e)
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
