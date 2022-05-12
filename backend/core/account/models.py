from django.core.exceptions import ObjectDoesNotExist
from typing import Optional
from django.contrib.auth.hashers import check_password, make_password
from django.db import models, DataError, DatabaseError
from django.contrib.auth.models import BaseUserManager, AbstractUser, PermissionsMixin
from django.utils.translation import gettext_lazy as _
from django.core.mail import EmailMessage, EmailMultiAlternatives
from django.template import Context
from rest_framework_simplejwt.tokens import RefreshToken
from django.template.loader import get_template, render_to_string
from core import settings # type: ignore
import logging
import json
import os
from django.utils import timezone
from datetime import datetime, timedelta, date
logger = logging.getLogger('django')

class CustomUserManager(BaseUserManager):

    def send_user_email(self, email:str):
        try:
            user = CustomUser.objects.all().filter(email=email).first()

            if user is None:
                raise ObjectDoesNotExist('That email address does not exist.')

            refresh = RefreshToken.for_user(user)
            refresh = str(refresh)

            context = {'user': user.handle, 'uid': user.id, 'token': refresh}
            message = render_to_string('forgot-password.html', context)

            mail = EmailMessage(
                subject="Password reset",
                body=message,
                from_email=settings.EMAIL_SENDER,
                to=[email]
            )
            mail.content_subtype = 'html'
            mail.send()

            return {'type': 'ok', 'data': {'uid': user.id, 'token': refresh}}
        except(DatabaseError, ObjectDoesNotExist, Exception, ) as e:
            logger.error('Unable to send forgot password email to user')
            if isinstance(e, ObjectDoesNotExist):
                return {'type': 'error', 'data': str(e)}


    def change_password(self,user_id:int=None, **validated_data) ->dict[str, str]:
        try:
            user = CustomUser.objects.get(pk=user_id)
            if not check_password(validated_data['oldpassword'], user.password):
                raise ValueError('Old password is incorrect.')
            are_same = check_password(validated_data['password'], user.password)
            if are_same:
                raise ValueError('Password cannot be the same as old password.')

            hashed_password = make_password(validated_data['password'])

            user.password = hashed_password
            user.save()

            return {'type': 'ok','message': 'Password has been changed.'}
        except (DatabaseError, ValueError, ) as e:
            logger.error('Unable to change the user\'s password in settings.')
            if isinstance(e, ValueError):
                return {'type': 'error', 'message': str(e)}
            else:
                return {'type': 'error', 'message': 'Something went wrong.'}


    def __add_calendar(self, histories: dict) -> list[dict[str, int | str]]:
        c_dates, data, blueprint = [], [], {}

        for key, history in enumerate(histories):
            if isinstance(history['created_at'], datetime):
                ft_date = history['created_at'].strftime('%Y-%m-%d')
                c_dates.append(ft_date)

        for c_date in c_dates:
            if c_date not in blueprint:
                blueprint[c_date] = {'value': 1, 'day': c_date}
            else:
                blueprint[c_date]['value'] += 1

        data = [value for _, value in blueprint.items()]

        return data



    def __calendar_dates(self):
        today = datetime.today().strftime('%Y-%m-%d')

        start = datetime(int(today.split('-')[0]), 1, 2, 1, 00)
        end = start + timedelta(days=364)

        start = str(start).split(' ')[0]
        end = str(end).split(' ')[0]

        return {'start': start, 'end': end}



    def __sort_tags(self, count_tags):
        if len(count_tags) < 2:
            return count_tags
        else:
            tags = list(count_tags.items()) \
            if isinstance(count_tags, dict) else count_tags

            pivot = tags[0]
            smallest = [tag for tag in tags[1:] if pivot[1] <= tag[1]]
            greatest = [tag for tag in tags[1:] if pivot[1] > tag[1]]

            return self.__sort_tags(smallest) + [pivot] + self.__sort_tags(greatest)


    def get_profile(self, handle: str) -> Optional['CustomUser'] | list:
        try:
            cur_user = CustomUser.objects.all().filter(handle=handle).first()
            if not cur_user:
                raise ObjectDoesNotExist('User does not exist')
            histories = cur_user.user_history.all() \
            .order_by('-id').values('tags', 'created_at') \
            .filter(
                created_at__gte=datetime.now(
                        tz=timezone.utc) - timedelta(days=365))

            articles_read = histories.count()
            tags = []
            for history in histories:
                for tag in json.loads(history['tags']):
                    tags.append(tag)

            count_tags = {tag: round(tags.count(tag) / len(tags) * 100) \
                for index, tag in enumerate(tags)}

            sorted_count_tags = {s[0]: s[1] for i, s in \
                enumerate(self.__sort_tags(count_tags)) if i < 3}

            cur_user.count_tags = sorted_count_tags
            cur_user.articles_read = articles_read
            cur_user.joined = cur_user.created_at.strftime('%B %Y')
            cur_user.calendar = self.__add_calendar(histories)
            cur_user.dates = self.__calendar_dates()

            return cur_user
        except (DatabaseError, ObjectDoesNotExist, ) as e:
            logger.error('Unable to retrieve user\'s profile information.')
            return []


    def get_user(self, pk: int):
        try:
            if not isinstance(pk, int):
                raise TypeError

            user = self.all().filter(pk=pk).first()
            return user
        except TypeError:
            return None

    def user_exists(self, email: str) -> bool:
        users = self.all().filter(email=email)

        return True if users.count() else False

    def retrieve_user_by_email(self, email):
        try:
            users = self.all().filter(email__exact=email)
            found = None
            for user in users:
                if user:
                    found = user
            return found
        except ObjectDoesNotExist:
            return None

    def create_user(self, email, password, **extra_fields):
        """
        Create and save a User with the given email and password.
        """

        if not email:
            raise ValueError(_('The Email must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, password=password, **extra_fields)
        user.set_password(password)
        user.save()
        return user
    def create_superuser(self, email, password, **extra_fields):
        """
        Create and save a SuperUser with the given email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        return self.create_user(email, password, **extra_fields)


    def update_user(self, pk: int, avatar_url=None, avatar_fn=None, **kwargs):
        try:
            account = self.get_user(pk=pk)
            if avatar_url is not None and avatar_fn is not None:
                kwargs['validated_data']['avatar_url'] = avatar_url
                kwargs['validated_data']['avatar_file'] = avatar_fn

            email_changed = False
            for key, val in kwargs['validated_data'].items():
                if val is None:
                    val = None
                    setattr(account, key, val)
                elif len(val) > 0 or val != '':
                    if key == 'email' and account is not None:
                        if val != account.email:
                            email_changed = True
                    setattr(account, key, val)
            if account is not None:
                if email_changed:
                    account.logged_in = False
                account.save()
                account.refresh_from_db()
                return email_changed
            else:
                raise DataError
        except DataError as e:
            logger.error(msg='Failed updating the user')

class CustomUser(AbstractUser, PermissionsMixin):
    username = None
    logged_in = models.BooleanField(default=False)
    online = models.BooleanField(default=False)
    avatar_file = models.TextField(max_length=500, blank=True, null=True)
    avatar_url = models.URLField(max_length=500, blank=True, null=True)
    bio = models.TextField(max_length=160, blank=True, null=True)
    company = models.TextField(max_length=75, blank=True, null=True)
    job_title = models.TextField(max_length=75, blank=True, null=True)
    website = models.URLField(max_length=200, blank=True, null=True)
    twitter = models.CharField(max_length=100, blank=True, null=True)
    github = models.URLField(max_length=200, blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    first_name = models.CharField(max_length=200, blank=True, null=True)
    last_name = models.CharField(max_length=200, blank=True, null=True)
    slug = models.CharField(max_length=200, blank=True, null=True)
    handle = models.CharField(
                            max_length=100,
                            unique=True, blank=True,
                            null=True,
                           error_messages={'unique':
                                            'A user with this handle already exists.'
                                              }
)
    email = models.EmailField(_(
                            'email address'),
                              unique=True,
                              blank=True,
                              null=True,
                              error_messages={'unique':
                                  'A user with this email already exists.'
                              }
                              )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects: CustomUserManager = CustomUserManager()

    def __str__(self):
        return f"{self.email}"

    def set_logged_in(self, logged_in: bool) -> None:
        if isinstance(logged_in, bool):

            self.logged_in = logged_in
            self.save()


