# Generated by Django 4.0.3 on 2022-05-06 19:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('group', '0002_group_avatar'),
    ]

    operations = [
        migrations.AddField(
            model_name='group',
            name='group_id',
            field=models.BigIntegerField(blank=True, null=True),
        ),
    ]
