# Generated by Django 4.0.3 on 2022-03-19 15:01

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('url', models.URLField(blank=True, null=True)),
                ('title', models.CharField(blank=True, max_length=250, null=True)),
                ('author', models.CharField(blank=True, max_length=250, null=True)),
                ('cover_image', models.URLField(blank=True, null=True)),
                ('published_date', models.DateTimeField(default=django.utils.timezone.now)),
            ],
        ),
    ]
