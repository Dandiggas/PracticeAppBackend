# Generated by Django 4.0.10 on 2024-02-07 11:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('session', '0002_rename_event_date_session_session_date_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='session',
            name='instrument',
            field=models.CharField(default='Insert instrument', max_length=200),
        ),
        migrations.AlterField(
            model_name='session',
            name='description',
            field=models.CharField(default='Insert description', max_length=200),
        ),
    ]