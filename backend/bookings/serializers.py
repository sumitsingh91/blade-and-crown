# backend/bookings/serializers.py
from rest_framework import serializers
from datetime import datetime, time
from .models import Booking, TimeSlot
from services.models import Service, Barber


class TimeSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSlot
        fields = '__all__'


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = [
            'id', 'service', 'barber', 'date', 'time',
            'customer_name', 'customer_email', 'customer_phone',
            'notes', 'status', 'total_price', 'created_at'
        ]
        read_only_fields = ['status', 'total_price', 'created_at']

    def validate_time(self, value):
        """Accept almost any time format and convert to time object"""
        if isinstance(value, time):
            return value

        if isinstance(value, str):
            value = value.strip()
            formats = [
                '%H:%M:%S',   # 09:00:00
                '%H:%M',      # 09:00
                '%I:%M %p',   # 09:00 AM
                '%I:%M%p',    # 09:00AM
                '%I:%M:%S %p' # 09:00:00 AM
            ]
            for fmt in formats:
                try:
                    return datetime.strptime(value, fmt).time()
                except ValueError:
                    continue
            raise serializers.ValidationError(
                f"Time format '{value}' is invalid. Use HH:MM:SS or h:mm AM/PM"
            )
        raise serializers.ValidationError("Invalid time value")

    def validate_service(self, value):
        if not Service.objects.filter(id=value.id if hasattr(value, 'id') else value).exists():
            raise serializers.ValidationError("Selected service does not exist.")
        return value

    def validate_barber(self, value):
        if not Barber.objects.filter(id=value.id if hasattr(value, 'id') else value).exists():
            raise serializers.ValidationError("Selected barber does not exist.")
        return value

    def create(self, validated_data):
        service = validated_data['service']
        validated_data['total_price'] = service.price
        validated_data['status'] = 'confirmed'

        # Try to mark timeslot unavailable (ignore if no matching slot)
        try:
            TimeSlot.objects.filter(
                barber=validated_data['barber'],
                date=validated_data['date'],
                time=validated_data['time']
            ).update(is_available=False)
        except Exception:
            pass

        return super().create(validated_data)