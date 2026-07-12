from rest_framework import viewsets
from .models import Fuel
from .serializers import FuelSerializer

class FuelViewSet(viewsets.ModelViewSet):
    queryset = Fuel.objects.all()
    serializer_class = FuelSerializer
