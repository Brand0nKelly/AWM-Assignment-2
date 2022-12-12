from django.contrib.gis.geos import Point
from rest_framework import serializers

from .Models import Profile, WorldBorder


class WorldBorderSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = WorldBorder
        fields = ['name', 'area', 'pop2005', 'fips', 'iso2', 'iso3', 'un', 'region', 'subregion', 'lon', 'lat', 'mpoly']


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['last_location']

    def update(self, instance, validated_data):
        user_profile = Profile.objects.get(user=instance)
        lat = 0
        lon = 0
        point = Point(float(lon), float(lat))
        user_profile.last_location = point
        user_profile.save()
        return user_profile


