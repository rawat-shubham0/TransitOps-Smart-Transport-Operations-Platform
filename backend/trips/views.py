from rest_framework import viewsets
from rest_framework.exceptions import ValidationError

from .models import Trip
from .serializers import TripSerializer


class TripViewSet(viewsets.ModelViewSet):

    queryset = Trip.objects.all()
    serializer_class = TripSerializer

    def perform_create(self, serializer):

        vehicle = serializer.validated_data["vehicle"]
        driver = serializer.validated_data["driver"]

        cargo = serializer.validated_data["cargo_weight"]

        if vehicle.status in ["In Shop", "Retired"]:
            raise ValidationError("Vehicle unavailable.")

        if driver.status in ["Suspended", "On Trip"]:
            raise ValidationError("Driver unavailable.")

        if cargo > vehicle.capacity:
            raise ValidationError("Cargo exceeds vehicle capacity.")

        vehicle.status = "On Trip"
        driver.status = "On Trip"

        vehicle.save()
        driver.save()

        serializer.save(status="Dispatched")