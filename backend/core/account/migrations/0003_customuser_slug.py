# Generated by Django 4.0.3 on 2022-03-16 19:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0002_alter_customuser_managers'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='slug',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]
