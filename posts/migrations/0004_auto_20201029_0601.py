# Generated by Django 3.1.2 on 2020-10-29 06:01

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0003_auto_20201029_0530'),
    ]

    operations = [
        migrations.AlterField(
            model_name='candidate',
            name='birthday',
            field=models.DateField(blank=True, default=datetime.date.today, null=True),
        ),
    ]
