from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser, IsAuthenticated  
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import check_password
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
    try:
        data = request.data
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return Response({
                'message': 'Email and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Try to find user by email and authenticate using username
        try:
            user_obj = User.objects.get(email=email)
            user = authenticate(username=user_obj.username, password=password)
        except User.DoesNotExist:
            user = None
        
        if user is not None:
            # Generate token
            token, created = Token.objects.get_or_create(user=user)
            
            # Get or create user profile
            profile, created = UserProfile.objects.get_or_create(user=user)
            
            # Return complete user data
            user_data = {
                'id': user.id,
                'email': user.email,
                'full_name': profile.full_name,
                'phone': profile.phone,
                'country': profile.country,
                'date_of_birth': profile.date_of_birth,
                'gender': profile.gender,
                'subscribe_newsletter': profile.subscribe_newsletter,
                'receive_offers': profile.receive_offers,
                'is_staff': user.is_staff,
                'is_verified': profile.email_verified
            }
            
            return Response({
                'message': 'Login successful',
                'token': token.key,
                'user': user_data
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'message': 'Invalid email or password'
            }, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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

@api_view(['PUT'])
@permission_classes([permissions.IsAuthenticated])
def update_profile(request):
    """Update user profile"""
    try:
        # Get or create user profile
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        
        # Update user fields
        user = request.user
        data = request.data
        
        if 'full_name' in data:
            profile.full_name = data['full_name']
        if 'email' in data:
            # Check if email already exists for another user
            if User.objects.filter(email=data['email']).exclude(id=user.id).exists():
                return Response({
                    'message': 'Email already exists'
                }, status=status.HTTP_400_BAD_REQUEST)
            user.email = data['email']
        if 'phone' in data:
            profile.phone = data['phone']
        if 'country' in data:
            profile.country = data['country']
        if 'date_of_birth' in data:
            profile.date_of_birth = data['date_of_birth']
        if 'gender' in data:
            profile.gender = data['gender']

        # Save changes
        user.save()
        profile.save()

        # Return updated profile data
        serializer = UserProfileSerializer(profile)
        return Response({
            'message': 'Profile updated successfully',
            'user': serializer.data
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@permission_classes([permissions.IsAuthenticated])
def update_notifications(request):
    """Update user notification preferences"""
    try:
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        data = request.data

        # Update notification preferences
        if 'newsletter' in data:
            profile.subscribe_newsletter = data['newsletter']
        if 'offers' in data:
            profile.receive_offers = data['offers']

        profile.save()

        return Response({
            'message': 'Notification preferences updated successfully',
            'newsletter': profile.subscribe_newsletter,
            'offers': profile.receive_offers
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def change_password(request):
    """Change user password"""
    try:
        user = request.user
        data = request.data

        current_password = data.get('current_password')
        new_password = data.get('new_password')

        if not current_password or not new_password:
            return Response({
                'message': 'Both current and new passwords are required'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Verify current password
        if not check_password(current_password, user.password):
            return Response({
                'message': 'Current password is incorrect'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Set new password
        user.set_password(new_password)
        user.save()

        # Update token 
        Token.objects.filter(user=user).delete()
        new_token = Token.objects.create(user=user)

        return Response({
            'message': 'Password changed successfully',
            'token': new_token.key
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
