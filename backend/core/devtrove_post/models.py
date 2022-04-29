from django.core.exceptions import BadRequest
from django.db import models
from django.db import models, DataError, DatabaseError
from django.utils import timezone
from datetime import datetime, timedelta
import logging
import uuid

from account.services.file_upload import FileUpload

from .decoder import Decoder

logger = logging.getLogger('django')


class DevtrovePostMananger(models.Manager):


    def get_devtrove_post(self, pk: int):
        try:
            pass
        except DatabaseError:
            logger.error('Unable to retrieve a single devtrove post.')



    def __post_limit_exceeded(self, user_id: int):
        try:
            count = DevtrovePost.objects.all().filter(
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
            image = None
            decoder = Decoder()
            tree = data['post']['ops']
            if self.__post_limit_exceeded(user_id=data['user']):
                raise BadRequest(
                    'You have exceeded thee 10 maximum posts a day limit.'
                )

            for index, node in enumerate(tree):
                if 'attributes' not in node.keys() and 'insert' in node.keys():
                    if 'image' in node['insert']:
                        leaf = tree[index]['insert']['image']

                        file, filename, file_extension = decoder.decode_base64_file(
                            data=leaf
                        )
                        file_upload = FileUpload(file, filename)
                        image = file_upload.upload_post_image(
                                file, filename, file_extension
                        )
                        tree[index]['insert']['image'] = image['post_url'] #insert s3 link

            devtrove_post = self.model(
                user_id=data['user'],
                post=data['post'],
                post_filename=image['post_fn'],
                post_url=image['post_url']
            )
            devtrove_post.save()

        except (DatabaseError, Exception, ):
            logger.error('Unable to create the user\'s written post for devtrove.')


class DevtrovePost(models.Model):

    objects: DevtrovePostMananger = DevtrovePostMananger()
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    title = models.CharField(max_length=200, null=True, blank=True)
    cover_filename = models.CharField(max_length=200, null=True, blank=True)
    post_filename = models.CharField(max_length=200, null=True, blank=True)
    cover_url = models.CharField(max_length=200, null=True, blank=True)
    post_url = models.CharField(max_length=200, null=True, blank=True)
    post = models.JSONField()
    user = models.ForeignKey('account.CustomUser', 
                             on_delete=models.CASCADE,
                             related_name='user_devtrove_posts')

