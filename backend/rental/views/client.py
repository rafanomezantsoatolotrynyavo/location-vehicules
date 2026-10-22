from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response

from rental.exceptions import RegleMetierError
from rental.models import Client
from rental.serializers.client import ClientSerializer
from rental.services import export_import_service, location_service


CHAMPS_VERROUILLES_COMMUNS = ["nom", "prenom"]


class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        _verifier_champs_non_verrouilles(instance, request.data)
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        _verifier_champs_non_verrouilles(instance, request.data)
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        client = self.get_object()
        location_service.supprimer_client_proprement(client)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=["get"], url_path="export/json")
    def export_json(self, request):
        return Response(export_import_service.exporter_clients_json())

    @action(detail=False, methods=["get"], url_path="export/csv")
    def export_csv(self, request):
        data = export_import_service.exporter_clients_csv()
        reponse = Response(data, content_type="text/csv; charset=utf-8")
        reponse["Content-Disposition"] = 'attachment; filename="clients.csv"'
        return reponse

    @action(detail=False, methods=["post"], url_path="import/json")
    def import_json(self, request):
        data = request.data.get("fichier")
        if data is None:
            raise RegleMetierError("Aucun fichier reçu.")
        data_str = data.read().decode("utf-8")
        result = export_import_service.importer_clients_json(data_str)
        return Response(result)

    @action(detail=False, methods=["post"], url_path="import/csv", parser_classes=[MultiPartParser])
    def import_csv(self, request):
        data = request.data.get("fichier")
        if data is None :
            raise RegleMetierError("Aucun fichier reçu.")
        data_str = data.read().decode("utf-8")
        result = export_import_service.importer_clients_csv(data_str)
        return Response(result)

def _verifier_champs_non_verrouilles(instance, sent_data):
    champs_a_verifier = list(CHAMPS_VERROUILLES_COMMUNS)

    malgache = getattr(instance, "malgache", None)
    etranger = getattr(instance, "etranger", None)
    if malgache is not None :
        champs_a_verifier.append("num_cin")
    elif etranger is not None :
        champs_a_verifier.append("num_passeport")

    for champ in champs_a_verifier:
        if champ not in sent_data:
            continue
        sent_value = str(sent_data[champ])
        current_value = str(
            getattr(malgache or etranger or instance, champ, getattr(instance, champ, ""))
        )
        if sent_value != current_value :
            raise RegleMetierError(
                f"Le champ « {champ} » ne peut pas être modifié après la création.",
                status_code=423,
            )