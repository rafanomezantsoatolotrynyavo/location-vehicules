export function extraireMessageErreur(erreur) {
    const donnees = erreur.response?.data;
    if (donnees?.detail) return donnees.detail;
    if (donnees && typeof donnees === "object") {
        const premierChamp = Object.keys(donnees)[0];
        if (premierChamp) {
            const message = donnees[premierChamp];
            return Array.isArray(message) ? message[0] : String(message);
        }
    }
    return "Une erreur inattendue est survenue.";
}