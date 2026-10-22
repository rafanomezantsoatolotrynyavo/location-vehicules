from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from rental.serializers.auth import (
    ChangerMotDePasseSerializer,
    CompteSerializer,
    ConnexionSerializer,
)


class ConnexionView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ConnexionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        utilisateur = serializer.validated_data["utilisateur"]

        jeton, _ = Token.objects.get_or_create(user=utilisateur)
        return Response(
            {
                "jeton": jeton.key,
                "nom_utilisateur": utilisateur.username,
                "email": utilisateur.email,
            }
        )


class DeconnexionView(APIView):
    def post(self, request):
        request.user.auth_token.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CompteView(APIView):
    def get(self, request):
        return Response(CompteSerializer(request.user).data)

    def patch(self, request):
        serializer = CompteSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class ChangerMotDePasseView(APIView):
    def post(self, request):
        serializer = ChangerMotDePasseSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        Token.objects.filter(user=request.user).delete()
        jeton = Token.objects.create(user=request.user)
        return Response({"jeton": jeton.key})