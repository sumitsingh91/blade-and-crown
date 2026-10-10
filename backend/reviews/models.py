# backend/reviews/models.py
from django.db import models

class Review(models.Model):
    customer_name = models.CharField(max_length=100)
    customer_photo = models.ImageField(
        upload_to='reviews/',
        blank=True,
        null=True
    )
    rating = models.IntegerField(
        choices=[(i, i) for i in range(1, 6)]
    )
    review_text = models.TextField()
    badge = models.CharField(
        max_length=20,
        default='Regular Client',
        choices=[
            ('Regular Client', 'Regular Client'),
            ('First Visit', 'First Visit'),
            ('VIP Client', 'VIP Client'),
        ]
    )
    platform = models.CharField(
        max_length=20,
        default='website',
        choices=[
            ('website', 'Website'),
            ('google', 'Google'),
            ('yelp', 'Yelp'),
            ('facebook', 'Facebook'),
        ]
    )
    is_featured = models.BooleanField(default=False)
    visit_date = models.DateField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.customer_name} - {self.rating}★"