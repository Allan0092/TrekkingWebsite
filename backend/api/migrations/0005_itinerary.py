# Generated by Django 5.2.3 on 2025-07-07 14:49

import django.core.validators
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_package_created_at'),
    ]

    operations = [
        migrations.CreateModel(
            name='Itinerary',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('day', models.PositiveSmallIntegerField(validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(90)])),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('icon', models.CharField(choices=[('plane-land', 'Plane Land'), ('hike-up', 'Hike Up'), ('highest-point', 'Highest Point'), ('hike-down', 'Hike Down'), ('flight-depart', 'Flight Depart')], default='hike-up', max_length=20)),
                ('package', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='itineraries', to='api.package')),
            ],
            options={
                'ordering': ['day'],
                'unique_together': {('package', 'day')},
            },
        ),
    ]
