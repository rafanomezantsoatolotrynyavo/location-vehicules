from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers


class ConnexionSerializer(serializers.Serializer):
    nom_utilisateur = serializers.CharField()
    mot_de_passe = serializers.CharField(write_only=True)

    def validate(self, attrs):
        utilisateur = authenticate(
            username=attrs["nom_utilisateur"], password=attrs["mot_de_passe"]
        )
        if utilisateur is None:
            raise serializers.ValidationError(
                {"detail": "Nom d'utilisateur ou mot de passe incorrect."}
            )
        if not utilisateur.is_active:
            raise serializers.ValidationError({"detail": "Ce compte est désactivé."})
        attrs["utilisateur"] = utilisateur
        return attrs


class ChangerMotDePasseSerializer(serializers.Serializer):
    ancien_mot_de_passe = serializers.CharField(write_only=True)
    nouveau_mot_de_passe = serializers.CharField(write_only=True)

    def validate_ancien_mot_de_passe(self, valeur):
        utilisateur = self.context["request"].user
        if not utilisateur.check_password(valeur):
            raise serializers.ValidationError("L'ancien mot de passe est incorrect.")
        return valeur

    def validate_nouveau_mot_de_passe(self, valeur):
        validate_password(valeur, user=self.context["request"].user)
        return valeur

    def save(self):
        utilisateur = self.context["request"].user
        utilisateur.set_password(self.validated_data["nouveau_mot_de_passe"])
        utilisateur.save()
        return utilisateur


class CompteSerializer(serializers.Serializer):
    """Lecture/modification des infos de base du compte (pas le mot de
    passe, géré séparément par ChangerMotDePasseSerializer)."""
    nom_utilisateur = serializers.CharField(source="username", read_only=True)
    email = serializers.EmailField()
    prenom = serializers.CharField(source="first_name", required=False, allow_blank=True)
    nom = serializers.CharField(source="last_name", required=False, allow_blank=True)

    def update(self, instance, validated_data):
        for champ, valeur in validated_data.items():
            setattr(instance, champ, valeur)
        instance.save()
        return instance