from datetime import timedelta, datetime
from django.db import models
from django.contrib.auth import hashers
from rest_framework.exceptions import PermissionDenied
from django.db.utils import DatabaseError
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from core import settings # type: ignore
import jwt
import logging

logger = logging.getLogger('django')


class PasswordResetManager(models.Manager):
    def create_password_reset(self,token: str, uid:int):
        try:
            password_reset = self.model(token=token, user_id=uid)
            password_reset.save()

        except DatabaseError as e:
            logger.error('Unable to create password reset  for user.')


    def update_reset_password(self, user_id: int,  validated_data):
        try:
            decoded_token = jwt.decode(
                validated_data['token'],
                options={"verify_signature": False}
            )
            if user_id != decoded_token['user_id']:
                raise PermissionDenied('User id number is incorrect.')

            password_reset = PasswordReset.objects.all() \
            .filter(user_id=user_id).first()

            if password_reset is None:
                raise PermissionDenied('Link has expired.')

            if password_reset.user is not None:
                  if hashers.check_password(
                               validated_data['password'],
                          password_reset.user.password):
                      raise PermissionDenied('Password cannot be the same as old password.')

                  password_reset.user.password = hashers.make_password(
                    validated_data['password'])

                  password_reset.user.save()
                  password_reset.delete()
            time_between = datetime.now(tz=timezone.utc) - password_reset.created_at
            if time_between.days > 1:
                try:
                    refreshed = RefreshToken(str(validated_data['token']))
                    refreshed.blacklist()
                    raise PermissionDenied('Link has expired. Please resubmit your email.')
                except TokenError:
                    logger.error('Token was invalid or expired during password reset')

            return {'type': 'ok', 'error': ''}
        except (DatabaseError, PermissionDenied, ) as e:
            if isinstance(e, PermissionDenied):
                return {'type': 'error', 'error': str(e)}
            logger.error('Unable to create a password reset.')

class PasswordReset(models.Model):



    objects: PasswordResetManager = PasswordResetManager()

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    token = models.TextField(max_length=400)
    user = models.ForeignKey('account.CustomUser',
                             on_delete=models.CASCADE, related_name='password_reset')

    def __str__(self):
        return self.token




