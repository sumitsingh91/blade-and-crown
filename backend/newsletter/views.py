# backend/newsletter/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Subscriber
from .serializers import SubscriberSerializer

@api_view(['POST'])
def subscribe(request):
    serializer = SubscriberSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        subscriber, created = Subscriber.objects.get_or_create(
            email=email
        )
        if created:
            return Response(
                {'message': 'Successfully subscribed!'},
                status=status.HTTP_201_CREATED
            )
        else:
            return Response(
                {'message': 'Already subscribed!'},
                status=status.HTTP_200_OK
            )
    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )
    