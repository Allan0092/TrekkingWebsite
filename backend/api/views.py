from rest_framework import generics
from .models import Task, Package
from .serializers import TaskSerializer, PackageSerializer

class TaskListCreate(generics.ListCreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

class TaskDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

class PackageListCreate(generics.ListCreateAPIView):
    queryset = Package.objects.all()
    serializer_class = PackageSerializer

class PackageDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = PackageSerializer