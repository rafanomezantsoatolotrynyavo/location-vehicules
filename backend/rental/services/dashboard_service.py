from datetime import date, timedelta
from decimal import Decimal
from django.db.models import Sum
from rental.models import Location, Vehicule
from rental.serializers.location import LocationSerializer
from rental.services import statut_service


def obtenir_donnees_dashboard(today=None) :
    today = today or date.today()

    statut_service.recalcul_all(today)

    return {
        "cartes": _calcul_cartes(),
        "repartition_statuts_vehicules": _calcul_repartition_statuts(),
        "futur_retours": _calcul_futur_retours(today),
        "dernieres_locations": _calcul_lasts_location()
    }


def _calcul_cartes() :
    chiffre_affaires = Location.objects.filter(
        statut__in = [Location.Statut.EN_COURS, Location.Statut.TERMINEE]
    ).aggregate(total=Sum("montant"))["total"] or Decimal("0")

    return {
        "nb_vehicules": Vehicule.objects.count(),
        "nb_clients": _compter_client(),
        "nb_location_en_cours": Location.objects.filter(statut=Location.Statut.EN_COURS).count(),
        "chiffre_affaires": chiffre_affaires
    }


def _compter_client():
    from rental.models import Client
    return Client.objects.count()


def _calcul_repartition_statuts():
    comptage = dict(
        Vehicule.objects.values_list("statut").annotate(total=None)
    ) if False else {}

    comptage = {
        statut_valeur: Vehicule.objects.filter(statut=statut_valeur).count()
        for statut_valeur, _ in Vehicule.Statut.choices
    }

    return [
        {"statut": statut_valeur, "nombre": comptage[statut_valeur]}
        for statut_valeur, _ in Vehicule.Statut.choices
    ]


def _calcul_futur_retours(today):
    date_max = today + timedelta(days=3)

    locations = (
        Location.objects.filter(
            statut = Location.Statut.EN_COURS,
            date_fin__gte = today,
            date_fin__lte = date_max
        ).select_related("client", "vehicule").order_by("date_fin")
    )
    return LocationSerializer(locations, many=True).data


def _calcul_lasts_location():
    locations = Location.objects.select_related("client", "vehicule")[:5]
    return LocationSerializer(locations, many=True).data