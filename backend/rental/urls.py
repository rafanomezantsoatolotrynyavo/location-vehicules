from django.urls import include, path
from rest_framework.routers import DefaultRouter

from rental.views import ClientViewSet, DashboardView, LocationViewSet, VehiculeViewSet
from rental.views.auth import ChangerMotDePasseView, CompteView, ConnexionView, DeconnexionView


router = DefaultRouter()
router.register("vehicules", VehiculeViewSet, basename="vehicule")
router.register("clients", ClientViewSet, basename="client")
router.register("locations", LocationViewSet, basename="location")

urlpatterns = [
    path("dashboard/", DashboardView.as_view(), name="dashboard"),
    path("auth/connexion/", ConnexionView.as_view(), name="connexion"),
    path("auth/deconnexion/", DeconnexionView.as_view(), name="deconnexion"),
    path("auth/compte/", CompteView.as_view(), name="compte"),
    path("auth/changer-mot-de-passe/", ChangerMotDePasseView.as_view(), name="changer-mot-de-passe"),
    path("", include(router.urls))
]