from django.db import models
from django.core.paginator import Paginator
from django.db.utils import DatabaseError
from django.utils import timezone
from datetime import datetime, timedelta
import logging
logger = logging.getLogger('django')


class CommentManager(models.Manager):



    def get_comments(self, params):
        try:
            post_id = params['post']
            missing_params, has_next_page = False, False
            missing = ['offset', 'page']

            for key in missing:
                if key not in params.keys() and key != 'post':
                    missing_params = True

            queryset = Comment.objects.all() \
            .order_by('-id', '-created_at') \
            .filter(post_id=post_id)
            if missing_params:
                return {
                    'comments': queryset[0:3],
                    'page': 1,
                    'has_next_page':has_next_page
                }

            cur_page = params['page']
            offset = params['offset']


            p = Paginator(queryset, offset)

            cur_page = int(cur_page) + 1
            cur_page_p =  p.page(cur_page)
            print(cur_page_p.end_index())
            if p.page(cur_page):
                has_next_page = True if cur_page_p.has_next() else False

            return {
                'comments': cur_page_p.object_list,
                'page': cur_page,
                'has_next_page': has_next_page
            }

        except DatabaseError:
            logger.error('Unable to retrieve comments for a single post.')



    def create_comment(self, **kwargs):
        try:
            dict = {}
            for key, value in kwargs.items():
                    dict[key] = value

            new_comment = self.model(**dict)
            new_comment.save()
        except DatabaseError:
            logger.error('Unable to create comment for specified user.')


    def check_comment_limit(self, post_id: int=None, user_id: int=None):
        try:
            if not post_id or not user_id:
                raise ValueError

            comment_count = Comment.objects.all().filter(user_id=user_id) \
            .filter(post_id=post_id) \
            .filter(
                created_at__gte=datetime.now(
                        tz=timezone.utc) - timedelta(minutes=5)).count()

            if comment_count >= 5:
                return True
            return False
        except (DatabaseError, ValueError):
            return False
            logger.error('Unable to check if comment limit is exceeded')


    def get_comment_by_user(self, pk:int=None):
        try:
            if not pk:
                raise ValueError
            comment = Comment.objects \
            .filter(user_id=pk).order_by('-created_at').first()

            if not comment:
                raise ValueError
            return comment

        except (ValueError, DatabaseError):
            logger.error('Unable to find comment by the specified user.')

class Comment(models.Model):



    objects: CommentManager = CommentManager()
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    code_snippet = models.TextField(max_length=300, blank=True, null=True)
    language = models.CharField(max_length=100, blank=True, null=True)
    user = models.ForeignKey(
        'account.CustomUser', on_delete=models.CASCADE, related_name='user')
    post = models.ForeignKey(
        'post.Post', on_delete=models.CASCADE, related_name='post')
    edited = models.BooleanField(default=False, null=True, blank=True)
    text = models.CharField(max_length=150, null=True, blank=True)
    flagged = models.BooleanField(default=False, null=True, blank=True)




    def get_readable_date(self):
        return self.created_at.strftime('%b %d,%Y')


