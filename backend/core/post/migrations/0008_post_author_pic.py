# Generated by Django 4.0.3 on 2022-04-10 18:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('post', '0007_remove_post_url'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='author_pic',
            field=models.URLField(blank=True, max_length=400, null=True),
        ),
    ]
