# Generated by Django 3.1.2 on 2020-10-29 20:58

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0008_post_bookmark'),
    ]

    operations = [
        migrations.RenameField(
            model_name='post',
            old_name='bookmark',
            new_name='bookmarks',
        ),
    ]