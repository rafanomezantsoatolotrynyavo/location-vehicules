import api from "./axios";


export function listerClients() {
    return api.get("clients/").then((reponse) => reponse.data);
}

export function creerClient(donnees) {
    return api.post("clients/", donnees).then((reponse) => reponse.data);
}

export function modifierClient(idClient, donnees) {
    return api.patch(`clients/${idClient}/`, donnees).then((reponse) => reponse.data);
}

export function supprimerClient(idClient) {
    return api.delete(`clients/${idClient}/`);
}

export function exporterClientsJson() {
    return api.get("clients/export/json/").then((reponse) => reponse.data);
}

export function exporterClientsCsv() {
    return api.get("clients/export/csv/", { responseType: "blob" }).then((reponse) => reponse.data);
}

export function importerClientsJson(fichier) {
    const formulaire = new FormData();
    formulaire.append("fichier", fichier);
    return api.post(
        "clients/import/json/",
        formulaire,
        {headers: {"Content-Type": "multipart/form-data"}}
    ).then((reponse) => reponse.data);
}

export function importerClientsCsv(fichier) {
    const formulaire = new FormData();
    formulaire.append("fichier", fichier);
    return api.post(
        "clients/import/csv/",
        formulaire,
        {headers: {"Content-Type": "multipart/form-data"}}
    ).then((reponse) => reponse.data);
}