import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { obtenirDonneesDashboard } from "../api/dashboard";
import DashboardCartes from "../components/DashboardCartes.jsx";
import DashboardGraphique from "../components/DashboardGraphique.jsx";
import DashboardListes from "../components/DashboardListes.jsx";
import Spinner from "../components/Spinner.jsx";


function DashboardPage() {
    const [donnees, setDonnees] = useState(null);
    const [chargement, setChargement] = useState(true);

    useEffect(() => {
        obtenirDonneesDashboard()
        .then((resultat) => setDonnees(resultat))
        .catch(() => toast.error("Impossible de charger le tableau de bord."))
        .finally(() => setChargement(false));
    }, []);

    if (chargement) {
        return <Spinner />;
    }

    if (!donnees) {
        return <p>Le tableau de bord n'a pas pu être chargé.</p>;
    }

    return (
        <div>
            <h2>Dashboard</h2>

            <DashboardCartes cartes={donnees.cartes} />
            <DashboardGraphique repartition={donnees.repartition_statuts_vehicules} />
            <DashboardListes
                retoursAVenir={donnees.futur_retours}
                dernieresLocations={donnees.dernieres_locations}
            />
        </div>
    );
}

export default DashboardPage;