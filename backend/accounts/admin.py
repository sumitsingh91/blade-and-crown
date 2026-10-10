# backend/accounts/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = [
        'username', 'email', 'first_name',
        'last_name', 'phone', 'is_active', 'date_joined'
    ]
    list_filter = ['is_active', 'is_staff', 'date_joined']
    search_fields = ['username', 'email', 'first_name', 'last_name']

    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {
            'fields': ('phone', 'avatar', 'date_of_birth')
        }),
    )