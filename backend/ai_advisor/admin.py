# backend/ai_advisor/admin.py
from django.contrib import admin
from .models import StyleAnalysis, Hairstyle

@admin.register(StyleAnalysis)
class StyleAnalysisAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'face_shape', 'confidence',
        'session_id', 'created_at'
    ]
    list_filter = ['face_shape']

@admin.register(Hairstyle)
class HairstyleAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'suitable_face_shapes', 'is_active'
    ]
    list_filter = ['is_active']