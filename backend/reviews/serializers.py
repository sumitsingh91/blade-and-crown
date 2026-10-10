# backend/reviews/serializers.py
from rest_framework import serializers
from .models import Review
from django.db.models import Avg, Count

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'


class ReviewSummarySerializer(serializers.Serializer):
    average_rating = serializers.FloatField()
    total_reviews = serializers.IntegerField()
    rating_breakdown = serializers.DictField()