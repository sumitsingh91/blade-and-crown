# backend/services/admin.py
from django.contrib import admin
from .models import Service, Barber

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'duration', 'is_active', 'order']
    list_editable = ['is_active', 'order']
    list_filter = ['is_active']

@admin.register(Barber)
class BarberAdmin(admin.ModelAdmin):
    list_display = ['name', 'specialty', 'rating', 'is_available']
    list_editable = ['is_available']
    filter_horizontal = ['services']