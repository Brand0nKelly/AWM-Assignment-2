from django.db.backends.utils import logger
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib.gis.geos import Point
from rest_framework import permissions, status, generics
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.views import APIView

from World.serializers import LocationSerializer


class CustomAuthToken(ObtainAuthToken):

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email
        })

    def get(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email
        })


class UpdateLocation(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        print("User Location" + str(request.data))
        serializer = LocationSerializer(data=request.data)
        if serializer.is_valid():
            print("valid")
            user = serializer.update(request.user, serializer.validated_data)
            return Response(User.objects.get(username=user).username, status=status.HTTP_200_OK)
        print("Not valid")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)