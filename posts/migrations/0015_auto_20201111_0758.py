# Generated by Django 3.1.2 on 2020-11-11 07:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0014_auto_20201101_2306'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='category',
            options={'verbose_name_plural': 'categories'},
        ),
        migrations.AddField(
            model_name='post',
            name='main_question',
            field=models.TextField(blank=True, default='', null=True),
        ),
    ]