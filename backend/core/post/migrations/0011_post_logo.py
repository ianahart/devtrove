# Generated by Django 4.0.3 on 2022-04-14 11:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('post', '0010_post_snippet'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='logo',
            field=models.URLField(blank=True, max_length=350, null=True),
        ),
    ]