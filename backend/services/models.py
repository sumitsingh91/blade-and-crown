# backend/services/models.py
from django.db import models

class Service(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    duration = models.IntegerField(help_text="Duration in minutes")
    price = models.DecimalField(max_digits=6, decimal_places=2)
    icon = models.CharField(max_length=10, default="✂️")
    image = models.ImageField(
        upload_to='services/',
        blank=True,
        null=True
    )
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.name


class Barber(models.Model):
    name = models.CharField(max_length=100)
    specialty = models.CharField(max_length=200)
    bio = models.TextField(blank=True)
    photo = models.ImageField(upload_to='barbers/')
    rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=5.0
    )
    years_experience = models.IntegerField(default=1)
    is_available = models.BooleanField(default=True)
    services = models.ManyToManyField(Service, related_name='barbers')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name