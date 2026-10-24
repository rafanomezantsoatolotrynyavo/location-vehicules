# 🚗 Gestion de Location de Véhicules

Application de gestion des locations de véhicules, développée avec Django REST Framework et React.

**Démo en ligne :** https://location-vehicules-platform.netlify.app

---

## Fonctionnalités

### Véhicules
- Ajout, modification, suppression, recherche.
- Statuts : Disponible, Réservé, Loué, En maintenance — les trois premiers sont recalculés **automatiquement** à partir des locations en cours ; seule la bascule vers/depuis « En maintenance » est manuelle, et elle est prioritaire sur le calcul automatique.
- Immatriculation, marque, modèle et type verrouillés après création ; seuls le prix/jour et le statut restent modifiables.
- Suppression refusée (avec message clair) si le véhicule est lié à une location.

### Clients
- Deux types, gérés par héritage : **Malgache** (CIN, 12 chiffres, unique) et **Étranger** (numéro de passeport, unique) — le formulaire affiche dynamiquement le bon champ.
- Nom, prénom et identifiant (CIN/passeport) verrouillés après création ; téléphone, email et adresse restent modifiables.
- Suppression refusée si le client est lié à une location.

### Locations
- Création avec calcul automatique du montant (nombre de jours × prix/jour), en lecture seule.
- Disponibilité vérifiée par **chevauchement de périodes** sur les dates demandées, pas par le statut global du véhicule.
- Statuts : Réservée → En cours → Terminée, ou Annulée — recalculés automatiquement à chaque opération et à chaque chargement de liste.
- Modification des dates possible uniquement au statut *Réservée* ; annulation possible uniquement avant la date de début ; suppression physique possible uniquement au statut *Annulée*.

### Dashboard
- Cartes de synthèse (véhicules, clients, locations en cours, chiffre d'affaires).
- Graphique de répartition des véhicules par statut.
- Retours prévus dans les 3 prochains jours, et 5 dernières locations.

### Transverse
- Recherche, pagination et tableaux responsives (aucun scroll horizontal, affichage en cartes sur mobile) dans les 3 modules.
- Export et import des données (JSON et CSV) par module, avec rapport d'erreurs ligne par ligne à l'import.
- Notifications et messages d'erreur en français.
- Page **À propos** : modélisation du projet et présentation de l'auteur.

---

## Authentification : un compte unique

L'application n'a **pas** vocation à gérer plusieurs comptes ni plusieurs rôles : c'est un outil de gestion interne, protégé par un **unique compte administrateur**, qui verrouille l'accès à l'ensemble de l'application (aucune inscription publique). Ce compte se crée :
- en local, avec `python manage.py createsuperuser` ;
- en production, automatiquement au déploiement, à partir des variables d'environnement `DJANGO_SUPERUSER_USERNAME`, `DJANGO_SUPERUSER_PASSWORD` et `DJANGO_SUPERUSER_EMAIL`.

Une fois connecté, ce compte peut modifier son email/nom et son mot de passe depuis la page **Mon compte**. L'authentification repose sur un jeton (Django REST Framework `TokenAuthentication`) : toutes les routes de l'API, hormis la connexion, exigent d'être authentifié.

---

## Stack technique

**Back-end**
- Python, Django, Django REST Framework
- SQLite en développement, PostgreSQL en production (configuration interchangeable via `DATABASE_URL`, sans changement de code)
- `django-cors-headers`, `python-dotenv`, `dj-database-url`

**Front-end**
- React (JavaScript) + Vite
- React Router, Axios
- Recharts (graphique du dashboard)
- react-hot-toast (notifications)

**Hébergement**
- Backend : Render (service web + PostgreSQL)
- Frontend : Netlify

---

## Architecture

Le back-end sépare strictement :
- **models/** — schéma des données (héritage multi-table pour Client/Malgache/Étranger)
- **validators.py** — règles de format (CIN, téléphone, immatriculation...)
- **serializers/** — traduction JSON ⇄ objets, validation d'entrée
- **services/** — logique métier (cycle de vie des statuts, chevauchement, calcul du montant, export/import, dashboard)
- **views/** — réception des requêtes HTTP, sans aucune règle métier propre

Le front-end suit la même logique : les composants d'affichage (formulaires, tableaux) ne parlent jamais directement à l'API — chaque module a sa propre couche `api/*.js`, appelée uniquement depuis les pages.

---