from django.urls import path
from . import views

urlpatterns = [
    # Authentication URLs
    path('auth/register/', views.register_user, name='register'),
    path('auth/login/', views.login_user, name='login'),
    path('auth/logout/', views.logout_user, name='logout'),
    path('auth/profile/', views.user_profile, name='user_profile'),
    path('auth/profile/update/', views.update_profile, name='update_profile'),
    path('auth/change-password/', views.change_password, name='change_password'),
    path('auth/verify-email/<str:token>/', views.verify_email, name='verify_email'),
    path('auth/password-reset/', views.request_password_reset, name='request_password_reset'),
    path('auth/password-reset/confirm/', views.confirm_password_reset, name='confirm_password_reset'),

    # Package URLs - Public
    path('packages/', views.PackageListView.as_view(), name='package_list'),
    path('packages/<int:pk>/', views.PackageDetailView.as_view(), name='package_detail'),

    # Package URLs - Admin
    path('admin/packages/', views.PackageAdminView.as_view(), name='package_admin_list'),
    path('admin/packages/<int:pk>/', views.PackageAdminDetailView.as_view(), name='package_admin_detail'),
    path('admin/packages/<int:package_id>/images/', views.PackageImageUploadView.as_view(), name='package_image_upload'),
]