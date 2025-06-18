from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class Task(models.Model):
    title = models.CharField(max_length=200)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return self.title

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
        max_digits=10000,
        decimal_places=2,
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