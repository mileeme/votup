# Generated by Django 3.1.2 on 2020-10-29 05:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0002_post_slug'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='organization',
            field=models.CharField(blank=True, default='', max_length=60, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='website',
            field=models.URLField(blank=True, default='', null=True),
        ),
    ]