# Generated by Django 4.0.3 on 2022-05-06 19:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('group', '0003_group_group_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='group',
            name='group_id',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]
