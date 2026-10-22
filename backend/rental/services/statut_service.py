from datetime import date
from django.db import transaction
from rental.models import Vehicule, Location


def recalcul_statut_location(location, today=None) :
    today = today or date.today()

    if location.statut not in (Location.Statut.RESERVEE, Location.Statut.EN_COURS) :
        return location

    if today > location.date_fin :
        new_statut = Location.Statut.TERMINEE
    elif today >= location.date_debut :
        new_statut = Location.Statut.EN_COURS
    else :
        new_statut = Location.Statut.RESERVEE

    if new_statut != location.statut :
        location.statut = new_statut
        location.save(update_fields=["statut"])

    return location


def recalcul_statut_vehicule(vehicule, today=None) :
    today = today or date.today()

    is_loue = vehicule.locations.filter(statut=Location.Statut.EN_COURS).exists()
    is_reserve = vehicule.locations.filter(statut=Location.Statut.RESERVEE,date_fin__gte=today).exists()

    if vehicule.statut == Vehicule.Statut.EN_MAINTENANCE :
        new_statut = Vehicule.Statut.EN_MAINTENANCE
    elif is_loue :
        new_statut = Vehicule.Statut.LOUE
    elif is_reserve :
        new_statut = Vehicule.Statut.RESERVE
    else :
        new_statut = Vehicule.Statut.DISPONIBLE

    if new_statut != vehicule.statut :
        vehicule.statut = new_statut
        vehicule.save(update_fields=["statut"])

    return vehicule


@transaction.atomic
def recalcul(location, today=None) :
    recalcul_statut_location(location, today)
    recalcul_statut_vehicule(location.vehicule, today)
    return location


@transaction.atomic
def recalcul_all(today=None) :
    today = today or date.today()

    for location in Location.objects.filter(
        statut__in = [Location.Statut.RESERVEE, Location.Statut.EN_COURS]
    ) :
        recalcul_statut_location(location, today)

    for vehicule in Vehicule.objects.all() :
        recalcul_statut_vehicule(vehicule, today)