# backend/services/serializers.py
from rest_framework import serializers
from .models import Service, Barber

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'


class BarberSerializer(serializers.ModelSerializer):
    services = ServiceSerializer(many=True, read_only=True)

    class Meta:
        model = Barber
        fields = '__all__'