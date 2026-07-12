from rest_framework.routers import DefaultRouter
from .views import FuelViewSet

router = DefaultRouter()
router.register("", FuelViewSet)

urlpatterns = router.urls