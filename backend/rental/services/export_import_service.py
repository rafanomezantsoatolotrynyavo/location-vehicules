import csv
import io
import json
from datetime import date

from rental.exceptions import RegleMetierError
from rental.models import Client, Etranger, Malgache, Vehicule, Location
from rental.serializers.client import ClientSerializer
from rental.serializers.vehicule import VehiculeSerializer
from rental.serializers.location import LocationSerializer
from rental.services import location_service


# ===== Export =====
def exporter_vehicules_json():
    return VehiculeSerializer(Vehicule.objects.all(), many=True).data


def exporter_vehicules_csv():
    entetes = ["immatriculation", "marque", "modele", "type", "prix_jour", "statut"]
    return _lignes_vers_csv(
        entetes, (
            [v.immatriculation, v.marque, v.modele, v.type, v.prix_jour, v.statut]
            for v in Vehicule.objects.all()
        )
    )


def exporter_clients_json():
    return ClientSerializer(Client.objects.all(), many=True).data


def exporter_clients_csv():
    entetes = ["type_client", "nom", "prenom", "telephone", "email", "adresse", "num_cin", "num_passeport"]

    def generer_lignes():
        for client in Client.objects.all():
            donnees = ClientSerializer(client).data
            yield [
                donnees["type_client"],
                donnees["nom"],
                donnees["prenom"],
                donnees["telephone"],
                donnees["email"],
                donnees["adresse"],
                donnees["num_cin"] or "",
                donnees["num_passeport"] or ""
            ]

    return _lignes_vers_csv(entetes, generer_lignes())


def _lignes_vers_csv(entetes, lignes):
    tampon = io.StringIO()
    writer = csv.writer(tampon)
    writer.writerow(entetes)
    for ligne in lignes :
        writer.writerow(ligne)
    return tampon.getvalue()


# ===== Import =====
def importer_vehicules_json(data):
    try:
        lignes = json.loads(data)
    except json.JSONDecodeError :
        raise RegleMetierError("Le fichier n'est pas un JSON valide.")
    return _importer_vehicules(lignes)


def importer_vehicules_csv(data):
    reader = csv.DictReader(io.StringIO(data))
    return _importer_vehicules(list(reader))


def _importer_vehicules(lignes):
    importes, erreurs = 0, []
    for numero, ligne in enumerate(lignes, start=1):
        serializer = VehiculeSerializer(data=ligne)
        if serializer.is_valid():
            serializer.save()
            importes += 1
        else :
            erreurs.append({
                "ligne": numero,
                "erreurs": serializer.errors
            })
    return {"importes": importes, "erreurs": erreurs}


def importer_clients_json(data):
    try:
        lignes = json.loads(data)
    except json.JSONDecodeError:
        raise RegleMetierError("Le fichier n'est pas un JSON valide.")
    return _importer_clients(lignes)


def importer_clients_csv(data):
    reader = csv.DictReader(io.StringIO(data))
    return _importer_clients(list(reader))


def _importer_clients(lignes):
    importes, erreurs = 0, []
    for numero, ligne in enumerate(lignes, start=1):
        serializer = ClientSerializer(data=ligne)
        if serializer.is_valid():
            serializer.save()
            importes += 1
        else:
            erreurs.append({
                "ligne": numero,
                "erreurs": serializer.errors
            })
    return {"importes": importes, "erreurs": erreurs}


# ===== Export : locations =====
def exporter_locations_json() :
    locations = Location.objects.select_related("client", "vehicule")
    return LocationSerializer(locations, many=True).data


def exporter_locations_csv() :
    entetes = ["id_client", "id_vehicules", "date_debut", "date_fin", "statut", "montant"]
    locations = Location.objects.select_related("client", "vehicule")
    return _lignes_vers_csv(
        entetes, (
            [
                loc.client_id,
                loc.vehicule_id,
                loc.date_debut.isoformat(),
                loc.date_fin.isoformat(),
                loc.statut,
                loc.montant
            ]
            for loc in locations
        )
    )


# ===== Import : locations =====
def importer_locations_json(data) :
    try :
        lignes = json.loads(data)
    except json.JSONDecodeError:
        raise RegleMetierError("Le fichier n'est pas un JSON valide.")
    return _importer_locations(lignes)


def importer_locations_csv(data) :
    reader = csv.DictReader(io.StringIO(data))
    return _importer_locations(list(reader))


def _importer_locations(lignes) :
    importes, erreurs = 0, []
    for numero, ligne in enumerate(lignes, start=1):
        donnees = {
            "id_client": ligne.get("id_client"),
            "id_vehicule": ligne.get("id_vehicule"),
            "date_debut": ligne.get("date_debut"),
            "date_fin": ligne.get("date_fin")
        }

        serializer = LocationSerializer(data=donnees)
        if not serializer.is_valid():
            erreurs.append({
                "ligne": numero,
                "erreurs": serializer.errors
            })
            continue

        try :
            location_service.creer_location(
                client=serializer.validated_data["client"],
                vehicule=serializer.validated_data["vehicule"],
                date_debut=serializer.validated_data["date_debut"],
                date_fin=serializer.validated_data["date_fin"]
            )
            importes += 1
        except RegleMetierError as err:
            erreurs.append({
                "ligne": numero,
                "erreurs": {"detail": err.message}
            })

    return {"importes": importes, "erreurs": erreurs}