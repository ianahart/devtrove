# Generated by Django 4.0.3 on 2022-05-11 16:09

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('invitation', '0002_client'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='client',
            name='receiver',
        ),
        migrations.RemoveField(
            model_name='client',
            name='sender',
        ),
        migrations.AddField(
            model_name='client',
            name='user',
            field=models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, related_name='client_user', to=settings.AUTH_USER_MODEL),
        ),
    ]
