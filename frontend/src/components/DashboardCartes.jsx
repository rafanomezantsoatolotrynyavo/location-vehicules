function DashboardCartes({ cartes }) {
    const items = [
        { libelle: "Véhicules", valeur: cartes.nb_vehicules },
        { libelle: "Clients", valeur: cartes.nb_clients },
        { libelle: "Locations en cours", valeur: cartes.nb_location_en_cours },
        {
            libelle: "Chiffre d'affaires",
            valeur: `${cartes.chiffre_affaires.toLocaleString("fr-FR")} Ar`,
        },
    ];

    return (
        <div className="dashboard-cartes">
            {items.map((item) => (
                <div key={item.libelle} className="carte">
                    <p className="carte-libelle">{item.libelle}</p>
                    <p className="carte-valeur">{item.valeur}</p>
                </div>
            ))}
        </div>
    );
}

export default DashboardCartes;