import api from "./axios";


export function listerVehicules() {
    return api.get("vehicules/").then((reponse) => reponse.data);
}

export function creerVehicule(donnees) {
    return api.post("vehicules/", donnees).then((reponse) => reponse.data);
}

export function modifierVehicule(idVehicule, donnees) {
    return api.patch(`vehicules/${idVehicule}/`, donnees).then((reponse) => reponse.data);
}

export function supprimerVehicule(idVehicule) {
    return api.delete(`vehicules/${idVehicule}/`);
}

export function exporterVehiculesJson() {
    return api.get("vehicules/export/json/").then((reponse) => reponse.data);
}

export function exporterVehiculesCsv() {
    return api.get("vehicules/export/csv/", { responseType: "blob"}).then((reponse) => reponse.data);
}

export function importerVehiculesJson(fichier) {
    const formulaire = new FormData();
    formulaire.append("fichier", fichier);
    return api.post(
        "vehicules/import/json/", formulaire, {
            headers: { "Content-Type": "multipart/form-data" }
        }).then((reponse) => reponse.data);
}

export function importerVehiculesCsv(fichier) {
    const formulaire = new FormData();
    formulaire.append("fichier", fichier);
    return api.post(
        "vehicules/import/csv/", formulaire, {
            headers: { "Content-Type": "multipart/form-data" }
        }).then((reponse) => reponse.data);
}