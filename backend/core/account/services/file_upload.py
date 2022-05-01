from io import BytesIO
from core import settings
import boto3
import uuid
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.db import DatabaseError
from datetime import datetime
from random import randint
import logging
logger = logging.getLogger('django')

# pyright: reportGeneralTypeIssues=false

class FileUpload():
    def __init__ (self, file, folder=None):
        self.file = file
        self.folder = folder
        self.bucket_name = settings.AWS_BUCKET
        self.region_name = settings.AWS_DEFAULT_REGION
        self.aws_access_key_id = settings.AWS_ACCESS_KEY_ID
        self.aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY

        session = boto3.Session(
            aws_access_key_id=self.aws_access_key_id,
            aws_secret_access_key=self.aws_secret_access_key,
            region_name = self.region_name
        )

        self.s3 = session.resource('s3')

    def put_object(self, user):
        try:
            if self.file is None:
                return
            bytes = self.__decode_file()
            path =  self.__make_path()

            if user.avatar_url or user.avatar_file:
                self.delete_object(user.avatar_file)

            obj = self.s3.Object(self.bucket_name, path)
            obj.put(
            Body=bytes,
            ACL='public-read',
            ContentType=self.file.content_type)

            avatar_url = f"https://{self.bucket_name}.s3.{self.region_name}.amazonaws.com/{path}"
            return {'avatar_url': avatar_url, 'avatar_fn': path}
        except OSError:
            logger.error(msg='Failed uploading avatar file to AWS S3')

    def __decode_file(self):
        try:
            file = self.file.read()
            return file
        except OSError:
            logger.error(msg='File could not be read')


    def __make_path(self):
        filename = f"{randint(1000, 10000)}-{datetime.utcnow().strftime('%Y%m%d%H%M%SZ')}"
        if self.folder is not None:
            path = f'{self.folder}/{filename}-{self.file.name}'
        else:
            path = f'{filename}-{self.file.name}'

        return path


    def delete_object(self, avatar_fn: str):
        try:
            self.s3.Object(self.bucket_name, avatar_fn).delete()

        except OSError:
            logger.error(msg='Failed deleting avatar file from AWS S3')


    def upload_post_image(self, file:BytesIO , filename: str, file_extension):
           try:
            obj = self.s3.Object(self.bucket_name, filename)
            obj.put(
               Body=file,
               ACL='public-read',
            ContentType=f'image/{file_extension}')

            post_url = f"https://{self.bucket_name}.s3.{self.region_name}.amazonaws.com/{filename}"
            if post_url is not None and filename is not None:
                return  post_url,  filename
            else:
                return None, None
           except DatabaseError as e:
                logger.error('Unable to upload post image to amazon s3.')
                return None, None


    def upload_file(self) -> tuple[str, str]:
        try:
             object_url, filename = '', ''
             if not isinstance(self.file, InMemoryUploadedFile):
                raise TypeError('Provided file is of wrong type.')

             decoded_file = self.__decode_file()
             file_exentsion = self.file.content_type.split('/')[1]

             filename = f'{self.folder}/{str(uuid.uuid4())[:12]}.{file_exentsion}'

             s3_instance = self.s3.Object(self.bucket_name, filename)
             s3_instance.put(
                Body=decoded_file,
                ACL='public-read',
                ContentType=self.file.content_type
             )
             object_url = f"https://{self.bucket_name}.s3.{self.region_name}.amazonaws.com/{filename}"
             return object_url, filename
        except OSError:
            logger.error('Unable to upload generic file to S3')

