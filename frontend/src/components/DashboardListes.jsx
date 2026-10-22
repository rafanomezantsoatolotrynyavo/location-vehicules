function DashboardListes({ retoursAVenir, dernieresLocations }) {
    return (
        <div className="dashboard-listes">
            <div className="dashboard-bloc">
                <h3>Retours prévus (3 prochains jours)</h3>
                {retoursAVenir.length === 0 ? (
                    <p className="tableau-vide">Aucun retour prévu dans les 3 prochains jours.</p>
                ) : (
                    <ul className="liste-compacte">
                        {retoursAVenir.map((location) => (
                            <li key={location.id_location}>
                                <span className="liste-compacte-principal">
                                    {location.vehicule_immatriculation} — {location.vehicule_marque}{" "}
                                    {location.vehicule_modele}
                                </span>
                                <span className="liste-compacte-detail">
                                    Retour le {location.date_fin} · {location.client_nom} {location.client_prenom}
                              </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="dashboard-bloc">
                <h3>5 dernières locations</h3>
                {dernieresLocations.length === 0 ? (
                    <p className="tableau-vide">Aucune location enregistrée.</p>
                ) : (
                    <ul className="liste-compacte">
                        {dernieresLocations.map((location) => (
                            <li key={location.id_location}>
                                <span className="liste-compacte-principal">
                                    {location.client_nom} {location.client_prenom} — {location.vehicule_immatriculation}
                                </span>
                                <span className="liste-compacte-detail">
                                    {location.date_debut} au {location.date_fin} ·{" "}
                                    <span className={`badge badge--${location.statut.replace(" ", "-")}`}>
                                        {location.statut}
                                    </span>
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default DashboardListes;