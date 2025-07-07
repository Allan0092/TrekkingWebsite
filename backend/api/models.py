from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import AbstractUser

class Package(models.Model):
    title = models.CharField(max_length=300)
    description = models.TextField()
    duration = models.PositiveSmallIntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(90),
        ]
    )
    price = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        validators=[
            MinValueValidator(1),
            MaxValueValidator(1000000),
        ],
        blank=True,
        null=True
    )
    altitude = models.DecimalField(
        max_digits=7,
        decimal_places=2,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(10000),
        ]
    )
    difficulty = models.CharField(
        max_length=10,
        choices=[
            ('EASY', 'Easy'),
            ('MEDIUM', 'Medium'),
            ('TOUGH', 'Tough'),
            ('VERY_TOUGH', 'Very Tough'),
        ],
        default='MEDIUM',
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class PackageImage(models.Model):
    package = models.ForeignKey(Package, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='package_images/')
    alt_text = models.CharField(max_length=255, blank=True)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['order']

class Itinerary(models.Model):
    package = models.ForeignKey(Package, related_name='itineraries', on_delete=models.CASCADE)
    day = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(90)])
    title = models.CharField(max_length=255)
    description = models.TextField()
    icon = models.CharField(
        max_length=20,
        choices=[
            ('plane-land', 'Plane Land'),
            ('hike-up', 'Hike Up'),
            ('highest-point', 'Highest Point'),
            ('hike-down', 'Hike Down'),
            ('flight-depart', 'Flight Depart'),
        ],
        default='hike-up',
    )

    class Meta:
        ordering = ['day']
        unique_together = ['package', 'day']

    def __str__(self):
        return f"Day {self.day}: {self.title}"