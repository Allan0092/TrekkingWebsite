from django.urls import path
from .views import PackageListCreate, PackageDetailView, PackageImageUploadView

urlpatterns = [
    path('packages/', PackageListCreate.as_view(), name='package-list'),
    path('packages/<int:pk>/', PackageDetailView.as_view(), name='package-detail'),
    path('packages/<int:package_id>/images/', PackageImageUploadView.as_view(), name='package-image-upload'),
]