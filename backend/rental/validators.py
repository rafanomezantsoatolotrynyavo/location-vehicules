import re

from django.core.exceptions import ValidationError


# ========================= Normalisation =========================

def normaliser_telephone(value) :
    # Retirer espaces, points et tirets
    return re.sub(r"[\s.\-]", "", str(value or ""))

def normaliser_cin(value) :
    # Retirer les espaces
    return re.sub(r"\s", "", str(value or ""))

def normaliser_passeport(value) :
    # Retirer les espaces et mettre en majuscules
    return re.sub(r"\s", "", str(value or "")).upper()

def normaliser_immatriculation(value):
    # Mettre en majuscules et un seul espace '1234 TAB'
    texte = re.sub(r"\s+", " ", str(value or "")).strip().upper()
    correspondance = re.fullmatch(r"([0-9]{3,4}) ?([A-Z]{2,3})", texte)
    if correspondance:
        return f"{correspondance.group(1)} {correspondance.group(2)}"
    return texte


# ========================= Validation =========================
_TELEPHONE = re.compile(r"(?:0|\+261)(?:32|33|34|37|38|39)[0-9]{7}") # 0 ou +261, puis un préfixe opérateur, puis 7 chiffres
_CIN = re.compile(r"[0-9]{12}") # 12 chiffres
_PASSEPORT = re.compile(r"[A-Z0-9]{6,20}") # 6 à 20 caractères (majuscule et chiffres)
_IMMATRICULATION = re.compile(r"[0-9]{3,4} [A-Z]{2,3}") # 3 à 4 chiffres + espace + 2 à 3 lettre
_NOM = re.compile(r"[^\W\d_]+(?:[ '’\-][^\W\d_]+)*") # nom et prénom(s)

def valider_telephone(value):
    if not _TELEPHONE.fullmatch(normaliser_telephone(value)):
        raise ValidationError(
            "Numéro de téléphone invalide.",
            code="telephone_invalide",
        )

def valider_cin(value):
    if not _CIN.fullmatch(normaliser_cin(value)):
        raise ValidationError(
            "Le numéro de CIN doit contenir exactement 12 chiffres.",
            code="cin_invalide",
        )

def valider_passeport(value):
    if not _PASSEPORT.fullmatch(normaliser_passeport(value)):
        raise ValidationError(
            "Numéro de passeport invalide : 6 à 20 caractères, lettres et chiffres uniquement.",
            code="passeport_invalide",
        )

def valider_immatriculation(value):
    if not _IMMATRICULATION.fullmatch(normaliser_immatriculation(value)):
        raise ValidationError(
            "Immatriculation invalide.",
            code="immatriculation_invalide",
        )

def valider_nom(value):
    if not _NOM.fullmatch(str(value or "").strip()):
        raise ValidationError(
            "Ce champ ne doit contenir que des lettres, espaces, apostrophes ou tirets.",
            code="nom_invalide",
        )