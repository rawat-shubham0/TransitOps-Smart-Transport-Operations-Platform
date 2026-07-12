from django.db import models


class Vehicle(models.Model):

    STATUS_CHOICES = [
        ("Available", "Available"),
        ("On Trip", "On Trip"),
        ("In Shop", "In Shop"),
        ("Retired", "Retired"),
    ]

    registration_number = models.CharField(max_length=30, unique=True)
    model = models.CharField(max_length=100)
    vehicle_type = models.CharField(max_length=50)
    capacity = models.PositiveIntegerField(help_text="Capacity in KG")
    odometer = models.PositiveIntegerField(default=0)
    acquisition_cost = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Available"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.registration_number