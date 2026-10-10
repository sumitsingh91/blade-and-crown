# backend/payments/admin.py
from django.contrib import admin
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = [
        'customer_name', 'amount', 'currency',
        'payment_type', 'status', 'created_at'
    ]
    list_filter = ['status', 'payment_type', 'created_at']
    search_fields = ['customer_email', 'customer_name', 'stripe_payment_id']
    readonly_fields = ['stripe_payment_id', 'created_at', 'updated_at']