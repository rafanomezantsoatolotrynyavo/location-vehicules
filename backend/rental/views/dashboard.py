from rest_framework.response import Response
from rest_framework.views import APIView

from rental.services import dashboard_service


class DashboardView(APIView):
    def get(self, request):
        data = dashboard_service.obtenir_donnees_dashboard()
        return Response(data)