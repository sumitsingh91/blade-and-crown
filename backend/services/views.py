# backend/services/views.py
from rest_framework import viewsets
from .models import Service, Barber
from .serializers import ServiceSerializer, BarberSerializer

class ServiceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Service.objects.filter(is_active=True)
    serializer_class = ServiceSerializer


class BarberViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Barber.objects.filter(is_available=True)
    serializer_class = BarberSerializer