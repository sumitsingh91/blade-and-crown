# backend/ai_advisor/models.py
from django.db import models

class StyleAnalysis(models.Model):
    FACE_SHAPES = [
        ('oval', 'Oval'),
        ('round', 'Round'),
        ('square', 'Square'),
        ('heart', 'Heart'),
        ('oblong', 'Oblong'),
        ('diamond', 'Diamond'),
    ]

    uploaded_photo = models.ImageField(upload_to='ai_photos/')
    face_shape = models.CharField(
        max_length=20,
        choices=FACE_SHAPES,
        blank=True
    )
    confidence = models.FloatField(default=0)
    recommendations = models.JSONField(default=list)
    session_id = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Analysis {self.id} - {self.face_shape}"


class Hairstyle(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to='hairstyles/')
    suitable_face_shapes = models.JSONField(default=list)
    tags = models.JSONField(default=list)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name