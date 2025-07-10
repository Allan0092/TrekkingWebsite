from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
import uuid

from .models import UserProfile, EmailVerificationToken, PasswordResetToken, Package
from .serializers import (
    PackageImageSerializer, PackageSerializer,
    UserRegistrationSerializer, UserLoginSerializer, UserProfileSerializer,
    PasswordChangeSerializer, PasswordResetRequestSerializer, 
    PasswordResetConfirmSerializer
)

# User Authentication Views
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_user(request):
    """User registration endpoint"""
    serializer = UserRegistrationSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.save()
        
        # Get the verification token
        verification_token = EmailVerificationToken.objects.get(user=user)
        
        # Send verification email
        try:
            verification_link = f"{settings.FRONTEND_URL}/verify-email/{verification_token.token}"
            send_mail(
                subject='Verify Your Email - Trekking Website',
                message=f'Please click the link to verify your email: {verification_link}',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
            )
        except Exception as e:
            print(f"Failed to send verification email: {e}")
        
        return Response({
            'message': 'Registration successful! Please check your email for verification.',
            'user_id': user.id
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_user(request):
    """User login endpoint"""
    serializer = UserLoginSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.validated_data['user']
        
        # Create or get auth token
        token, created = Token.objects.get_or_create(user=user)
        
        # Get user profile
        profile, created = UserProfile.objects.get_or_create(user=user)
        
        return Response({
            'message': 'Login successful',
            'token': token.key,
            'user': {
                'id': user.id,
                'email': user.email,
                'full_name': profile.full_name,
                'email_verified': profile.email_verified
            }
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_user(request):
    """User logout endpoint"""
    try:
        request.user.auth_token.delete()
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
    except:
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_profile(request):
    """Get user profile"""
    profile, created = UserProfile.objects.get_or_create(user=request.user)
    serializer = UserProfileSerializer(profile)
    return Response(serializer.data)

@api_view(['PUT', 'PATCH'])
@permission_classes([permissions.IsAuthenticated])
def update_profile(request):
    """Update user profile"""
    profile, created = UserProfile.objects.get_or_create(user=request.user)
    
    serializer = UserProfileSerializer(
        profile, 
        data=request.data, 
        partial=request.method == 'PATCH'
    )
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def change_password(request):
    """Change user password"""
    serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
    
    if serializer.is_valid():
        user = request.user
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        # Delete old tokens and create new one
        Token.objects.filter(user=user).delete()
        token = Token.objects.create(user=user)
        
        return Response({
            'message': 'Password changed successfully',
            'token': token.key
        })
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def verify_email(request, token):
    """Verify email with token"""
    try:
        verification_token = EmailVerificationToken.objects.get(
            token=token,
            expires_at__gt=timezone.now()
        )
        
        user = verification_token.user
        profile, created = UserProfile.objects.get_or_create(user=user)
        
        profile.email_verified = True
        profile.save()
        
        # Delete the verification token
        verification_token.delete()
        
        return Response({'message': 'Email verified successfully'})
        
    except EmailVerificationToken.DoesNotExist:
        return Response(
            {'error': 'Invalid or expired verification token'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def request_password_reset(request):
    """Request password reset"""
    serializer = PasswordResetRequestSerializer(data=request.data)
    
    if serializer.is_valid():
        email = serializer.validated_data['email']
        user = User.objects.get(email=email)
        
        # Create password reset token
        token = str(uuid.uuid4())
        PasswordResetToken.objects.create(
            user=user,
            token=token,
            expires_at=timezone.now() + timedelta(hours=1)
        )
        
        # Send password reset email
        try:
            reset_link = f"{settings.FRONTEND_URL}/reset-password/{token}"
            send_mail(
                subject='Password Reset - Trekking Website',
                message=f'Click the link to reset your password: {reset_link}',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )
        except Exception as e:
            print(f"Failed to send password reset email: {e}")
        
        return Response({'message': 'Password reset email sent'})
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def confirm_password_reset(request):
    """Confirm password reset with token"""
    serializer = PasswordResetConfirmSerializer(data=request.data)
    
    if serializer.is_valid():
        token = serializer.validated_data['token']
        new_password = serializer.validated_data['new_password']
        
        reset_token = PasswordResetToken.objects.get(token=token)
        user = reset_token.user
        
        # Update password
        user.set_password(new_password)
        user.save()
        
        # Mark token as used
        reset_token.used = True
        reset_token.save()
        
        # Delete old auth tokens
        Token.objects.filter(user=user).delete()
        
        return Response({'message': 'Password reset successful'})
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Package views (keep your existing ones)
class PackageListView(generics.ListAPIView):
    """List all packages (public view)"""
    queryset = Package.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = PackageSerializer

class PackageDetailView(generics.RetrieveAPIView):
    """Get single package details (public view)"""
    queryset = Package.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = PackageSerializer

class PackageAdminView(generics.ListCreateAPIView):
    """Admin view for listing and creating packages"""
    queryset = Package.objects.all()
    serializer_class = PackageSerializer
    permission_classes = [IsAdminUser]

class PackageAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Admin view for updating and deleting packages"""
    queryset = Package.objects.all()
    serializer_class = PackageSerializer
    permission_classes = [IsAdminUser]

class PackageImageUploadView(APIView):
    """Upload images for packages"""
    permission_classes = [IsAdminUser]
    
    def post(self, request, package_id):
        try:
            package = Package.objects.get(id=package_id)
        except Package.DoesNotExist:
            return Response({'error': 'Package not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = PackageImageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(package=package)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
