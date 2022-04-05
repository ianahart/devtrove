from core import settings
import boto3
from botocore.exceptions import ClientError
from datetime import datetime
from random import randint
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
        except ClientError:
            print('file_upload.py Failed uploading file to S3')

    def __decode_file(self):
        try:
            file = self.file.read()
            return file
        except OSError:
            print('file_upload.py: File could not be read.')


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

        except ClientError:
            print('file_upload.py delete s3')










