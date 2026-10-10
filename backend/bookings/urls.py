# backend/bookings/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BookingViewSet, available_slots

router = DefaultRouter()
router.register(r'list', BookingViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('available-slots/', available_slots, name='available-slots'),
]