# backend/gallery/admin.py
from django.contrib import admin
from .models import GalleryImage

@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'category', 'barber_name',
        'is_featured', 'created_at'
    ]
    list_filter = ['category', 'is_featured']
    list_editable = ['is_featured']