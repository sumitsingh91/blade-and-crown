# backend/ai_advisor/serializers.py
from rest_framework import serializers
from .models import StyleAnalysis, Hairstyle

class HairstyleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hairstyle
        fields = '__all__'


class StyleAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = StyleAnalysis
        fields = '__all__'


class PhotoUploadSerializer(serializers.Serializer):
    photo = serializers.ImageField()
    session_id = serializers.CharField(max_length=100)