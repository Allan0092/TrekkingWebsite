from django.utils import timezone
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate
from django.db import transaction
from .models import UserProfile, EmailVerificationToken, PasswordResetToken, Package, PackageImage, Itinerary, UserBookmark

class PackageImageSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)

    class Meta:
        model = PackageImage
        fields = ['id', 'image', 'alt_text', 'order']

class ItinerarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Itinerary
        fields = ['day', 'title', 'description', 'icon']

class PackageSerializer(serializers.ModelSerializer):
    images = PackageImageSerializer(many=True, read_only=True)
    itineraries = ItinerarySerializer(many=True, read_only=True)

    class Meta:
        model = Package
        fields = ['id', 'title', 'description', 'duration', 'price', 'altitude', 'difficulty', 'created_at', 'images', 'itineraries']

# User-related serializers
class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True)
    
    # UserProfile fields
    full_name = serializers.CharField(max_length=100)
    gender = serializers.CharField(max_length=20)
    country = serializers.CharField(max_length=50)
    date_of_birth = serializers.DateField()
    phone = serializers.CharField(max_length=20)
    subscribe_newsletter = serializers.BooleanField(default=False)
    receive_offers = serializers.BooleanField(default=False)

    class Meta:
        model = User
        fields = ['email', 'password', 'confirm_password', 'full_name', 'gender', 'country', 'date_of_birth', 'phone', 'subscribe_newsletter', 'receive_offers']

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        profile_data = {
            'full_name': validated_data.pop('full_name'),
            'gender': validated_data.pop('gender'),
            'country': validated_data.pop('country'),
            'date_of_birth': validated_data.pop('date_of_birth'),
            'phone': validated_data.pop('phone'),
            'subscribe_newsletter': validated_data.pop('subscribe_newsletter'),
            'receive_offers': validated_data.pop('receive_offers'),
        }
        
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        
        UserProfile.objects.create(user=user, **profile_data)
        
        EmailVerificationToken.objects.create(user=user)
        
        return user

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            user = authenticate(username=email, password=password)
            
            if not user:
                raise serializers.ValidationError("Invalid credentials.")
            
            if not user.is_active:
                raise serializers.ValidationError("User account is disabled.")

            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError("Must include email and password.")

class UserProfileSerializer(serializers.ModelSerializer):
    email = serializers.CharField(source='user.email', read_only=True)
    date_joined = serializers.CharField(source='user.date_joined', read_only=True)
    profile_picture_url = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = [
            'id', 'email', 'full_name', 'gender', 
            'country', 'date_of_birth', 'phone', 'profile_picture', 
            'profile_picture_url', 'subscribe_newsletter', 
            'receive_offers', 'email_verified', 'date_joined'
        ]
        read_only_fields = ['id', 'email', 'email_verified', 'date_joined', 'profile_picture_url']

    def get_profile_picture_url(self, obj):
        """Get the full URL for the profile picture"""
        if obj.profile_picture:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_picture.url)
            return obj.profile_picture.url
        return None

class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField()
    new_password = serializers.CharField(validators=[validate_password])
    confirm_password = serializers.CharField()

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return attrs

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("No user found with this email address.")
        return value

class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.CharField()
    new_password = serializers.CharField(validators=[validate_password])
    confirm_password = serializers.CharField()

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return attrs

    def validate_token(self, value):
        try:
            PasswordResetToken.objects.get(
                token=value,
                used=False,
                expires_at__gt=timezone.now()
            )
        except PasswordResetToken.DoesNotExist:
            raise serializers.ValidationError("Invalid or expired token.")
        return value

class UserBookmarkSerializer(serializers.ModelSerializer):
    package = PackageSerializer(read_only=True)
    
    class Meta:
        model = UserBookmark
        fields = ['id', 'package', 'created_at']
        read_only_fields = ['created_at']