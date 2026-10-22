from datetime import date
from decimal import Decimal
from django.db import transaction
from rental.exceptions import RegleMetierError
from rental.models import Location, Vehicule
from rental.services import statut_service


def verifier_disponibilite(vehicule, date_debut, date_fin, exclure_location=None) :
    if vehicule.statut == Vehicule.Statut.EN_MAINTENANCE :
        raise RegleMetierError(
            "Ce véhicule est en maintenance et ne peut être ni réservé ni loué.", status_code=409
        )

    locations_concurrentes = vehicule.locations.filter(
        statut__in = [Location.Statut.RESERVEE, Location.Statut.EN_COURS],
        date_debut__lte = date_fin,
        date_fin__gte = date_debut
    )

    if exclure_location is not None :
        locations_concurrentes = locations_concurrentes.exclude(pk=exclure_location.pk)

    if locations_concurrentes.exists() :
        raise RegleMetierError(
            "Ce vehicule est déjà réservé ou loué sur une période qui chevauche les dates demandées.", status_code=409
        )


def calculer_montant(vehicule, date_debut, date_fin):
    nombre_jours = (date_fin - date_debut).days + 1
    return vehicule.prix_jour * Decimal(nombre_jours)


def verifier_date_debut_non_passee(date_debut, aujourd_hui=None):
    aujourd_hui = aujourd_hui or date.today()
    if date_debut < aujourd_hui:
        raise RegleMetierError(
            "La date de début ne peut pas être antérieure à aujourd'hui.",
            status_code=400,
        )


@transaction.atomic
def creer_location(client, vehicule, date_debut, date_fin):
    verifier_date_debut_non_passee(date_debut)
    verifier_disponibilite(vehicule, date_debut, date_fin)

    location = Location(
        client=client,
        vehicule=vehicule,
        date_debut=date_debut,
        date_fin=date_fin,
        montant=calculer_montant(vehicule, date_debut, date_fin)
    )
    location.full_clean()
    location.save()

    statut_service.recalcul(location)
    return location


@transaction.atomic
def modifier_location(location, date_debut, date_fin):
    if location.statut != Location.Statut.RESERVEE :
        raise RegleMetierError(
            f"Cette location ne peut plus être modifiée : son statut actuel est « {location.statut} ».",
            status_code=423
        )

    verifier_date_debut_non_passee(date_debut)
    verifier_disponibilite(location.vehicule, date_debut, date_fin, exclure_location=location)

    location.date_debut = date_debut
    location.date_fin = date_fin
    location.montant = calculer_montant(location.vehicule, date_debut, date_fin)
    location.full_clean()
    location.save()

    statut_service.recalcul(location)
    return location


@transaction.atomic
def annuler_location(location, today=None):
    today = today or date.today()

    if location.statut in (Location.Statut.TERMINEE, Location.Statut.ANNULEE) :
        raise RegleMetierError(
            f"Cette location ne peut pas être annulée : son statut actuel est déjà « {location.statut} »",
            status_code=423
        )

    if today >= location.date_debut :
        raise RegleMetierError(
            "Cette locatio ne peut plus être annulée : sa date de début est aujourd'hui ou déjà passée.",
            status_code=423
        )

    location.statut = Location.Statut.ANNULEE
    location.save(update_fields= ['statut'])

    statut_service.recalcul_statut_vehicule(location.vehicule, today)
    return location


def supprimer_vehicule_proprement(vehicule):
    if vehicule.locations.exists() :
        raise RegleMetierError(
            "Impossible de supprimer ce véhicule : il est lié à une ou plusieurs locations. Annulez ou supprimez d'abord ces locations.",
            status_code=409
        )
    vehicule.delete()


def supprimer_client_proprement(client):
    if client.locations.exists():
        raise RegleMetierError(
            "Impossible de supprimer ce client : il est lié à une ou plusieurs locations. Annulez ou supprimez d'abord ces locations.",
            status_code=409
        )
    client.delete()