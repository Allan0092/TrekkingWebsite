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
import traceback
from PIL import Image
import os

from .models import UserProfile, EmailVerificationToken, PasswordResetToken, Package, UserBookmark
from .serializers import (
    PackageImageSerializer, PackageSerializer, UserProfileSerializer, UserBookmarkSerializer
)

# User Authentication Views
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_user(request):
    """User registration endpoint"""
    try:
        data = request.data
        print(f"Registration data received: {data}")
        
        # Required fields validation
        required_fields = ['email', 'password', 'full_name']
        for field in required_fields:
            if not data.get(field):
                return Response({
                    'message': f'{field} is required'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if user already exists
        if User.objects.filter(email=data['email']).exists():
            return Response({
                'message': 'User with this email already exists'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check password confirmation
        if data.get('password') != data.get('confirm_password'):
            return Response({
                'message': 'Passwords do not match'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create user (using email as username)
        user = User.objects.create_user(
            username=data['email'],  # Use email as username
            email=data['email'],
            password=data['password'],
            first_name=data.get('full_name', ''),
        )
        print(f"User created: {user.email}")
        
        # Create user profile
        profile = UserProfile.objects.create(
            user=user,
            full_name=data.get('full_name', ''),
            phone=data.get('phone', ''),
            country=data.get('country', ''),
            date_of_birth=data.get('date_of_birth') if data.get('date_of_birth') else None,
            gender=data.get('gender', ''),
            subscribe_newsletter=data.get('subscribe_newsletter', False),
            receive_offers=data.get('receive_offers', False),
        )
        print(f"Profile created for user: {user.email}")
        
        # Create email verification token
        verification_token = EmailVerificationToken.objects.create(user=user)
        print(f"Verification token created: {verification_token.token}")
        print(f"Token expires at: {verification_token.expires_at}")
        
        # Send verification email
        try:
            verification_link = f"{settings.FRONTEND_URL}/verify-email/{verification_token.token}"
            print(f"Verification link: {verification_link}")
            
            html_message = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Verify Your Email</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #2563eb;">Welcome to Himalaya Adventure!</h2>
                    <p>Thank you for registering with us. Please verify your email address by clicking the button below:</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{verification_link}" 
                           style="background-color: #2563eb; color: white; padding: 12px 30px; 
                                  text-decoration: none; border-radius: 5px; display: inline-block;">
                            Verify Email Address
                        </a>
                    </div>
                    
                    <p>Or copy and paste this link in your browser:</p>
                    <p style="word-break: break-all; color: #666;">{verification_link}</p>
                    
                    <p style="margin-top: 30px; font-size: 14px; color: #666;">
                        This link will expire in 24 hours. If you didn't create an account, please ignore this email.
                    </p>
                    
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                    <p style="font-size: 14px; color: #666;">
                        Best regards,<br>
                        The Himalaya Adventure Team
                    </p>
                </div>
            </body>
            </html>
            """
            
            # Plain text fallback
            plain_message = f"""
            Welcome to Himalaya Adventure!
            
            Thank you for registering with us. Please verify your email address by clicking this link:
            {verification_link}
            
            This link will expire in 24 hours.
            
            Best regards,
            The Himalaya Adventure Team
            """
            
            send_mail(
                subject='Verify Your Email - Himalaya Adventure',
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                html_message=html_message,
                fail_silently=False,
            )
            print(f"Verification email sent to: {user.email}")
            
        except Exception as e:
            print(f"Failed to send verification email: {e}")
            # Continue with registration even if email fails
        
        return Response({
            'message': 'Registration successful! Please check your email for verification.',
            'user_id': user.id,
            'email': user.email
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        print(f"Registration error: {e}")
        print(f"Traceback: {traceback.format_exc()}")
        return Response({
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
            
            # Profile picture URL
            profile_picture_url = None
            if profile.profile_picture:
                profile_picture_url = request.build_absolute_uri(profile.profile_picture.url)
            
            return Response({
                'message': 'Login successful',
                'token': token.key,
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'full_name': profile.full_name,
                    'profile_picture_url': profile_picture_url,
                    'phone': profile.phone,
                    'country': profile.country,
                    'date_of_birth': profile.date_of_birth,
                    'gender': profile.gender,
                    'subscribe_newsletter': profile.subscribe_newsletter,
                    'receive_offers': profile.receive_offers,
                    'is_staff': user.is_staff,
                    'is_verified': profile.email_verified
                }
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
        print(f"Attempting to verify token: {token}")
        
        # Validate token format
        try:
            uuid.UUID(token)
            print(f"Token format is valid UUID: {token}")
        except ValueError:
            print(f"Invalid token format: {token}")
            return Response({
                'error': 'Invalid token format.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Try to find the verification token
        try:
            verification_token = EmailVerificationToken.objects.get(token=token)
            print(f"Found token for user: {verification_token.user.email}")
        except EmailVerificationToken.DoesNotExist:
            print(f"Token {token} not found in database")
            
            # Check if user exists and is already verified
            return Response({
                'error': 'This verification link has already been used or has expired. Your email may already be verified. Please try logging in.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if token is expired
        if verification_token.expires_at <= timezone.now():
            print(f"Token expired at {verification_token.expires_at}")
            return Response({
                'error': 'Verification token has expired. Please request a new verification email.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user = verification_token.user
        profile, created = UserProfile.objects.get_or_create(user=user)
        
        # Check if already verified
        if profile.email_verified:
            print(f"Email already verified for user: {user.email}")
            return Response({
                'message': 'Email is already verified. You can now login to your account.'
            }, status=status.HTTP_200_OK)
        
        # Verify the email
        profile.email_verified = True
        profile.save()
        print(f"Email verified for user: {user.email}")
        
        # Delete the verification token
        verification_token.delete()
        print(f"Verification token deleted for user: {user.email}")
        
        return Response({
            'message': 'Email verified successfully! You can now login to your account.'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"Unexpected error in verify_email: {e}")
        return Response({
            'error': 'An error occurred during verification. Please try again.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def password_reset_request(request):
    """Request password reset - send email with reset link"""
    try:
        email = request.data.get('email', '').strip().lower()
        
        if not email:
            return Response({
                'message': 'Email address is required'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Check if user exists
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # For security, always return success even if email doesn't exist
            return Response({
                'message': 'If an account with that email exists, we\'ve sent password reset instructions.'
            }, status=status.HTTP_200_OK)

        # Delete any existing unused tokens for this user
        PasswordResetToken.objects.filter(user=user, used=False).delete()

        # Create new reset token
        reset_token = PasswordResetToken.objects.create(
            user=user,
            token=str(uuid.uuid4()),  
            expires_at=timezone.now() + timedelta(hours=1)  # 1 hour expiry
        )

        # Create reset URL
        reset_url = f"http://localhost:5173/reset-password/{reset_token.token}"

        message = f"""
        Hi {user.first_name or user.email},

        You requested to reset your password for your Himalaya Adventure account.

        Click the link below to reset your password:
        {reset_url}

        This link will expire in 1 hour for security reasons.

        If you didn't request this password reset, please ignore this email or contact our support team.

        Best regards,
        The Himalaya Adventure Team
        """
        # Email content
        subject = 'Reset Your Himalaya Adventure Password'
        
        html_message = f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px;">🏔️ Reset Your Password</h1>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
                <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                    Hi <strong>{user.first_name or user.email}</strong>,
                </p>
                
                <p style="font-size: 16px; color: #666; line-height: 1.6; margin-bottom: 25px;">
                    You requested to reset your password for your Himalaya Adventure account. 
                    Click the button below to create a new password:
                </p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{reset_url}" 
                       style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                              color: white; 
                              padding: 15px 30px; 
                              text-decoration: none; 
                              border-radius: 50px; 
                              font-weight: bold; 
                              font-size: 16px;
                              display: inline-block;
                              box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
                        Reset My Password
                    </a>
                </div>
                
                <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 25px 0;">
                    <p style="color: #856404; margin: 0; font-size: 14px;">
                        ⚠️ <strong>Security Notice:</strong> This link will expire in 1 hour for your security.
                    </p>
                </div>
                
                <p style="font-size: 14px; color: #6c757d; margin-bottom: 15px;">
                    If the button doesn't work, copy and paste this link into your browser:
                </p>
                <p style="font-size: 12px; color: #6c757d; word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 4px;">
                    {reset_url}
                </p>
                
                <hr style="border: none; border-top: 1px solid #e9ecef; margin: 25px 0;">
                
                <p style="font-size: 14px; color: #6c757d; margin: 0;">
                    If you didn't request this password reset, please ignore this email or contact our support team.
                </p>
                
                <p style="font-size: 14px; color: #333; margin-top: 20px;">
                    Best regards,<br>
                    <strong>The Himalaya Adventure Team</strong>
                </p>
            </div>
        </body>
        </html>
        """

        try:
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                html_message=html_message,
                fail_silently=False,
            )
            
            return Response({
                'message': 'Password reset email sent successfully!'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"Email sending error: {str(e)}")
            return Response({
                'message': 'Failed to send password reset email. Please try again later.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    except Exception as e:
        print(f"Password reset request error: {str(e)}")
        return Response({
            'message': 'An error occurred. Please try again later.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def password_reset_confirm(request):
    """Confirm password reset with new password"""
    try:
        token = request.data.get('token')
        new_password = request.data.get('new_password')
        
        if not token or not new_password:
            return Response({
                'message': 'Token and new password are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate password strength
        if len(new_password) < 8:
            return Response({
                'message': 'Password must be at least 8 characters long'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not any(c.isupper() for c in new_password):
            return Response({
                'message': 'Password must contain at least one uppercase letter'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not any(c.islower() for c in new_password):
            return Response({
                'message': 'Password must contain at least one lowercase letter'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not any(c.isdigit() for c in new_password):
            return Response({
                'message': 'Password must contain at least one number'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            reset_token = PasswordResetToken.objects.get(token=token)
        except PasswordResetToken.DoesNotExist:
            return Response({
                'message': 'Invalid reset token'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if reset_token.used:
            return Response({
                'message': 'This reset link has already been used'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if reset_token.is_expired():
            return Response({
                'message': 'This reset link has expired'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Update user password
        user = reset_token.user
        user.set_password(new_password)
        user.save()
        
        # Mark token as used
        reset_token.used = True
        reset_token.save()
        
        # Delete all other reset tokens for this user
        PasswordResetToken.objects.filter(user=user).exclude(id=reset_token.id).delete()
        
        return Response({
            'message': 'Password reset successful! You can now log in with your new password.'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"Password reset confirm error: {str(e)}")
        return Response({
            'message': 'An error occurred while resetting your password'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Package views
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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_bookmark(request, package_id):
    """Toggle bookmark for a package"""
    try:
        package = Package.objects.get(id=package_id)
    except Package.DoesNotExist:
        return Response({
            'error': 'Package not found'
        }, status=status.HTTP_404_NOT_FOUND)

    try:
        # Check if bookmark already exists
        bookmark = UserBookmark.objects.get(user=request.user, package=package)
        bookmark.delete()
        return Response({
            'bookmarked': False,
            'message': 'Package removed from bookmarks'
        }, status=status.HTTP_200_OK)
    except UserBookmark.DoesNotExist:
        # Create new bookmark
        UserBookmark.objects.create(user=request.user, package=package)
        return Response({
            'bookmarked': True,
            'message': 'Package bookmarked successfully'
        }, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_bookmarks(request):
    """Get user's bookmarked packages"""
    try:
        bookmarks = UserBookmark.objects.filter(user=request.user).order_by('-created_at')
        serializer = UserBookmarkSerializer(bookmarks, many=True)
        return Response({
            'bookmarks': serializer.data,
            'total': bookmarks.count()
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_bookmark_status(request, package_id):
    """Check if a package is bookmarked by the user"""
    try:
        package = Package.objects.get(id=package_id)
        is_bookmarked = UserBookmark.objects.filter(
            user=request.user, 
            package=package
        ).exists()
        
        return Response({
            'bookmarked': is_bookmarked
        }, status=status.HTTP_200_OK)
    except Package.DoesNotExist:
        return Response({
            'error': 'Package not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user_account(request):
    """Delete user account permanently"""
    try:
        user = request.user
        
        # Log the deletion for audit purposes
        print(f"User account deletion requested: {user.email}")
        
        # Delete user's token first to invalidate session
        try:
            user.auth_token.delete()
        except:
            pass
        
        # Delete related data (optional - you might want to keep some data for business purposes)
        # Delete user bookmarks
        UserBookmark.objects.filter(user=user).delete()
        
        # Delete user profile
        UserProfile.objects.filter(user=user).delete()
        
        # Delete verification tokens
        EmailVerificationToken.objects.filter(user=user).delete()
        PasswordResetToken.objects.filter(user=user).delete()
        
        # Finally delete the user account
        user_email = user.email  # Store for response
        user.delete()
        
        return Response({
            'message': f'Account {user_email} has been permanently deleted',
            'success': True
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'Failed to delete account: {str(e)}',
            'success': False
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_password_for_deletion(request):
    """Verify user password before account deletion"""
    try:
        password = request.data.get('password')
        
        if not password:
            return Response({
                'error': 'Password is required',
                'valid': False
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if password is correct
        if not check_password(password, request.user.password):
            return Response({
                'error': 'Invalid password',
                'valid': False
            }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({
            'message': 'Password verified successfully',
            'valid': True
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'Password verification failed: {str(e)}',
            'valid': False
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def upload_profile_picture(request):
    """Upload profile picture"""
    try:
        if 'profile_picture' not in request.FILES:
            return Response({
                'error': 'No image file provided'
            }, status=status.HTTP_400_BAD_REQUEST)

        image_file = request.FILES['profile_picture']
        
        # Validate file type
        allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
        if image_file.content_type not in allowed_types:
            return Response({
                'error': 'Invalid file type. Please upload JPEG, PNG, or GIF images only.'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Validate file size (max 5MB)
        max_size = 5 * 1024 * 1024  # 5MB
        if image_file.size > max_size:
            return Response({
                'error': 'File size too large. Maximum size is 5MB.'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Get or create user profile
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        
        # Delete old profile picture if exists
        if profile.profile_picture:
            old_path = profile.profile_picture.path
            if os.path.exists(old_path):
                os.remove(old_path)

        # Save new profile picture
        profile.profile_picture = image_file
        profile.save()

        # Process image (resize to passport size: 200x200px)
        try:
            if profile.profile_picture:
                image_path = profile.profile_picture.path
                with Image.open(image_path) as img:
                    # Convert to RGB if necessary
                    if img.mode in ('RGBA', 'LA', 'P'):
                        img = img.convert('RGB')
                    
                    # Resize image to 200x200 (passport size)
                    img = img.resize((200, 200), Image.Resampling.LANCZOS)
                    img.save(image_path, 'JPEG', quality=85)
        except Exception as img_error:
            print(f"Image processing error: {img_error}")
            # Continue even if image processing fails

        # Generate the full URL for the profile picture
        profile_picture_url = None
        if profile.profile_picture:
            profile_picture_url = request.build_absolute_uri(profile.profile_picture.url)
        
        # Debug: Print the generated URL
        print(f"Generated profile picture URL: {profile_picture_url}")

        # Return updated profile data
        return Response({
            'message': 'Profile picture uploaded successfully',
            'profile_picture_url': profile_picture_url,
            'user': {
                'id': request.user.id,
                'email': request.user.email,
                'full_name': profile.full_name,
                'profile_picture_url': profile_picture_url,
            }
        }, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Upload error: {str(e)}")
        return Response({
            'error': f'Failed to upload profile picture: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def delete_profile_picture(request):
    """Delete profile picture"""
    try:
        profile = UserProfile.objects.get(user=request.user)
        
        if profile.profile_picture:
            # Delete the file from storage
            old_path = profile.profile_picture.path
            if os.path.exists(old_path):
                os.remove(old_path)
            
            # Clear the database field
            profile.profile_picture = None
            profile.save()
            
            return Response({
                'message': 'Profile picture deleted successfully'
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'message': 'No profile picture to delete'
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except UserProfile.DoesNotExist:
        return Response({
            'error': 'User profile not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'error': f'Failed to delete profile picture: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def verify_password(request):
    """Verify user's current password (for account deletion confirmation)"""
    try:
        password = request.data.get('password')
        
        if not password:
            return Response({
                'error': 'Password is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if check_password(password, request.user.password):
            return Response({
                'valid': True,
                'message': 'Password verified successfully'
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'valid': False,
                'error': 'Invalid password'
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        print(f"Password verification error: {str(e)}")
        return Response({
            'error': 'An error occurred while verifying password'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def validate_reset_token(request, token):
    """Validate if reset token is valid and not expired"""
    try:
        # Remove UUID validation since we're now using string tokens
        print(f"Validating token: {token}")
        
        # Query using string token directly
        reset_token = PasswordResetToken.objects.get(token=token)
        print(f"Found token for user: {reset_token.user.email}")
        
        if reset_token.used:
            return Response({
                'error': 'This reset link has already been used'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if reset_token.is_expired():
            return Response({
                'error': 'This reset link has expired'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({
            'message': 'Token is valid',
            'email': reset_token.user.email
        }, status=status.HTTP_200_OK)
        
    except PasswordResetToken.DoesNotExist:
        print(f"Token {token} not found in database")
        return Response({
            'error': 'Invalid reset link'
        }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print(f"Token validation error: {str(e)}")
        return Response({
            'error': 'An error occurred while validating the token'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
