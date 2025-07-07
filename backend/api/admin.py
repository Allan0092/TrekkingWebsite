from django.contrib import admin
from .models import Package, PackageImage, Itinerary

class PackageImageInline(admin.TabularInline):
    model = PackageImage
    extra = 1
    fields = ['image', 'alt_text', 'order']

class ItineraryInline(admin.TabularInline):
    model = Itinerary
    extra = 1
    fields = ['day', 'title', 'description', 'icon']

@admin.register(Package)
class PackageAdmin(admin.ModelAdmin):
    list_display = ('title', 'duration', 'price', 'difficulty', 'altitude')
    list_filter = ('difficulty', 'duration')
    search_fields = ('title', 'description')
    ordering = ('-id',)
    inlines = [PackageImageInline, ItineraryInline]

    def save_model(self, request, obj, form, change):
        if not obj.title:
            obj.title = 'Unnamed Package'
        super().save_model(request, obj, form, change)

@admin.register(PackageImage)
class PackageImageAdmin(admin.ModelAdmin):
    list_display = ('package', 'image', 'alt_text', 'order')
    list_filter = ('package',)
    search_fields = ('alt_text',)

@admin.register(Itinerary)
class ItineraryAdmin(admin.ModelAdmin):
    list_display = ('package', 'day', 'title', 'icon')
    list_filter = ('package', 'icon')
    search_fields = ('title', 'description')