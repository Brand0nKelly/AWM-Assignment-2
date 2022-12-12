import overpy
from django import views
from django.contrib.gis.geos import Polygon, Point
from rest_framework import status

from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.utils import json
from rest_framework.views import APIView

from World import serializers, overpassSerializer


class QueryOverpass(APIView):
    """
    Query Overpass (OpenStreetMap) API

    This class-based view accepts a request containing a free-form query and the bounding box of the visible map
    viewport. It assumes that the request has a valid user (i.e. is authenticated). The associated serializer ensures
    that the data iss in a correct form before being handled by this view.

    The view uses a Python library called OverPy (Python Overpass API) -
    https://python-overpy.readthedocs.io/en/latest/index.html

    The view process a POST request only.
    """
    permission_classes = [IsAuthenticated, ]
    serializer_class = overpassSerializer.OverpassSerializer

    def post(self, request, *args, **kwargs):
        try:
            # Create overpass API object
            api = overpy.Overpass()

            # Overpass has its own somewhat arcane query language. Fortunately we can make some assumptions and creat
            # a shell which can be 'filled in'. Thus we make a beginning, middle and end of the query. The middle part
            # will be modified to get the details of our query.
            api_query_top = \
                """
                [out:json][timeout:25];
                (
                """

            api_query_bottom = \
                """
                );
                out body;
                >;
                out skel qt;
                """

            api_middle = ""

            # Run our incoming data through the serializer to validate and pre-process it.
            my_serializer = overpassSerializer.OverpassSerializer(data=request.data)
            if my_serializer.is_valid():
                bbox = my_serializer.validated_data["bbox"]
                for item in my_serializer.validated_data["query"]:
                    if item == "*":
                        api_middle += f'node["amenity"]{tuple(bbox)};\nway["amenity"]{tuple(bbox)};\nrelation["amenity"]{tuple(bbox)};'
                        break
                    else:
                        api_middle += f'node["amenity"="cafes"]{tuple(bbox)};\nway["amenity"="bars"]{tuple(bbox)};\nrelation["amenity"="pubs"]{tuple(bbox)};'

                # OpenStreetMap stores its data as 'Nodes' (Point objects), 'Ways' (Linestring or Polygon objects) or
                # 'Relations' (Used to define logical or geographic relationships between different objects,
                # for example a lake and its island, or several roads for a bus route. In this qquery type I'm focusing
                # on objects tagged as 'amenity' in the database such as cafes, bars, pubs, restaurants etc. You could
                # easily modify this for other types. A result which is a node will have a single point whereas a result
                # which is a way could be a polygon (e.g. the footprint of a pub). For this we need a single point so we
                # compute the centroid of the polygon and use it.
                api_query = f"{api_query_top}\n{api_middle}\n{api_query_bottom}\n"
                result = api.query(api_query)

                # The result should be returned as GeoJSON. A Python dictionarry with a list of 'features' can be easily
                # serialized as GeoJSON
                geojson_result = {
                    "type": "FeatureCollection",
                    "features": [],
                }

                # This next section iterates thriugh each 'way' and gets its centroid. It also keeps a record of the
                # points in the so that they are not duplicated when we process the 'nodes'
                nodes_in_way = []

                for way in result.ways:
                    geojson_feature = None
                    geojson_feature = {
                        "type": "Feature",
                        "id": "",
                        "geometry": "",
                        "properties": {}
                    }
                    poly = []
                    for node in way.nodes:
                        # Record the nodes and make the polygon
                        nodes_in_way.append(node.id)
                        poly.append([float(node.lon), float(node.lat)])
                    # Make a poly out of the nodes in way.
                    # Some ways are badly made so, if we can't succeed just ignore the way and move on.
                    try:
                        poly = Polygon(poly)
                    except:
                        continue
                    geojson_feature["id"] = f"way_{way.id}"
                    geojson_feature["geometry"] = json.loads(poly.centroid.geojson)
                    geojson_feature["properties"] = {}
                    for k, v in way.tags.items():
                        geojson_feature["properties"][k] = v

                    geojson_result["features"].append(geojson_feature)

                # Process results that are 'nodes'
                for node in result.nodes:
                    # Ignore nodes which are also in a 'way' as we will have already processed the 'way'.
                    if node.id in nodes_in_way:
                        continue
                    geojson_feature = None
                    geojson_feature = {
                        "type": "Feature",
                        "id": "",
                        "geometry": "",
                        "properties": {}
                    }
                    point = Point([float(node.lon), float(node.lat)])
                    geojson_feature["id"] = f"node_{node.id}"
                    geojson_feature["geometry"] = json.loads(point.geojson)
                    geojson_feature["properties"] = {}
                    for k, v in node.tags.items():
                        geojson_feature["properties"][k] = v

                    geojson_result["features"].append(geojson_feature)

                # Return the complete GeoJSON structure.
                return Response(geojson_result, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message": f"Error: {e}."}, status=status.HTTP_400_BAD_REQUEST)