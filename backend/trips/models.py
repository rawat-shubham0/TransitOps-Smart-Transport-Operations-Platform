from django.db import models
from vehicles.models import Vehicle
from drivers.models import Driver


class Trip(models.Model):

    STATUS_CHOICES = [
        ("Draft", "Draft"),
        ("Dispatched", "Dispatched"),
        ("Completed", "Completed"),
        ("Cancelled", "Cancelled"),
    ]

    vehicle = models.ForeignKey(
        Vehicle,
        on_delete=models.CASCADE,
        related_name="trips"
    )

    driver = models.ForeignKey(
        Driver,
        on_delete=models.CASCADE,
        related_name="trips"
    )

    source = models.CharField(max_length=150)
    destination = models.CharField(max_length=150)

    cargo_weight = models.PositiveIntegerField()
    planned_distance = models.PositiveIntegerField()

    start_date = models.DateField()
    end_date = models.DateField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Draft"
    )

    def __str__(self):
        return f"{self.vehicle} -> {self.destination}"