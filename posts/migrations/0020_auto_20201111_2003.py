# Generated by Django 3.1.2 on 2020-11-11 20:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0019_auto_20201111_2000'),
    ]

    operations = [
        migrations.AlterField(
            model_name='category',
            name='hero_img',
            field=models.FileField(blank=True, null=True, upload_to='posts/media/posts'),
        ),
    ]
