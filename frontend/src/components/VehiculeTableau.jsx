function VehiculeTableau({ vehicules, vehiculeSelectionne, onSelectionner, onSupprimer}) {
    if (vehicules.length === 0) {
        return <p className="tableau-vide">
            Aucun véhicules enregistré.
        </p>;
    }

    return (
        <div className="tableau-conteneur">
            <table className="tableau tableau--vehicules">
                <thead>
                    <tr>
                        <th>Immatriculation</th>
                        <th>Marque</th>
                        <th>Modèle</th>
                        <th>Type</th>
                        <th>Prix/jour (Ar)</th>
                        <th>Statut</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {vehicules.map((vehicule) => {
                        const isSelect = vehiculeSelectionne?.id_vehicule === vehicule.id_vehicule;

                        return (
                            <tr
                                key={vehicule.id_vehicule}
                                className={isSelect ? "tableau-ligne tableau-ligne--selectionne" : "tableau-ligne"}
                                onClick={() => onSelectionner(vehicule)}
                            >
                                <td data-etiquette="Immatriculation">{vehicule.immatriculation}</td>
                                <td data-etiquette="Marque">{vehicule.marque}</td>
                                <td data-etiquette="Modèle">{vehicule.modele}</td>
                                <td data-etiquette="Type">{vehicule.type}</td>
                                <td data-etiquette="Prix/jour (Ar)">{vehicule.prix_jour.toLocaleString("fr-FR")}</td>
                                <td data-etiquette="Statut">
                                    <span className={`badge badge--${vehicule.statut.replace(" ", "-")}`}>
                                        {vehicule.statut}
                                    </span>
                                </td>
                                <td data-etiquette="">
                                    <button
                                        type="button"
                                        className="bouton bouton--danger"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            onSupprimer(vehicule);
                                        }}
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default VehiculeTableau;