from django.urls import path
from .views import TaskListCreate, TaskDetail, PackageListCreate, PackageDetail

urlpatterns = [
    path('tasks/', TaskListCreate.as_view(), name='task-list'),
    path('tasks/<int:pk>/', TaskDetail.as_view(), name='task-detail'),
    path('packages/', PackageListCreate.as_view(), name='package-list'),
    path('package/<int:pk>/', PackageDetail.as_view(), name='package-detail'),
]