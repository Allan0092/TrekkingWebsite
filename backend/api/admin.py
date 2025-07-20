from django.contrib import admin
from .models import Package, PackageImage, Itinerary, PasswordResetToken, EmailVerificationToken

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

@admin.register(PasswordResetToken)
class PasswordResetTokenAdmin(admin.ModelAdmin):
    list_display = ['user', 'token', 'created_at', 'expires_at', 'used']
    list_filter = ['used', 'created_at', 'expires_at']
    search_fields = ['user__email', 'user__full_name']
    readonly_fields = ['token', 'created_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')

@admin.register(EmailVerificationToken)
class EmailVerificationTokenAdmin(admin.ModelAdmin):
    list_display = ['user', 'token', 'created_at', 'expires_at']
    list_filter = ['created_at', 'expires_at']
    search_fields = ['user__email', 'user__full_name']
    readonly_fields = ['token', 'created_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')