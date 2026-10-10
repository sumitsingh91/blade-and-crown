# backend/gallery/models.py
from django.db import models

class GalleryImage(models.Model):
    CATEGORY_CHOICES = [
        ('fades', 'Fades'),
        ('beards', 'Beards'),
        ('classic', 'Classic Cuts'),
        ('creative', 'Creative'),
        ('transformations', 'Transformations'),
    ]

    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to='gallery/')
    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES
    )
    barber_name = models.CharField(max_length=100, blank=True)
    style_name = models.CharField(max_length=100, blank=True)
    is_before_after = models.BooleanField(default=False)
    before_image = models.ImageField(
        upload_to='gallery/before/',
        blank=True,
        null=True
    )
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title