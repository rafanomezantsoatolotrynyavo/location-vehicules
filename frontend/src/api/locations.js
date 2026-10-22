import api from "./axios";

export function listerLocations() {
    return api.get("locations/").then((reponse) => reponse.data);
}

export function creerLocation(donnees) {
    return api.post("locations/", donnees).then((reponse) => reponse.data);
}

export function modifierLocation(idLocation, donnees) {
    return api.patch(`locations/${idLocation}/`, donnees).then((reponse) => reponse.data);
}

export function supprimerLocation(idLocation) {
    return api.delete(`locations/${idLocation}/`);
}

export function annulerLocation(idLocation) {
    return api.post(`locations/${idLocation}/annuler/`).then((reponse) => reponse.data);
}

export function exporterLocationsJson() {
    return api.get("locations/export/json/").then((reponse) => reponse.data);
}

export function exporterLocationsCsv() {
    return api.get("locations/export/csv/", { responseType: "blob" }).then((reponse) => reponse.data);
}

export function importerLocationsJson(fichier) {
    const formulaire = new FormData();
    formulaire.append("fichier", fichier);
    return api.post(
        "locations/import/json/", formulaire, {
            headers: { "Content-Type": "multipart/form-data" },
        }
    ).then((reponse) => reponse.data);
}

export function importerLocationsCsv(fichier) {
    const formulaire = new FormData();
    formulaire.append("fichier", fichier);
    return api.post(
        "locations/import/csv/", formulaire, {
            headers: { "Content-Type": "multipart/form-data" },
        }
    ).then((reponse) => reponse.data);
}