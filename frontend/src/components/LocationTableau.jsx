import { formaterDate } from "../utils/dates";


function LocationTableau({
    locations,
    locationSelectionnee,
    onSelectionner,
    onAnnuler,
    onSupprimer
}) {
    if (locations.length === 0) {
        return <p className="tableau-vide">Aucune location enregistrée.</p>;
    }

    const aujourdHui = new Date().toISOString().slice(0, 10);

    return (
        <div className="tableau-conteneur">
            <table className="tableau tableau--locations">
                <thead>
                    <tr>
                        <th>Client</th>
                        <th>Véhicule</th>
                        <th>Date début</th>
                        <th>Date fin</th>
                        <th>Statut</th>
                        <th>Montant (Ar)</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {locations.map((location) => {
                        const estSelectionnee = locationSelectionnee?.id_location === location.id_location;
                        const peutAnnuler =!["Terminée", "Annulée"].includes(location.statut) && location.date_debut > aujourdHui;
                        const peutSupprimer = location.statut === "Annulée";

                        return (
                            <tr
                                key={location.id_location}
                                className={estSelectionnee ? "tableau-ligne tableau-ligne--selectionnee" : "tableau-ligne"}
                                onClick={() => onSelectionner(location)}
                            >
                                <td data-etiquette="Client">
                                    {location.client_nom} {location.client_prenom}
                                </td>
                                <td data-etiquette="Véhicule">
                                    {location.vehicule_immatriculation} — {location.vehicule_marque} {location.vehicule_modele}
                                </td>
                                <td data-etiquette="Date début">{formaterDate(location.date_debut)}</td>
                                <td data-etiquette="Date fin">{formaterDate(location.date_fin)}</td>
                                <td data-etiquette="Statut">
                                    <span className={`badge badge--${location.statut.replace(" ", "-")}`}>
                                        {location.statut}
                                    </span>
                                </td>
                                <td data-etiquette="Montant (Ar)">{location.montant.toLocaleString("fr-FR")}</td>
                                <td data-etiquette="" className="tableau-actions">
                                    {peutAnnuler && (
                                        <button
                                            type="button"
                                            className="bouton bouton--attention"
                                            onClick={(evenement) => {
                                            evenement.stopPropagation();
                                            onAnnuler(location);
                                            }}
                                        >
                                            Annuler
                                        </button>
                                    )}
                                    {peutSupprimer && (
                                        <button
                                            type="button"
                                            className="bouton bouton--danger"
                                            onClick={(evenement) => {
                                            evenement.stopPropagation();
                                            onSupprimer(location);
                                            }}
                                        >
                                            Supprimer
                                        </button>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default LocationTableau;