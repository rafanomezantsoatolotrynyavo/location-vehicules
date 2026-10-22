import { useEffect, useState } from "react";

const VALEURS_VIDES = {
    id_client: "",
    id_vehicule: "",
    date_debut: "",
    date_fin: "",
};

function LocationFormulaire({
    locationSelectionnee,
    clients,
    vehicules,
    onValider,
    onReinitialiser
}) {
    const [valeurs, setValeurs] = useState(VALEURS_VIDES);
    const modeModification = locationSelectionnee !== null;
    const peutModifier = !modeModification || locationSelectionnee.statut === "Réservée";

    useEffect(() => {
        setValeurs(
        locationSelectionnee
            ? {
                id_client: locationSelectionnee.id_client,
                id_vehicule: locationSelectionnee.id_vehicule,
                date_debut: locationSelectionnee.date_debut,
                date_fin: locationSelectionnee.date_fin,
            }
            : VALEURS_VIDES
        );
    }, [locationSelectionnee]);

    function gererChangement(evenement) {
        const { name, value } = evenement.target;
        setValeurs((precedent) => ({ ...precedent, [name]: value }));
    }

    function gererEnvoi(evenement) {
        evenement.preventDefault();
        onValider(valeurs, modeModification);
    }

    const vehiculesProposes = vehicules.filter(
        (vehicule) =>
        vehicule.statut !== "En maintenance" ||
        (modeModification && vehicule.id_vehicule === locationSelectionnee.id_vehicule)
    );
    const erreurDates =
    valeurs.date_debut !== "" && valeurs.date_fin !== "" && valeurs.date_fin < valeurs.date_debut;

    return (
        <form className="formulaire" onSubmit={gererEnvoi} autoComplete="off">
            {modeModification && !peutModifier && (
                <p className="formulaire-message-verrouille">
                    Cette location ne peut plus être modifiée : son statut actuel est « {locationSelectionnee.statut} ».
                </p>
            )}

            <div className="formulaire-champ">
                <label htmlFor="id_client">Client</label>
                <select
                    id="id_client"
                    name="id_client"
                    value={valeurs.id_client}
                    onChange={gererChangement}
                    required
                    disabled={modeModification}
                >
                    <option value="" disabled>
                        Sélectionner un client
                    </option>
                    {clients.map((client) => (
                        <option key={client.id_client} value={client.id_client}>
                            {client.nom} {client.prenom}
                        </option>
                    ))}
                </select>
            </div>

            <div className="formulaire-champ">
                <label htmlFor="id_vehicule">Véhicule</label>
                <select
                    id="id_vehicule"
                    name="id_vehicule"
                    value={valeurs.id_vehicule}
                    onChange={gererChangement}
                    required
                    disabled={modeModification}
                >
                    <option value="" disabled>
                        Sélectionner un véhicule
                    </option>
                    {vehiculesProposes.map((vehicule) => (
                        <option key={vehicule.id_vehicule} value={vehicule.id_vehicule}>
                            {vehicule.immatriculation} — {vehicule.marque} {vehicule.modele}
                        </option>
                    ))}
                </select>
            </div>

            <div className="formulaire-champ">
                <label htmlFor="date_debut">Date de début</label>
                <input
                    id="date_debut"
                    name="date_debut"
                    type="date"
                    value={valeurs.date_debut}
                    onChange={gererChangement}
                    required
                    disabled={!peutModifier}
                />
            </div>

            <div className="formulaire-champ">
                <label htmlFor="date_fin">Date de fin</label>
                <input
                    id="date_fin"
                    name="date_fin"
                    type="date"
                    value={valeurs.date_fin}
                    onChange={gererChangement}
                    required
                    disabled={!peutModifier}
                    className={erreurDates ? "champ-invalide" : ""}
                />
                {erreurDates && <p className="champ-erreur">La date de fin doit être postérieure à la date de début.</p>}
            </div>

            {modeModification && (
                <>
                    <div className="formulaire-champ">
                        <label>Statut</label>
                        <input value={locationSelectionnee.statut} disabled />
                    </div>
                    <div className="formulaire-champ">
                        <label>Montant (Ar)</label>
                        <input value={locationSelectionnee.montant.toLocaleString("fr-FR")} disabled />
                    </div>
                </>
            )}

            <div className="formulaire-actions">
                {peutModifier && (
                    <button type="submit" className="bouton bouton--principal" disabled={erreurDates}>
                        {modeModification ? "Modifier" : "Ajouter"}
                    </button>
                )}
                <button type="button" className="bouton" onClick={onReinitialiser}>
                    Réinitialiser
                </button>
            </div>
        </form>
    );
}

export default LocationFormulaire;