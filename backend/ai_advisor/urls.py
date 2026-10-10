# backend/ai_advisor/urls.py
from django.urls import path
from .views import analyze_face, get_hairstyles

urlpatterns = [
    path('analyze/', analyze_face, name='analyze-face'),
    path('hairstyles/', get_hairstyles, name='get-hairstyles'),
]