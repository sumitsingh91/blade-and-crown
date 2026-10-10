# backend/store/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Product, Order, OrderItem
from .serializers import (
    CategorySerializer,
    ProductSerializer,
    OrderSerializer
)
import stripe
from django.conf import settings

stripe.api_key = settings.STRIPE_SECRET_KEY


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category__slug', 'badge']
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'rating', 'created_at']


@api_view(['POST'])
def create_order(request):
    try:
        items_data = request.data.get('items', [])
        total = 0

        # Calculate total
        for item in items_data:
            product = Product.objects.get(id=item['product_id'])
            total += product.price * item['quantity']

        # Create Stripe payment intent
        intent = stripe.PaymentIntent.create(
            amount=int(total * 100),
            currency='usd',
            metadata={'order_type': 'store'}
        )

        # Create order
        order = Order.objects.create(
            customer_name=request.data.get('customer_name'),
            customer_email=request.data.get('customer_email'),
            customer_phone=request.data.get('customer_phone'),
            shipping_address=request.data.get('shipping_address'),
            total_amount=total,
            stripe_payment_id=intent.id
        )

        # Create order items
        for item in items_data:
            product = Product.objects.get(id=item['product_id'])
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=item['quantity'],
                price=product.price
            )
            # Update stock
            product.stock -= item['quantity']
            product.save()

        return Response({
            'order_id': order.id,
            'client_secret': intent.client_secret,
            'total': str(total)
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )