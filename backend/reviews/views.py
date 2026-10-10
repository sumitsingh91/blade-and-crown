# backend/reviews/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Avg, Count, Q
from .models import Review
from .serializers import ReviewSerializer

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer


@api_view(['GET'])
def review_summary(request):
    reviews = Review.objects.all()
    total = reviews.count()
    avg = reviews.aggregate(avg=Avg('rating'))['avg'] or 0

    breakdown = {}
    for i in range(5, 0, -1):
        count = reviews.filter(rating=i).count()
        percentage = (count / total * 100) if total > 0 else 0
        breakdown[f'{i}_star'] = {
            'count': count,
            'percentage': round(percentage, 1)
        }

    return Response({
        'average_rating': round(avg, 1),
        'total_reviews': total,
        'rating_breakdown': breakdown
    })