# backend/accounts/serializers.py
from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name',
            'last_name', 'phone', 'avatar', 'date_of_birth',
            'is_staff', 'is_superuser'  # 👈 CRUCIAL: Added for Admin access
        ]
        read_only_fields = ['id', 'is_staff', 'is_superuser']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=6,
        style={'input_type': 'password'}
    )
    confirm_password = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = [
            'username', 'email', 'first_name', 'last_name',
            'phone', 'password', 'confirm_password'
        ]

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({
                'confirm_password': "Passwords do not match"
            })

        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({
                'email': "Email already registered"
            })

        if User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError({
                'username': "Username already taken"
            })

        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone=validated_data.get('phone', ''),
        )
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'}
    )

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        try:
            user_obj = User.objects.get(email=email)
            user = authenticate(
                username=user_obj.username,
                password=password
            )
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid email or password")

        if not user:
            raise serializers.ValidationError("Invalid email or password")

        if not user.is_active:
            raise serializers.ValidationError("Account is disabled")

        data['user'] = user
        return data