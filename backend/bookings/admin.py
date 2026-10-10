# backend/bookings/admin.py
from django.contrib import admin
from .models import Booking, TimeSlot

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = [
        'customer_name', 'service', 'barber',
        'date', 'time', 'status', 'total_price'
    ]
    list_filter = ['status', 'date', 'barber']
    search_fields = ['customer_name', 'customer_email']
    list_editable = ['status']

@admin.register(TimeSlot)
class TimeSlotAdmin(admin.ModelAdmin):
    list_display = ['barber', 'date', 'time', 'is_available']
    list_filter = ['barber', 'date', 'is_available']
    list_editable = ['is_available']