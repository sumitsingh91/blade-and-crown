# backend/gallery/views.py
from rest_framework import viewsets
from .models import GalleryImage
from .serializers import GalleryImageSerializer

class GalleryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = GalleryImage.objects.all()
    serializer_class = GalleryImageSerializer
    filterset_fields = ['category', 'is_featured']