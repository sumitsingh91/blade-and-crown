# backend/backend/urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/services/', include('services.urls')),
    path('api/bookings/', include('bookings.urls')),
    path('api/store/', include('store.urls')),
    path('api/gallery/', include('gallery.urls')),
    path('api/reviews/', include('reviews.urls')),
    path('api/ai/', include('ai_advisor.urls')),
    path('api/newsletter/', include('newsletter.urls')),
    path('api/payments/', include('payments.urls')),
    path('api/admin/', include('admin_api.urls')),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )
