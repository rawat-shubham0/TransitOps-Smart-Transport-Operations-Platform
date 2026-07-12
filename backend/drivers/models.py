from django.db import models


class Driver(models.Model):

    STATUS_CHOICES = [
        ("Available", "Available"),
        ("On Trip", "On Trip"),
        ("Off Duty", "Off Duty"),
        ("Suspended", "Suspended"),
    ]

    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    license_number = models.CharField(max_length=50, unique=True)
    license_expiry = models.DateField()
    safety_score = models.PositiveIntegerField(default=100)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Available"
    )

    def __str__(self):
        return self.name