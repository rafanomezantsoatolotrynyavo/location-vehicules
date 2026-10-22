from rest_framework import serializers

from rental.models import Etranger, Malgache
from rental.validators import valider_nom, valider_telephone, valider_cin, valider_passeport


class ClientSerializer(serializers.Serializer) :
    id_client = serializers.IntegerField(read_only=True)
    nom = serializers.CharField(max_length=100, validators=[valider_nom])
    prenom = serializers.CharField(max_length=100, validators=[valider_nom])
    telephone = serializers.CharField(max_length=20, validators=[valider_telephone])
    email = serializers.EmailField(max_length=254)
    adresse = serializers.CharField(max_length=255)

    type_client = serializers.ChoiceField(choices=["Malgache", "Etranger"])
    num_cin = serializers.CharField(max_length=12, required=False, allow_blank=True, validators=[valider_cin])
    num_passeport = serializers.CharField(max_length=20, required=False, allow_blank=True, validators=[valider_passeport])

    def to_representation(self, instance):
        data = {
            "id_client": instance.id_client,
            "nom": instance.nom,
            "prenom": instance.prenom,
            "telephone": instance.telephone,
            "email": instance.email,
            "adresse": instance.adresse,
        }

        malgache = getattr(instance, "malgache", None)
        etranger = getattr(instance, "etranger", None)

        if malgache is not None:
            data["type_client"] = "Malgache"
            data["num_cin"] = malgache.num_cin
            data["num_passeport"] = None
        elif etranger is not None:
            data["type_client"] = "Etranger"
            data["num_cin"] = None
            data["num_passeport"] = etranger.num_passeport
        else:
            data["type_client"] = None
            data["num_cin"] = None
            data["num_passeport"] = None

        return data


    def validate(self, attrs):
        type_client = attrs.get("type_client")
        num_cin = attrs.get("num_cin")
        num_passeport = attrs.get("num_passeport")
        id_client_actuel = getattr(self.instance, "pk", None)

        if type_client == "Malgache" :
            if not num_cin:
                raise serializers.ValidationError({
                    "num_cin": "Le numéro de CIN est obligatoire pour un client malgache."
                })
            deja_pris = Malgache.objects.filter(num_cin=num_cin).exclude(client_ptr_id=id_client_actuel).exists()
            if deja_pris:
                raise serializers.ValidationError({
                    "num_cin": "Ce numéro de CIN est déjà utilisé par un autre client."
                })
        elif type_client == "Etranger":
            if not num_passeport:
                raise serializers.ValidationError({
                    "num_passeport": "Le numéro de passeport est obligatoire pour un client étranger."
                })
            deja_pris = Etranger.objects.filter(num_passeport=num_passeport).exclude(client_ptr_id=id_client_actuel).exists()
            if deja_pris:
                raise serializers.ValidationError({
                    "num_passeport": "Ce numéro de passeport est déjà utilisé par un autre client."
                })
        return attrs


    def create(self, validated_data) :
        champs_communs = {
            "nom": validated_data["nom"],
            "prenom": validated_data["prenom"],
            "telephone": validated_data["telephone"],
            "email": validated_data["email"],
            "adresse": validated_data["adresse"],
        }

        if validated_data["type_client"] == "Malgache" :
            return Malgache.objects.create(**champs_communs, num_cin=validated_data["num_cin"])

        return Etranger.objects.create(**champs_communs, num_passeport=validated_data["num_passeport"])


    def update(self, instance, validated_data):
        for champ in ("nom", "prenom", "telephone", "email", "adresse") :
            if champ in validated_data :
                setattr(instance, champ, validated_data[champ])

        if isinstance(instance, Malgache) and "num_cin" in validated_data :
            instance.num_cin = validated_data["num_cin"]

        if isinstance(instance, Etranger) and "num_passeport" in validated_data :
            instance.num_passeport = validated_data["num_passeport"]

        instance.save()

        return instance