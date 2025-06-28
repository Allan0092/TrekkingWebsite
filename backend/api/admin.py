from django.contrib import admin
from .models import Package, PackageImage

class PackageImageInline(admin.TabularInline):
    model = PackageImage
    extra = 1
    fields = ['image', 'alt_text', 'order']

@admin.register(Package)
class PackageAdmin(admin.ModelAdmin):
    list_display = ('title', 'duration', 'price', 'difficulty', 'altitude')
    list_filter = ('difficulty', 'duration')
    search_fields = ('title', 'description')
    ordering = ('-id',)
    inlines = [PackageImageInline]

    def save_model(self, request, obj, form, change):
        if not obj.title:
            obj.title = 'Unnamed Package'
        super().save_model(request, obj, form, change)

@admin.register(PackageImage)
class PackageImageAdmin(admin.ModelAdmin):
    list_display = ('package', 'image', 'alt_text', 'order')
    list_filter = ('package',)
    search_fields = ('alt_text',)