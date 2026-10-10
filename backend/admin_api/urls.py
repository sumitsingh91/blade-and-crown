# backend/admin_api/urls.py
from django.urls import path
from .views import (
    dashboard_stats,
    all_users,
    all_bookings,
    all_orders,
    update_booking_status,
    update_order_status,
    delete_user,
    # New imports:
    admin_products,
    get_categories,
    create_product,
    delete_product
)

urlpatterns = [
    path('stats/', dashboard_stats, name='admin-stats'),
    path('users/', all_users, name='admin-users'),
    path('bookings/', all_bookings, name='admin-bookings'),
    path('orders/', all_orders, name='admin-orders'),
    path('bookings/<int:booking_id>/update/', update_booking_status, name='update-booking'),
    path('orders/<int:order_id>/update/', update_order_status, name='update-order'),
    path('users/<int:user_id>/delete/', delete_user, name='delete-user'),
    
    # Store Management URLs
    path('products/', admin_products, name='admin-products'),
    path('categories/', get_categories, name='admin-categories'),
    path('products/create/', create_product, name='create-product'),
    path('products/<int:product_id>/delete/', delete_product, name='delete-product'),
]
