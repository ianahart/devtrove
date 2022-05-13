from django.db import models
from django.db import models, DataError, DatabaseError
from django.utils import timezone
import logging
logger = logging.getLogger('django')


class SettingMananger(models.Manager):
    def update_preferred_language(self, settings: bool, pk: int):
        try:
            setting = Setting.objects.get(pk=pk)
            setting.preferred_language = settings

            setting.save()
        except DatabaseError:
            logger.error('Unable to update a user\'s preferred language.')
    def update_theme(self, data, pk=None):
        try:
            if pk is not None:
                values = data['data']
                setting = Setting.objects.get(pk=pk)

                setting.theme = values['theme']
                setting.save()

                setting.refresh_from_db()

                return setting

            raise DatabaseError
        except DatabaseError:
            logger.error('Unable to update a user\'s theme.')

    def create(self, user_id: int):
        try:
            setting = self.model(user_id=user_id)
            setting.save()
        except DatabaseError:
            logger.error('Unable to create settings after creating user.')


class Setting(models.Model):

    objects: SettingMananger = SettingMananger()
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    theme = models.CharField(max_length=10, default="dark")
    preferred_language = models.BooleanField(default=False, null=True, blank=True)
    user = models.OneToOneField('account.CustomUser', 
                             on_delete=models.CASCADE,
                             related_name='user_settings')
