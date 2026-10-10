# backend/bookings/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Booking, TimeSlot
from .serializers import BookingSerializer, TimeSlotSerializer
from django.core.mail import send_mail

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

    def perform_create(self, serializer):
        booking = serializer.save()

        # Send confirmation email (optional)
        try:
            send_mail(
                subject=f'Booking Confirmed - Blade & Crown',
                message=f'''
                Hi {booking.customer_name},

                Your booking has been confirmed!

                Service: {booking.service.name}
                Barber: {booking.barber.name}
                Date: {booking.date}
                Time: {booking.time}
                Total: ${booking.total_price}

                See you soon!
                Blade & Crown Barbershop
                ''',
                from_email='hello@bladeandcrown.com',
                recipient_list=[booking.customer_email],
                fail_silently=True,
            )
        except Exception:
            pass


@api_view(['GET'])
def available_slots(request):
    barber_id = request.query_params.get('barber_id')
    date = request.query_params.get('date')

    slots = TimeSlot.objects.filter(
        is_available=True
    )

    if barber_id:
        slots = slots.filter(barber_id=barber_id)
    if date:
        slots = slots.filter(date=date)

    serializer = TimeSlotSerializer(slots, many=True)
    return Response(serializer.data)