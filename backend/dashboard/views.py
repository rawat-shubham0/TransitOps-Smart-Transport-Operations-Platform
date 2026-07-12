from rest_framework.decorators import api_view
from rest_framework.response import Response

from vehicles.models import Vehicle
from drivers.models import Driver
from trips.models import Trip
from maintenance.models import Maintenance
from fuel.models import Fuel
from expenses.models import Expense

from django.db.models import Sum


@api_view(["GET"])
def dashboard(request):

    total_vehicles = Vehicle.objects.count()

    available_vehicles = Vehicle.objects.filter(
        status="Available"
    ).count()

    maintenance_vehicles = Vehicle.objects.filter(
        status="In Shop"
    ).count()

    active_trips = Trip.objects.filter(
        status="Dispatched"
    ).count()

    drivers_on_duty = Driver.objects.filter(
        status="Available"
    ).count()

    fleet_utilization = 0

    if total_vehicles > 0:
        fleet_utilization = round(
            (active_trips / total_vehicles) * 100,
            2
        )

    fuel_cost = Fuel.objects.aggregate(
        total=Sum("cost")
    )["total"] or 0

    expense_cost = Expense.objects.aggregate(
        total=Sum("amount")
    )["total"] or 0

    return Response({

        "total_vehicles": total_vehicles,

        "available_vehicles": available_vehicles,

        "maintenance": maintenance_vehicles,

        "active_trips": active_trips,

        "drivers_on_duty": drivers_on_duty,

        "fleet_utilization": fleet_utilization,

        "fuel_cost": fuel_cost,

        "expense_cost": expense_cost,

    })
