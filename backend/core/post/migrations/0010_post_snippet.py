# Generated by Django 4.0.3 on 2022-04-11 11:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('post', '0009_post_slug'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='snippet',
            field=models.TextField(blank=True, max_length=600, null=True),
        ),
    ]
