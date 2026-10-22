from rest_framework import serializers

from rental.models import Client, Vehicule, Location


class LocationSerializer(serializers.ModelSerializer) :
    id_client = serializers.PrimaryKeyRelatedField(source="client", queryset=Client.objects.all())
    id_vehicule = serializers.PrimaryKeyRelatedField(source="vehicule", queryset=Vehicule.objects.all())

    client_nom = serializers.CharField(source="client.nom", read_only=True)
    client_prenom = serializers.CharField(source="client.prenom", read_only=True)

    vehicule_immatriculation = serializers.CharField(source="vehicule.immatriculation", read_only=True)
    vehicule_marque = serializers.CharField(source="vehicule.marque", read_only=True)
    vehicule_modele = serializers.CharField(source="vehicule.modele", read_only=True)


    class Meta :
        model = Location
        fields = [
            "id_location",
            "id_client",
            "id_vehicule",
            "client_nom",
            "client_prenom",
            "vehicule_immatriculation",
            "vehicule_marque",
            "vehicule_modele",
            "date_debut",
            "date_fin",
            "statut",
            "montant",
        ]
        read_only_fields = ["id_location", "statut"]


    def validate(self, attrs):
        date_debut = attrs.get("date_debut", getattr(self.instance, "date_debut", None))
        date_fin = attrs.get("date_fin", getattr(self.instance, "date_fin", None))

        if date_debut and date_fin and date_fin < date_debut :
            raise serializers.ValidationError({
                "date_fin": "La date de fin doit être postérieur ou égale à la date de début."
            })

        return attrs