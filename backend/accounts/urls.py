# backend/accounts/urls.py
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    register,
    login,
    logout,
    profile,
    update_profile,
    user_dashboard_data
)

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('logout/', logout, name='logout'),
    path('profile/', profile, name='profile'),
    path('profile/update/', update_profile, name='update-profile'),
    path('dashboard/', user_dashboard_data, name='dashboard-data'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
]