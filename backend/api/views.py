from rest_framework import generics
from .models import Package
from .serializers import PackageSerializer


class PackageListCreate(generics.ListCreateAPIView):
    queryset = Package.objects.all()
    serializer_class = PackageSerializer

class PackageDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Package.objects.all()
    serializer_class = PackageSerializer