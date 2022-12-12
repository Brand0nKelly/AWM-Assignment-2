from django.contrib import admin

from .Models import Profile

admin.site.register(Profile, admin.ModelAdmin)
