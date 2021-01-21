# Generated by Django 3.1.2 on 2020-10-29 07:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0005_answer_slug'),
    ]

    operations = [
        migrations.AlterField(
            model_name='answer',
            name='image',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='candidate',
            name='profile_photo',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='post',
            name='image',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='logo',
            field=models.URLField(blank=True, null=True),
        ),
    ]
