# backend/payments/views.py
import stripe
from decimal import Decimal
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from .models import Payment

stripe.api_key = settings.STRIPE_SECRET_KEY


@api_view(['POST'])
@permission_classes([AllowAny])
def create_payment_intent(request):
    """Create Stripe PaymentIntent for order/booking"""
    try:
        amount = request.data.get('amount')
        payment_type = request.data.get('payment_type', 'order')
        customer_email = request.data.get('customer_email', '')
        customer_name = request.data.get('customer_name', '')
        reference_id = request.data.get('reference_id', '')
        metadata = request.data.get('metadata', {})

        if not amount:
            return Response(
                {'error': 'Amount is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Convert to cents (Stripe uses smallest currency unit)
        amount_cents = int(Decimal(str(amount)) * 100)

        # Create Stripe PaymentIntent
        intent = stripe.PaymentIntent.create(
            amount=amount_cents,
            currency='usd',
            automatic_payment_methods={'enabled': True},
            metadata={
                'customer_name': customer_name,
                'customer_email': customer_email,
                'payment_type': payment_type,
                'reference_id': str(reference_id),
                **metadata
            },
            receipt_email=customer_email if customer_email else None,
        )

        # Save to database
        Payment.objects.create(
            stripe_payment_id=intent.id,
            amount=amount,
            payment_type=payment_type,
            customer_email=customer_email,
            customer_name=customer_name,
            reference_id=str(reference_id),
            metadata=metadata,
        )

        return Response({
            'client_secret': intent.client_secret,
            'payment_intent_id': intent.id,
            'amount': amount,
            'publishable_key': settings.STRIPE_PUBLISHABLE_KEY,
        })

    except stripe.error.StripeError as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def confirm_payment(request):
    """Confirm payment & send email"""
    try:
        payment_intent_id = request.data.get('payment_intent_id')

        if not payment_intent_id:
            return Response(
                {'error': 'Payment intent ID required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Retrieve payment intent from Stripe
        intent = stripe.PaymentIntent.retrieve(payment_intent_id)

        # Update payment status in database
        try:
            payment = Payment.objects.get(stripe_payment_id=payment_intent_id)
            payment.status = 'completed' if intent.status == 'succeeded' else 'failed'
            payment.save()
        except Payment.DoesNotExist:
            pass

        if intent.status == 'succeeded':
            # Send confirmation email
            send_payment_confirmation_email(intent)

            return Response({
                'success': True,
                'status': 'completed',
                'message': 'Payment successful!'
            })

        return Response({
            'success': False,
            'status': intent.status,
            'message': 'Payment not completed'
        })

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


def send_payment_confirmation_email(intent):
    """Send email after successful payment"""
    try:
        metadata = intent.metadata
        email = metadata.get('customer_email', '')
        
        if not email:
            return

        payment_type = metadata.get('payment_type', 'order')
        
        if payment_type == 'booking':
            context = {
                'customer_name': metadata.get('customer_name', 'Customer'),
                'service_name': metadata.get('service_name', 'Service'),
                'barber_name': metadata.get('barber_name', 'Barber'),
                'booking_date': metadata.get('booking_date', ''),
                'booking_time': metadata.get('booking_time', ''),
                'duration': metadata.get('duration', '30'),
                'total_price': f"{intent.amount / 100:.2f}",
                'frontend_url': settings.FRONTEND_URL,
            }
            template = 'emails/booking_confirmation.html'
            subject = '✂️ Booking Confirmed - Blade & Crown'
        else:
            # Order email
            items = metadata.get('items', [])
            context = {
                'customer_name': metadata.get('customer_name', 'Customer'),
                'customer_phone': metadata.get('customer_phone', ''),
                'shipping_address': metadata.get('shipping_address', ''),
                'tracking_id': metadata.get('tracking_id', f'BC-{intent.id[-8:].upper()}'),
                'items': items if isinstance(items, list) else [],
                'subtotal': f"{intent.amount / 100:.2f}",
                'total': f"{intent.amount / 100:.2f}",
                'tracking_url': f"{settings.FRONTEND_URL}/track-order",
            }
            template = 'emails/order_confirmation.html'
            subject = '🎉 Order Confirmed - Blade & Crown'

        html_content = render_to_string(template, context)

        email_msg = EmailMessage(
            subject=subject,
            body=html_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[email],
        )
        email_msg.content_subtype = 'html'
        email_msg.send(fail_silently=True)

    except Exception as e:
        print(f"Email send error: {e}")


@api_view(['GET'])
@permission_classes([AllowAny])
def get_publishable_key(request):
    """Return Stripe publishable key to frontend"""
    return Response({
        'publishable_key': settings.STRIPE_PUBLISHABLE_KEY
    })