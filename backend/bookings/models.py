# backend/bookings/models.py
from django.db import models
from services.models import Service, Barber

class TimeSlot(models.Model):
    barber = models.ForeignKey(
        Barber,
        on_delete=models.CASCADE,
        related_name='time_slots'
    )
    date = models.DateField()
    time = models.TimeField()
    is_available = models.BooleanField(default=True)

    class Meta:
        unique_together = ['barber', 'date', 'time']
        ordering = ['date', 'time']

    def __str__(self):
        return f"{self.barber.name} - {self.date} {self.time}"


class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    service = models.ForeignKey(
        Service,
        on_delete=models.CASCADE
    )
    barber = models.ForeignKey(
        Barber,
        on_delete=models.CASCADE
    )
    date = models.DateField()
    time = models.TimeField()
    customer_name = models.CharField(max_length=100)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=20)
    notes = models.TextField(blank=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    total_price = models.DecimalField(
        max_digits=6,
        decimal_places=2
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.customer_name} - {self.service.name} ({self.date})"