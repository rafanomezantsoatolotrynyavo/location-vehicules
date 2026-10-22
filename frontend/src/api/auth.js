import api from "./axios";

export function connexion(nomUtilisateur, motDePasse) {
  return api
    .post("auth/connexion/", { nom_utilisateur: nomUtilisateur, mot_de_passe: motDePasse })
    .then((reponse) => reponse.data);
}

export function deconnexion() {
  return api.post("auth/deconnexion/");
}

export function obtenirCompte() {
  return api.get("auth/compte/").then((reponse) => reponse.data);
}

export function modifierCompte(donnees) {
  return api.patch("auth/compte/", donnees).then((reponse) => reponse.data);
}

export function changerMotDePasse(ancienMotDePasse, nouveauMotDePasse) {
  return api
    .post("auth/changer-mot-de-passe/", {
      ancien_mot_de_passe: ancienMotDePasse,
      nouveau_mot_de_passe: nouveauMotDePasse,
    })
    .then((reponse) => reponse.data);
}