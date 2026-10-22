from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response

from rental.exceptions import RegleMetierError
from rental.models import Vehicule
from rental.serializers.vehicule import VehiculeSerializer
from rental.services import export_import_service, location_service, statut_service


CHAMPS_VERROUILLES = ["immatriculation", "marque", "modele", "type"]


class VehiculeViewSet(viewsets.ModelViewSet):
    queryset = Vehicule.objects.all()
    serializer_class = VehiculeSerializer

    def list(self, request, *args, **kwargs):
        statut_service.recalcul_all()
        return super().list(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        _verifier_champs_non_verrouilles(instance, request.data)
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        _verifier_champs_non_verrouilles(instance, request.data)
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        vehicule = self.get_object()
        location_service.supprimer_vehicule_proprement(vehicule)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=["get"], url_path="export/json")
    def export_json(self, request):
        return Response(export_import_service.exporter_vehicules_json())

    @action(detail=False, methods=["get"], url_path="export/csv")
    def export_csv(self, request):
        data = export_import_service.exporter_vehicules_csv()
        reponse = Response(data, content_type="text/csv; charset=utf-8")
        reponse["Content-Disposition"] = 'attachment; filename="vehicules.csv"'
        return reponse

    @action(detail=False, methods=["post"], url_path="import/json")
    def import_json(self, request):
        data = request.data.get("fichier")
        if data is None :
            raise RegleMetierError("Aucun fichier reçu.")
        data_str = data.read().decode("utf-8")
        result = export_import_service.importer_vehicules_json(data_str)
        return Response(result)

    @action(detail=False, methods=["post"], url_path="import/csv", parser_classes=[MultiPartParser])
    def import_csv(self, request):
        data = request.data.get("fichier")
        if data is None :
            raise RegleMetierError("Aucun fichier reçu.")
        data_str = data.read().decode("utf-8")
        result = export_import_service.importer_vehicules_csv(data_str)
        return Response(result)


def _verifier_champs_non_verrouilles(instance, sent_data):
    for champ in CHAMPS_VERROUILLES:
        if champ not in sent_data:
            continue
        sent_value = str(sent_data[champ])
        current_value = str(getattr(instance, champ))
        if sent_value != current_value:
            raise RegleMetierError(
                f"Le champ « {champ} » ne peut pas être modifié après la création.",
                status_code=423
            )