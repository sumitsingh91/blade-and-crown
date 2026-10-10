# backend/ai_advisor/views.py
import random
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import StyleAnalysis, Hairstyle
from .serializers import PhotoUploadSerializer, HairstyleSerializer

FACE_SHAPES = ['Oval', 'Square', 'Round', 'Heart']

RECOMMENDATIONS = {
    'Oval': [
        {'style': 'Textured Crop', 'match_percentage': 95, 'reason': 'Complements oval faces by adding texture on top.'},
        {'style': 'Classic Fade', 'match_percentage': 92, 'reason': 'Clean sides with versatile top styling.'},
        {'style': 'Quiff', 'match_percentage': 88, 'reason': 'Adds volume to forehead and enhances jaw structure.'},
        {'style': 'Side Part', 'match_percentage': 85, 'reason': 'Timeless look that complements oval face shapes.'}
    ],
    'Square': [
        {'style': 'Buzz Cut Fade', 'match_percentage': 96, 'reason': 'Accentuates sharp angular jawlines.'},
        {'style': 'Pompadour', 'match_percentage': 91, 'reason': 'Balances strong jaw structure with top volume.'},
        {'style': 'Slicked Back', 'match_percentage': 87, 'reason': 'Highlights strong facial features.'}
    ],
    'Round': [
        {'style': 'High Top Fade', 'match_percentage': 94, 'reason': 'Creates height to elongate round facial features.'},
        {'style': 'Angular Fringe', 'match_percentage': 89, 'reason': 'Adds distinct angles to softer facial curves.'}
    ],
    'Heart': [
        {'style': 'Mid Fade with Fringe', 'match_percentage': 93, 'reason': 'Balances a broader forehead with a slim chin.'},
        {'style': 'Long Textured Waves', 'match_percentage': 88, 'reason': 'Adds fullness around narrow jaw area.'}
    ]
}


@api_view(['POST'])
@permission_classes([AllowAny])
def analyze_face(request):
    serializer = PhotoUploadSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    photo = serializer.validated_data['photo']
    session_id = serializer.validated_data['session_id']

    # Select random face shape for demonstration
    detected_shape = random.choice(FACE_SHAPES)
    recommendations = RECOMMENDATIONS.get(detected_shape, RECOMMENDATIONS['Oval'])

    # Save to database
    try:
        analysis = StyleAnalysis.objects.create(
            uploaded_photo=photo,
            face_shape=detected_shape.lower(),
            confidence=round(random.uniform(0.88, 0.97), 2),
            recommendations=recommendations,
            session_id=session_id
        )
        analysis_id = analysis.id
        confidence = analysis.confidence
    except Exception:
        analysis_id = 1
        confidence = 0.94

    hairstyles = Hairstyle.objects.filter(is_active=True)
    hairstyle_data = HairstyleSerializer(hairstyles, many=True).data

    return Response({
        'analysis_id': analysis_id,
        'face_shape': detected_shape,
        'confidence': confidence,
        'features': {
            'forehead': 'Medium',
            'jawline': 'Defined',
            'cheekbones': 'High'
        },
        'ai_recommendations': recommendations,
        'hairstyles': hairstyle_data
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def get_hairstyles(request):
    face_shape = request.query_params.get('face_shape', None)

    if face_shape:
        hairstyles = Hairstyle.objects.filter(
            suitable_face_shapes__contains=[face_shape],
            is_active=True
        )
    else:
        hairstyles = Hairstyle.objects.filter(is_active=True)

    serializer = HairstyleSerializer(hairstyles, many=True)
    return Response(serializer.data)