from decimal import Decimal

from django.core.validators import MinValueValidator
from django.db import models

from rental.validators import normaliser_immatriculation, valider_immatriculation


class Vehicule(models.Model):
    class Type(models.TextChoices):
        BERLINE = "Berline", "Berline"
        QUATRE_X_QUATRE = "4x4", "4x4"
        CITADINE = "Citadine", "Citadine"
        UTILITAIRE = "Utilitaire", "Utilitaire"
        MINIBUS = "Minibus", "Minibus"
        MOTO = "Moto", "Moto"

    class Statut(models.TextChoices):
        DISPONIBLE = "Disponible", "Disponible"
        RESERVE = "Réservé", "Réservé"
        LOUE = "Loué", "Loué"
        EN_MAINTENANCE = "En maintenance", "En maintenance"

    id_vehicule = models.AutoField(primary_key=True)
    immatriculation = models.CharField(max_length=15, unique=True, validators=[valider_immatriculation])
    marque = models.CharField(max_length=50)
    modele = models.CharField("modèle", max_length=50)
    type = models.CharField(max_length=20, choices=Type.choices)
    prix_jour = models.DecimalField("prix par jour (Ar)", max_digits=12, decimal_places=2, validators=[MinValueValidator(Decimal("0.01"))],)
    statut = models.CharField(max_length=20, choices=Statut.choices, default=Statut.DISPONIBLE)

    class Meta:
        ordering = ["id_vehicule"]

    def save(self, *args, **kwargs):
        self.immatriculation = normaliser_immatriculation(self.immatriculation)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.marque} {self.modele} ({self.immatriculation})"