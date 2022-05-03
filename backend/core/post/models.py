from django.db.models import Count
from django.contrib.auth.models import AnonymousUser
from django.core.paginator import Paginator
from django.db import models, DatabaseError
from django.db.models.query import QuerySet
from django.core.exceptions import BadRequest
from django.utils import timezone
from slugify import slugify #type:ignore
from datetime import timedelta, datetime
from typing import Any
from account.services.file_upload import FileUpload
from tag.models import Tag
from account.models import CustomUser
from .decoder import Decoder
import calendar
import logging
logger = logging.getLogger('django')
class PostManager(models.Manager):

    def delete_devtrove_posts(self, post_ids: list[int]):
        try:
            for post_id in post_ids:
                post = Post.objects.get(pk=post_id)
                post.delete()
        except DatabaseError:
            logger.error('Unable to delete selected devtrove posts.')

    def get_devtrove_posts(self,
                           ownership: str,
                           user: CustomUser | AnonymousUser,
                           post_type: str,
                           cur_page: int):
        try:
            objects = None
            if isinstance(user, CustomUser) and ownership == 'private':
                objects = Post.objects.order_by('-id').filter(
                    user_id=user.pk
                ).filter(
                    type=post_type
                ).all()
            else:
                objects = Post.objects.order_by(
                    '-id'
                ).filter(
                    type=post_type
                ).all()

            for index, post in enumerate(objects):
                post = self.__get_total_counts(post, user.is_authenticated, user)
                setattr(post, 'is_checked', False)
                setattr(post, 'cur_user_bookmarked', 
                        self.__is_bookmarked(post, user.is_authenticated, user))


            paginator = Paginator(objects, 3)
            cur_page = 1 if cur_page == 0 else cur_page + 1
            page = paginator.page(cur_page)


            return {
                'has_next': page.has_next(),
                'cur_page': cur_page,
                'posts': page.object_list
            }
        except DatabaseError as e:
            logger.error(
                'Unable to retrieve public or private devtrove posts list view.'
            )
            return {'has_next': False, 'posts': [], 'cur_page': 0}



    def __devtrove_post_tags(self, tags: dict, post: int):
        for key, item in enumerate(tags):
            text = ''.join([ch for ch in item['tag'] if ch != ' '])
            tag = Tag(post_id=post, text=item['tag'])
            tag.save()

    def update_devtrove_post(self, data):
        try:
            post = Post.objects.get(pk=data['post'])
            self.__devtrove_post_tags(data['tags'], data['post'])

            slug = slugify(data['title'])

            file_upload = FileUpload(data['cover_image'], 'posts')
            object_url, filename = file_upload.upload_file()

            post.title = data['title']
            post.cover_image = object_url
            post.cover_image_fn = filename
            post.details_url = f'{data["post"]}/{slug}'
            post.author_pic = post.user.avatar_url
            post.tags =  [item['tag'] for item in data['tags']]
            post.slug = slug
            post.published_date = datetime.now().strftime('%b %-d')

            post.save()

        except (Exception, DatabaseError, ):
            logger.error('Unable to update a user\'s devtrove post ')




    def __post_limit_exceeded(self, user_id: int):
        try:
            count = Post.objects.all().filter(
                user_id=user_id
            ).filter(
                created_at__gte=datetime.now(
                        tz=timezone.utc) - timedelta(days=1)).count()
            return True if count >= 10 else False
        except DatabaseError:
            logger.error(
                'Unable to determine how many posts a user has posted in the last day.'
            )

    def create_devtrove_post(self, data):
        try:
            leaf = None
            post_fn, post_url = '', ''
            already_post_image = False
            decoder = Decoder()

            tree = data['post']['ops']
            if self.__post_limit_exceeded(user_id=data['user']):
                raise BadRequest(
                    'You have exceeded thee 10 maximum posts a day limit.'
                )
            for index, node in enumerate(tree):
                if 'attributes' not in node.keys() and 'insert' in node.keys():
                    if 'image' in node['insert']:
                        if already_post_image:
                            tree[index].clear()
                            continue
                        leaf = tree[index]['insert']['image']
                        file, filename, file_extension = decoder.decode_base64_file(data=leaf)
                        if all(v is None for v in [file, filename, file_extension]):
                            raise ValueError('Image sizes must be under 1.2MB(megabytes)')

                        file_upload = FileUpload(file, filename)
                        post_url, post_fn = file_upload.upload_post_image(
                                file, filename, file_extension
                        )
                        tree[index]['insert']['image'] = post_url
                        already_post_image = True

            filter_empty_out = [el for el in data['post']['ops'] if len(el) > 0]

            devtrove_post = self.model(
                user_id=data['user'],
                post=filter_empty_out,
                post_fn=post_fn,
                post_url=post_url,
                author=data['author'],
                type="devtrove_post",
                author_pic=data['author_pic']
            )
            devtrove_post.save()
            devtrove_post.refresh_from_db()
            return devtrove_post

        except (DatabaseError, Exception, ValueError,  ) as e:
            logger.error('Unable to create the user\'s written post for devtrove.')
            return {'error': str(e), 'ok': False}





    def upvoted_posts(self, is_authenticated:bool, user:dict):
        try:
            posts = Post.objects.all() \
            .annotate(num_post_upvotes=Count('post_upvotes__id', distinct=True)) \
            .order_by('-num_post_upvotes')[0:15]
            if posts.count() == 0:
                raise DatabaseError

            for post in posts:
                setattr(post, 'is_checked', False)
                post = self.__get_total_counts(post, is_authenticated, user)
                post.cur_user_bookmarked = self.__is_bookmarked(post, is_authenticated, user)

            return posts
        except DatabaseError:
            logger.error('Unable to retrieve most upvoted posts.')
            return []

    def most_discussed_posts(self, is_authenticated:bool, user:dict,
                             cur_page: int=None):
        try:
            if not cur_page:
                raise DatabaseError

            posts = Post.objects.all() \
            .annotate(num_comments=Count('comments__id', distinct=True)) \
            .annotate(num_post_upvotes=Count('post_upvotes__id', distinct=True)) \
            .order_by('-num_comments', '-num_post_upvotes')


            if posts.count() == 0:
                raise DatabaseError

            for post in posts:
                setattr(post, 'is_checked', False)
                post = self.__get_total_counts(post, is_authenticated, user)
                post.cur_user_bookmarked = self.__is_bookmarked(post, is_authenticated, user)

            paginator = Paginator(posts, 5)
            cur_page = int(cur_page) + 1

            page = paginator.page(cur_page)

            queryset = page.object_list
            pagination = {'page': cur_page, 'has_next': page.has_next()}

            return queryset, pagination
        except DatabaseError:
            logger.error('Unable to retrieve most discussed posts.')
            return [], []


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
            setattr(post, 'is_checked', False)
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



    def __get_newest(self, is_authenticated:bool, user):
        try:
            queryset = Post.objects.all().order_by('-id', '-created_at')[0:20]
            pagination = {'page': 1, 'has_next': False}
            for _, post in enumerate(queryset):
                setattr(post, 'is_checked', False)
                post = self.__get_total_counts(post, is_authenticated, user)
                setattr(post, 'cur_user_bookmarked', self.__is_bookmarked(post, is_authenticated, user))

            return queryset, pagination


        except DatabaseError:
            logger.error('Unable to get newest posts to display')

    def get_posts(self, is_authenticated: bool, page: int, user=None):
        try:
            if not page:
                return self.__get_newest(is_authenticated, user)

            if is_authenticated and user.user_settings.preferred_language:
                languages = user.languages.all()
                languages = [f'#{language.name.lower()}' for language in languages]

                objects = Post.objects.all().order_by(
                    '-id'
                ).filter(
                    post_tags__text__in=languages
                )
            else:
                objects = Post.objects.all().order_by('-id')
            paginator = Paginator(objects, 5)
            page = int(page) + 1

            cur_page = paginator.page(page)
            queryset = cur_page.object_list

            for post in queryset:
                post = self.__get_total_counts(post, is_authenticated, user)
                setattr(post, 'is_checked', False)
                setattr(post, 'cur_user_bookmarked', self.__is_bookmarked(post, is_authenticated, user))
            pagination = {'page': page, 'has_next': cur_page.has_next()}
            return queryset, pagination
        except DatabaseError as e:
            return [], []
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
    cover_image_fn = models.CharField(max_length=250, null=True, blank=True)
    snippet = models.TextField(max_length=600, blank=True, null=True)
    slug = models.TextField(max_length=300, blank=True, null=True)
    post = models.JSONField( blank=True, null=True)
    post_fn = models.CharField(max_length=200, blank=True, null=True)
    post_url = models.URLField(max_length=400, blank=True, null=True)
    details_url = models.URLField(max_length=400, blank=True, null=True)
    author_pic = models.URLField(max_length=400, blank=True, null=True)
    tags = models.JSONField(blank=True, null=True)
    published_date = models.CharField(max_length=100, blank=True, null=True)
    min_to_read = models.CharField(max_length=50, blank=True, null=True)
    type=models.CharField(max_length=50, blank=True, null=True)
    user = models.ForeignKey(
        'account.CustomUser',
        on_delete=models.CASCADE,
        related_name='post_user',
        blank=True,
        null=True,
    )



    def __str__(self) -> str:
        return self.title if isinstance(self.title, str) else ''

