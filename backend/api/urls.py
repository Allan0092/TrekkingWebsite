from django.urls import path
from . import views

urlpatterns = [
    # Authentication URLs
    path('auth/register/', views.register_user, name='register'),
    path('auth/login/', views.login_user, name='login'),
    path('auth/logout/', views.logout_user, name='logout'),
    
    # Profile URLs
    path('profile/update/', views.update_profile, name='update_profile'),
    path('profile/notifications/', views.update_notifications, name='update_notifications'),
    path('profile/change-password/', views.change_password, name='change_password'),

    # Profile picture management
    path('profile/upload-picture/', views.upload_profile_picture, name='upload_profile_picture'),
    path('profile/delete-picture/', views.delete_profile_picture, name='delete_profile_picture'),
    
    # Email verification and password reset
    path('auth/verify-email/<str:token>/', views.verify_email, name='verify_email'),
    path('auth/password-reset/', views. password_reset_request, name='request_password_reset'),
    path('auth/password-reset/confirm/', views.password_reset_confirm, name='confirm_password_reset'),

    # Password Reset URLs
    path('auth/password-reset-request/', views.password_reset_request, name='password_reset_request'),
    path('auth/validate-reset-token/<uuid:token>/', views.validate_reset_token, name='validate_reset_token'),
    path('auth/password-reset-confirm/', views.password_reset_confirm, name='password_reset_confirm'),
    
    # Package URLs - Public
    path('packages/', views.PackageListView.as_view(), name='package_list'),
    path('packages/<int:pk>/', views.PackageDetailView.as_view(), name='package_detail'),

    # Package URLs - Admin
    path('admin/packages/', views.PackageAdminView.as_view(), name='package_admin_list'),
    path('admin/packages/<int:pk>/', views.PackageAdminDetailView.as_view(), name='package_admin_detail'),
    path('admin/packages/<int:package_id>/images/', views.PackageImageUploadView.as_view(), name='package_image_upload'),

    # Bookmark URLs
    path('bookmarks/', views.user_bookmarks, name='user_bookmarks'),
    path('packages/<int:package_id>/bookmark/', views.toggle_bookmark, name='toggle_bookmark'),
    path('packages/<int:package_id>/bookmark/status/', views.check_bookmark_status, name='check_bookmark_status'),


    # Account deletion URLs
    path('account/delete/', views.delete_user_account, name='delete_user_account'),
    path('account/verify-password/', views.verify_password_for_deletion, name='verify_password_for_deletion'),
]