# Generated by Django 4.0.4 on 2022-05-04 07:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0002_alter_event_user_delete_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='lat',
            field=models.CharField(blank=True, max_length=101),
        ),
        migrations.AddField(
            model_name='event',
            name='lng',
            field=models.CharField(blank=True, max_length=101),
        ),
    ]
