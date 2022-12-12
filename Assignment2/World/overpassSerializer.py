import string

from django.contrib.auth import get_user_model
from django.contrib.gis.geos import Point
from rest_framework import serializers


class OverpassSerializer(serializers.Serializer):
    """
    Serializer to take in a query data to be passed on to the Overpass API.
    """
    query = serializers.CharField(required=True)
    bbox = serializers.CharField(required=True)

    def to_internal_value(self, data):
        """
        Converts incoming JSON strings into appropriate Python representation. Especially important for the
        'bbox' (bounding box) object which becomes a list with floats.
        :param data: JSON incoming
        :return: Dict of appropriate types
        """

        # In this section we parse the query and get rid of any 'stop words' and punctuation.
        STOPWORDS = ('and', 'or', 'amenity', '=', '==')
        internal_rep = {}
        if data.get("query", None):
            query = data["query"]
            mod_query = ""
            for char in query:
                if char in string.punctuation:
                    mod_query += " "
                else:
                    mod_query += char
            mod_query = mod_query.split()
            query = []
            for word in mod_query:
                if word.lower() not in STOPWORDS:
                    query.append(word)

            internal_rep["query"] = query
        if data.get("bbox", None):
            bbox = data["bbox"].split(",")
            # When dealing with Geo data there can be inconsistencies in how coordinates are handled. We generally
            # say 'Lat, Lon' in common usage but the 'x' axis more correctly corresponds to Lon, not Lat, hence GEOS
            # objects like Point() expect data in Lon, Lat sequence. Overpass, however, expects Lat, Lon.
            # So, leaflet gives us a bounding box as ({west}, {south}, {north}, {east}) but Overpass needs it to be
            # ({south},{west},{north},{east}). Therefore, we shuffle the numbers.
            shuffled_bbox = [bbox[1], bbox[0], bbox[3], bbox[2]]
            mod_bbox = [float(item) for item in shuffled_bbox]
            internal_rep["bbox"] = mod_bbox

        return internal_rep
