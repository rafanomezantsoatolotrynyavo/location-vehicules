from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response

from rental.exceptions import RegleMetierError
from rental.models import Location
from rental.serializers.location import LocationSerializer
from rental.services import export_import_service, location_service, statut_service


class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.select_related("client", "vehicule")
    serializer_class = LocationSerializer

    def list(self, request, *args, **kwargs):
        statut_service.recalcul_all()
        return super().list(request, *args, **kwargs)


    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        location = location_service.creer_location(
            client=serializer.validated_data["client"],
            vehicule=serializer.validated_data["vehicule"],
            date_debut=serializer.validated_data["date_debut"],
            date_fin=serializer.validated_data["date_fin"]
        )

        result = self.get_serializer(location)
        return Response(result.data, status=status.HTTP_201_CREATED)


    def update(self, request, *args, **kwargs):
        return self._modifier(request)


    def partial_update(self, request, *args, **kwargs):
        return self._modifier(request)


    def _modifier(self, request):
        instance = self.get_object()
        _verifier_relations_non_modifiees(instance, request.data)

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        new_date_debut = serializer.validated_data.get("date_debut", instance.date_debut)
        new_date_fin = serializer.validated_data.get("date_fin", instance.date_fin)

        location = location_service.modifier_location(instance, new_date_debut, new_date_fin)

        result = self.get_serializer(location)
        return Response(result.data)


    def destroy(self, request, *args, **kwargs):
        location = self.get_object()
        if location.statut != Location.Statut.ANNULEE:
            raise RegleMetierError(
                f"Cette location ne peut pas être supprimée que si elle est annulée. Son statut actuel est « {location.statut} ». Annulez-la d'abord si besoin.", status_code=423
            )

        vehicule = location.vehicule
        location.delete()
        statut_service.recalcul_statut_vehicule(vehicule)
        return Response(status=status.HTTP_204_NO_CONTENT)


    @action(detail=True, methods=["post"])
    def annuler(self, request, pk=None):
        location = self.get_object()
        location = location_service.annuler_location(location)
        return Response(self.get_serializer(location).data)


    @action(detail=False, methods=["get"], url_path="export/json")
    def export_json(self, request):
        return Response(export_import_service.exporter_locations_json())


    @action(detail=False, methods=["get"], url_path="export/csv")
    def export_csv(self, request):
        data = export_import_service.exporter_clients_csv()
        reponse = Response(data, content_type="text/csv; charset=utf-8")
        reponse["Content-Disposition"] = 'attachment; filename="locations.csv"'
        return reponse


    @action(detail=False, methods=["post"], url_path="import/json")
    def import_json(self, request):
        data = request.data.get("fichier")
        if data is None:
            raise RegleMetierError("Aucun fichier reçu.")
        data_str = data.read().decode("utf-8")
        result = export_import_service.importer_locations_json(data_str)
        return Response(result)


    @action(detail=False, methods=["post"], url_path="import/csv", parser_classes=[MultiPartParser])
    def import_csv(self, request):
        data = request.data.get("fichier")
        if data is None:
            raise RegleMetierError("Aucun fichier reçu.")
        data_str = data.read().decode("utf-8")
        result = export_import_service.importer_locations_csv(data_str)
        return Response(result)


def _verifier_relations_non_modifiees(instance, sent_data):
    if "id_client" in sent_data :
        if str(sent_data["id_client"]) != str(instance.client_id):
            raise RegleMetierError(
                "Le client d'une location ne peut pas être modifié.", status_code=423
            )
    if "id_vehicule" in sent_data:
        if str(sent_data["id_vehicule"]) != str(instance.vehicule_id):
            raise RegleMetierError(
                "Le véhicule d'une location ne peut pas être modifié.", status_code=423
            )