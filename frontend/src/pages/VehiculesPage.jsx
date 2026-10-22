import { useEffect, useState } from "react";
import { extraireMessageErreur } from "../utils/erreurs";
import Pagination, { usePagination } from "../components/Pagination.jsx";
import toast from "react-hot-toast";
import ExportImportBarre from "../components/ExportImportBarre.jsx";
import {
    creerVehicule,
    exporterVehiculesCsv,
    exporterVehiculesJson,
    importerVehiculesCsv,
    importerVehiculesJson,
    listerVehicules,
    modifierVehicule,
    supprimerVehicule,
} from "../api/vehicules";

import VehiculeFormulaire from "../components/VehiculeFormulaire";
import VehiculeTableau from "../components/VehiculeTableau";
import Recherche, { useRecherche } from "../components/Recherche.jsx";
import ConfirmDialog, { useConfirmation } from "../components/ConfirmDialog.jsx";
import Spinner from "../components/Spinner.jsx";


function VehiculesPage() {
    const [vehicules, setVehicules] = useState([]);
    const [vehiculeSelectionne, setVehiculeSelectionne] = useState(null);
    const [cleFormulaire, setCleFormulaire] = useState(0);
    const [chargement, setChargement] = useState(true);
    const { terme, setTerme, elementsFiltres } = useRecherche(vehicules, [
        "immatriculation",
        "marque",
        "modele",
        "type",
    ]);
    const { elementsPage, pageActuelle, setPageActuelle, nombreDePages } = usePagination(elementsFiltres);
    const { confirmation, demanderConfirmation, confirmer, annuler } = useConfirmation();

    useEffect(() => {
        rafraichir();
    }, []);

    function rafraichir() {
        setChargement(true);
        listerVehicules()
        .then((donnees) => setVehicules(donnees))
        .catch(() => toast.error("Impossible de charger la liste des véhicules."))
        .finally(() => setChargement(false));
    }

    function gererValidation(valeurs, modeModification) {
        const donnees = { ...valeurs, prix_jour: parseFloat(valeurs.prix_jour) };

        const promesse = modeModification ? modifierVehicule(vehiculeSelectionne.id_vehicule, donnees) : creerVehicule(donnees);

        promesse.then(() => {
            toast.success(modeModification ? "Véhicule modifié avec succès." : "Véhicule ajouté avec succès.");
            reinitialiserSelection();
            rafraichir();
        }).catch((erreur) => {
            toast.error(extraireMessageErreur(erreur));
        });
    }

    function gererSuppression(vehicule) {
        demanderConfirmation(
            `Supprimer le véhicule ${vehicule.immatriculation} ? Cette action est irréversible.`,
            () => {
                supprimerVehicule(vehicule.id_vehicule).then(() => {
                    toast.success("Véhicule supprimé avec succès.");
                    if (vehiculeSelectionne?.id_vehicule === vehicule.id_vehicule) {
                        reinitialiserSelection();
                    }
                    rafraichir();
                }).catch((erreur) => toast.error(extraireMessageErreur(erreur)));
            }
        );
    }

    function reinitialiserSelection() {
        setVehiculeSelectionne(null);
        setCleFormulaire((precedent) => precedent + 1);
    }

    return (
        <div>
            <h2>Véhicules</h2>

            <ConfirmDialog
                confirmation={confirmation}
                onConfirmer={confirmer}
                onAnnuler={annuler}
            />

            <ExportImportBarre
                nomFichier="vehicules"
                exporterJson={exporterVehiculesJson}
                exporterCsv={exporterVehiculesCsv}
                importerJson={importerVehiculesJson}
                importerCsv={importerVehiculesCsv}
                onImportTermine={rafraichir}
            />

            <VehiculeFormulaire
                key={`${vehiculeSelectionne?.id_vehicule ?? "nouveau"}-${cleFormulaire}`}
                vehiculeSelectionne={vehiculeSelectionne}
                onValider={gererValidation}
                onReinitialiser={() => setVehiculeSelectionne(null)}
            />

            {chargement ? (
                <Spinner />
            ) : (
                <>
                    <Recherche terme={terme} onChanger={setTerme} placeholder="Rechercher par immatriculation, marque, modèle, type..." />
                    <VehiculeTableau
                        vehicules={elementsPage}
                        vehiculeSelectionne={vehiculeSelectionne}
                        onSelectionner={setVehiculeSelectionne}
                        onSupprimer={gererSuppression}
                    />
                    <Pagination
                        pageActuelle={pageActuelle}
                        nombreDePages={nombreDePages}
                        onChangerPage={setPageActuelle}
                    />
                </>
            )}
        </div>
    );
}

export default VehiculesPage;