from django.contrib import admin

from .models import Malgache, Etranger, Vehicule, Location

# Register your models here.
admin.site.register(Malgache)
admin.site.register(Etranger)
admin.site.register(Vehicule)
admin.site.register(Location)