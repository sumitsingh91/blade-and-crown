# backend/services/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ServiceViewSet, BarberViewSet

router = DefaultRouter()
router.register(r'list', ServiceViewSet)
router.register(r'barbers', BarberViewSet)

urlpatterns = [
    path('', include(router.urls)),
]