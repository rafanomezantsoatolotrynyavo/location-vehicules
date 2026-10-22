from django.db import models
from django.db.models import F, Q

from .client import Client
from .vehicule import Vehicule


class Location(models.Model):
    class Statut(models.TextChoices):
        RESERVEE = "Réservée", "Réservée"
        EN_COURS = "En cours", "En cours"
        TERMINEE = "Terminée", "Terminée"
        ANNULEE = "Annulée", "Annulée"

    id_location = models.AutoField(primary_key=True)
    client = models.ForeignKey(Client, on_delete=models.PROTECT, related_name="locations")
    vehicule = models.ForeignKey(Vehicule, on_delete=models.PROTECT, related_name="locations")
    date_debut = models.DateField("date de début")
    date_fin = models.DateField("date de fin")
    statut = models.CharField(max_length=20, choices=Statut.choices, default=Statut.RESERVEE)
    montant = models.DecimalField("montant (Ar)", max_digits=14, decimal_places=2, default=0, editable=False)

    class Meta:
        ordering = ["-date_debut", "-id_location"]
        constraints = [
            models.CheckConstraint(
                condition=Q(date_fin__gte=F("date_debut")),
                name="location_date_fin_apres_debut",
            )
        ]

    def __str__(self):
        return f"Location {self.id_location} : {self.vehicule} du {self.date_debut} au {self.date_fin}"