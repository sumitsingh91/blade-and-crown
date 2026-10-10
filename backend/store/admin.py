# backend/store/admin.py
from django.contrib import admin
from .models import Category, Product, Order, OrderItem

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'order']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'category', 'price',
        'old_price', 'stock', 'badge', 'is_active'
    ]
    list_filter = ['category', 'badge', 'is_active']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['price', 'stock', 'is_active']

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'customer_name', 'total_amount',
        'status', 'created_at'
    ]
    list_filter = ['status']
    inlines = [OrderItemInline]