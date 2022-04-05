from django.db import models
from django.utils import timezone
from django.db import DataError
from account.models import CustomUser



class LanguageManager(models.Manager):

    def update_language(self, langs, pk: int, cur_langs):
        try:
            cur_lang_names = [lang.name for lang in cur_langs]
            lang_dicts = [lang_dict for lang_dict in langs]
            for lang_dict in lang_dicts:
                if lang_dict['name'] in cur_lang_names:
                    continue
                else:
                    instance = self.model(**lang_dict)
                    instance.save()
        except DataError:
            print('language/serializers.py')


    def delete_language(self, langs, pk: int, cur_langs):
        try:
            new_lang_names = [lang['name'] for lang in langs]
            cur_lang_names = [lang.name for lang in cur_langs]
            to_remove = []

            for cur_lang_name in cur_lang_names:
                if cur_lang_name not in new_lang_names:
                    to_remove.append(cur_lang_name)

            for cur_lang in cur_langs:
                if cur_lang.name in to_remove:
                    cur_lang.delete()
        except DataError:
            print('language/serializers.py')



class Language(models.Model):
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    name = models.CharField(max_length=150, null=True, blank=True)
    snippet = models.TextField(null=True, blank=True)
    user = models.ForeignKey(
        to=CustomUser,
        on_delete=models.CASCADE,
        related_name='languages'
    )

    objects:LanguageManager = LanguageManager()

    def __str__(self):
        return self.name
