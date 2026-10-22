# ========================= Gestion des erreurs du projet =========================
from rest_framework.views import exception_handler


class RegleMetierError(Exception) :
    def __init__(self, message, status_code=400) :
        self.message = message
        self.status_code = status_code
        super().__init__(message)


def gestionnaire_exceptions(exc, context) :
    if isinstance(exc, RegleMetierError) :
        from rest_framework.response import Response
        return Response({"detail":exc.message}, status=exc.status_code)

    return exception_handler(exc, context)