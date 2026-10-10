# backend/reviews/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ReviewViewSet, review_summary

router = DefaultRouter()
router.register(r'list', ReviewViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('summary/', review_summary, name='review-summary'),
]