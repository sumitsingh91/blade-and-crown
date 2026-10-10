# backend/payments/models.py
from django.db import models

class Payment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]

    PAYMENT_TYPE = [
        ('booking', 'Booking'),
        ('order', 'Order'),
    ]

    stripe_payment_id = models.CharField(max_length=200, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default='usd')
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    payment_type = models.CharField(
        max_length=20,
        choices=PAYMENT_TYPE
    )
    customer_email = models.EmailField()
    customer_name = models.CharField(max_length=100)
    reference_id = models.CharField(max_length=100)  # Booking or Order ID
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.customer_name} - ${self.amount} - {self.status}"