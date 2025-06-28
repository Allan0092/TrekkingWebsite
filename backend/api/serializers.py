from rest_framework import serializers
from .models import Package, PackageImage


class PackageImageSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)

    class Meta:
        model= PackageImage
        fields = ['id', 'image', 'alt_text', 'order']

class PackageSerializer(serializers.ModelSerializer):
    images = PackageImageSerializer(many=True, read_only=True)
    class Meta:
        model = Package
        fields = '__all__'