import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Crée le superutilisateur depuis les variables d'environnement, si absent."

    def handle(self, *args, **options):
        nom_utilisateur = os.getenv("DJANGO_SUPERUSER_USERNAME")
        mot_de_passe = os.getenv("DJANGO_SUPERUSER_PASSWORD")
        email = os.getenv("DJANGO_SUPERUSER_EMAIL", "")

        if not nom_utilisateur or not mot_de_passe:
            self.stdout.write("Variables DJANGO_SUPERUSER_* absentes, rien à faire.")
            return

        User = get_user_model()
        if User.objects.filter(username=nom_utilisateur).exists():
            self.stdout.write(f"L'utilisateur « {nom_utilisateur} » existe déjà.")
            return

        User.objects.create_superuser(nom_utilisateur, email, mot_de_passe)
        self.stdout.write(self.style.SUCCESS(f"Superutilisateur « {nom_utilisateur} » créé."))