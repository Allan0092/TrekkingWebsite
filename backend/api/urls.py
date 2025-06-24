from django.urls import path
from .views import PackageListCreate, PackageDetail

urlpatterns = [
    path('packages/', PackageListCreate.as_view(), name='package-list'),
    path('package/<int:pk>/', PackageDetail.as_view(), name='package-detail'),
]