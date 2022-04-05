from django.core.exceptions import ObjectDoesNotExist
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import BaseUserManager, AbstractUser, PermissionsMixin
from django.utils.translation import gettext_lazy as _

class CustomUserManager(BaseUserManager):

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
                raise TypeError
        except Exception as e:
            print('accountmodels.py update')

class CustomUser(AbstractUser, PermissionsMixin):
    username = None
    logged_in = models.BooleanField(default=False)
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










