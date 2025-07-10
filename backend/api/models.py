from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
import uuid

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

class UserProfile(models.Model):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
        ('N', 'Prefer not to say'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    full_name = models.CharField(max_length=100, blank=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, blank=True)
    country = models.CharField(max_length=50, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    subscribe_newsletter = models.BooleanField(default=False)
    receive_offers = models.BooleanField(default=False)
    email_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email} - {self.full_name}"

class EmailVerificationToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.UUIDField(default=uuid.uuid4, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def save(self, *args, **kwargs):
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(hours=24)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Verification token for {self.user.email}"

class PasswordResetToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.UUIDField(default=uuid.uuid4, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    used = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(hours=1)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Password reset token for {self.user.email}"