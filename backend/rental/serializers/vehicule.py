from rest_framework import serializers

from rental.models import Vehicule


class VehiculeSerializer(serializers.ModelSerializer) :
    class Meta :
        model = Vehicule
        fields = [
            "id_vehicule",
            "immatriculation",
            "marque",
            "modele",
            "type",
            "prix_jour",
            "statut",
        ]
        read_only_fields = ["id_vehicule"]