# Generated by Django 3.1.3 on 2020-11-21 21:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0029_auto_20201119_2102'),
    ]

    operations = [
        migrations.CreateModel(
            name='featuredMessage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.CharField(blank=True, max_length=250, null=True)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('feature', models.BooleanField(default=False)),
            ],
        ),
    ]