from rest_framework import serializers
from .models import Package, PackageImage, Itinerary

class PackageImageSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)

    class Meta:
        model = PackageImage
        fields = ['id', 'image', 'alt_text', 'order']

class ItinerarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Itinerary
        fields = ['day', 'title', 'description', 'icon']

class PackageSerializer(serializers.ModelSerializer):
    images = PackageImageSerializer(many=True, read_only=True)
    itineraries = ItinerarySerializer(many=True, read_only=True)

    class Meta:
        model = Package
        fields = ['id', 'title', 'description', 'duration', 'price', 'altitude', 'difficulty', 'created_at', 'images', 'itineraries']