# backend/admin_api/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from django.db.models import Count, Sum, Avg
from django.utils import timezone
from datetime import timedelta
from accounts.models import User
from bookings.models import Booking
from store.models import Order, Product
from services.models import Service, Barber
from reviews.models import Review
from payments.models import Payment


@api_view(['GET'])
@permission_classes([IsAdminUser])
def dashboard_stats(request):
    """Get overall stats for admin dashboard"""
    today = timezone.now().date()
    week_ago = today - timedelta(days=7)
    month_ago = today - timedelta(days=30)
    
    # Total counts
    total_users = User.objects.count()
    total_bookings = Booking.objects.count()
    total_orders = Order.objects.count()
    total_products = Product.objects.filter(is_active=True).count()
    total_services = Service.objects.filter(is_active=True).count()
    total_barbers = Barber.objects.count()
    total_reviews = Review.objects.count()
    
    # Revenue stats
    total_revenue = Payment.objects.filter(
        status='completed'
    ).aggregate(total=Sum('amount'))['total'] or 0
    
    weekly_revenue = Payment.objects.filter(
        status='completed',
        created_at__date__gte=week_ago
    ).aggregate(total=Sum('amount'))['total'] or 0
    
    monthly_revenue = Payment.objects.filter(
        status='completed',
        created_at__date__gte=month_ago
    ).aggregate(total=Sum('amount'))['total'] or 0
    
    # Recent activity
    recent_bookings = Booking.objects.order_by('-created_at')[:5].values(
        'id', 'customer_name', 'date', 'time', 'status', 'total_price', 'created_at'
    )
    
    recent_orders = Order.objects.order_by('-created_at')[:5].values(
        'id', 'customer_name', 'total_amount', 'status', 'created_at'
    )
    
    # Bookings by status
    bookings_by_status = Booking.objects.values('status').annotate(
        count=Count('id')
    )
    
    # Average rating
    avg_rating = Review.objects.aggregate(avg=Avg('rating'))['avg'] or 0
    
    # Growth stats (compare current month to previous)
    current_month_bookings = Booking.objects.filter(
        created_at__date__gte=month_ago
    ).count()
    
    prev_month_start = month_ago - timedelta(days=30)
    prev_month_bookings = Booking.objects.filter(
        created_at__date__gte=prev_month_start,
        created_at__date__lt=month_ago
    ).count()
    
    booking_growth = 0
    if prev_month_bookings > 0:
        booking_growth = round(
            ((current_month_bookings - prev_month_bookings) / prev_month_bookings) * 100, 1
        )
    
    return Response({
        'overview': {
            'total_users': total_users,
            'total_bookings': total_bookings,
            'total_orders': total_orders,
            'total_products': total_products,
            'total_services': total_services,
            'total_barbers': total_barbers,
            'total_reviews': total_reviews,
            'avg_rating': round(avg_rating, 1),
        },
        'revenue': {
            'total': float(total_revenue),
            'weekly': float(weekly_revenue),
            'monthly': float(monthly_revenue),
        },
        'growth': {
            'booking_growth': booking_growth,
            'current_month_bookings': current_month_bookings,
        },
        'recent_bookings': list(recent_bookings),
        'recent_orders': list(recent_orders),
        'bookings_by_status': list(bookings_by_status),
    })


@api_view(['GET'])
@permission_classes([IsAdminUser])
def all_users(request):
    """Get all users for admin management"""
    users = User.objects.all().order_by('-date_joined').values(
        'id', 'username', 'email', 'first_name', 'last_name',
        'phone', 'is_active', 'is_staff', 'date_joined'
    )
    return Response(list(users))


@api_view(['GET'])
@permission_classes([IsAdminUser])
def all_bookings(request):
    """Get all bookings with details"""
    from bookings.serializers import BookingSerializer
    bookings = Booking.objects.all().order_by('-created_at')
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def all_orders(request):
    """Get all orders with details"""
    from store.serializers import OrderSerializer
    orders = Order.objects.all().order_by('-created_at')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def update_booking_status(request, booking_id):
    """Update booking status (admin only)"""
    try:
        booking = Booking.objects.get(id=booking_id)
        new_status = request.data.get('status')
        if new_status:
            booking.status = new_status
            booking.save()
            return Response({'success': True, 'status': booking.status})
        return Response({'error': 'Status required'}, status=400)
    except Booking.DoesNotExist:
        return Response({'error': 'Booking not found'}, status=404)


@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def update_order_status(request, order_id):
    """Update order status"""
    try:
        order = Order.objects.get(id=order_id)
        new_status = request.data.get('status')
        if new_status:
            order.status = new_status
            order.save()
            return Response({'success': True, 'status': order.status})
        return Response({'error': 'Status required'}, status=400)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=404)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_user(request, user_id):
    """Delete a user"""
    try:
        user = User.objects.get(id=user_id)
        if user.is_superuser:
            return Response({'error': 'Cannot delete superuser'}, status=400)
        user.delete()
        return Response({'success': True})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
    
    
import time
from store.models import Product, Category
from store.serializers import ProductSerializer

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_products(request):
    """Get all products for admin management"""
    products = Product.objects.all().order_by('-created_at')
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_categories(request):
    """Get all categories for dropdown"""
    categories = Category.objects.all().values('id', 'name')
    return Response(list(categories))

@api_view(['POST'])
@permission_classes([IsAdminUser])
def create_product(request):
    """Create a new product with image upload"""
    try:
        category_id = request.data.get('category')
        name = request.data.get('name')
        
        # Get or create a fallback category if not provided
        if category_id:
            category = Category.objects.get(id=category_id)
        else:
            category, _ = Category.objects.get_or_create(
                name='General Store', 
                defaults={'slug': 'general-store'}
            )

        # Generate unique slug
        base_slug = name.lower().replace(' ', '-')
        unique_slug = f"{base_slug}-{int(time.time())}"

        product = Product(
            name=name,
            category=category,
            description=request.data.get('description', ''),
            price=request.data.get('price', 0.00),
            stock=request.data.get('stock', 0),
            badge=request.data.get('badge', ''),
            brand=request.data.get('brand', 'BLADE & CROWN'),
            slug=unique_slug
        )
        
        # Handle Image Upload
        if 'image' in request.FILES:
            product.image = request.FILES['image']
            
        product.save()
        return Response({'success': True, 'message': 'Product added successfully!'})
        
    except Exception as e:
        print("❌ Error creating product:", str(e))
        return Response({'error': str(e)}, status=400)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_product(request, product_id):
    """Delete a product"""
    try:
        Product.objects.get(id=product_id).delete()
        return Response({'success': True})
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=404)
