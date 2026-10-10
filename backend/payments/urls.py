# backend/payments/urls.py
from django.urls import path
from .views import create_payment_intent, confirm_payment, get_publishable_key

urlpatterns = [
    path('create-intent/', create_payment_intent, name='create-intent'),
    path('confirm/', confirm_payment, name='confirm-payment'),
    path('config/', get_publishable_key, name='get-config'),
]