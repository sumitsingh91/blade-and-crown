# backend/reviews/admin.py
from django.contrib import admin
from .models import Review

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = [
        'customer_name', 'rating', 'badge',
        'platform', 'is_featured', 'created_at'
    ]
    list_filter = ['rating', 'platform', 'is_featured']
    list_editable = ['is_featured']