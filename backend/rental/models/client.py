from django.db import models

from rental.validators import (
    normaliser_cin,
    normaliser_passeport,
    normaliser_telephone,
    valider_cin,
    valider_nom,
    valider_passeport,
    valider_telephone,
)


class Client(models.Model):
    id_client = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=100, validators=[valider_nom])
    prenom = models.CharField("prénom", max_length=100, validators=[valider_nom])
    telephone = models.CharField(max_length=20, validators=[valider_telephone])
    email = models.EmailField(max_length=254)
    adresse = models.CharField(max_length=255)

    class Meta:
        ordering = ["nom", "prenom"]

    def save(self, *args, **kwargs):
        self.telephone = normaliser_telephone(self.telephone)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.prenom} {self.nom}"


class Malgache(Client):
    id_malgache = models.AutoField(primary_key=True)
    client_ptr = models.OneToOneField(
        Client, on_delete=models.CASCADE, parent_link=True
    )
    num_cin = models.CharField(
        "numéro de CIN", max_length=12, unique=True, validators=[valider_cin]
    )

    class Meta:
        verbose_name = "client malgache"
        verbose_name_plural = "clients malgaches"

    def save(self, *args, **kwargs):
        self.num_cin = normaliser_cin(self.num_cin)
        super().save(*args, **kwargs)


class Etranger(Client):
    id_etranger = models.AutoField(primary_key=True)
    client_ptr = models.OneToOneField(
        Client, on_delete=models.CASCADE, parent_link=True
    )
    num_passeport = models.CharField(
        "numéro de passeport",
        max_length=20,
        unique=True,
        validators=[valider_passeport],
    )

    class Meta:
        verbose_name = "client étranger"
        verbose_name_plural = "clients étrangers"

    def save(self, *args, **kwargs):
        self.num_passeport = normaliser_passeport(self.num_passeport)
        super().save(*args, **kwargs)