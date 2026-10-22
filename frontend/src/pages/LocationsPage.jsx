import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { listerClients } from "../api/clients";
import { listerVehicules } from "../api/vehicules";
import LocationFormulaire from "../components/LocationFormulaire.jsx";
import LocationTableau from "../components/LocationTableau.jsx";
import Pagination, { usePagination } from "../components/Pagination.jsx";
import { extraireMessageErreur } from "../utils/erreurs";
import ExportImportBarre from "../components/ExportImportBarre.jsx";
import {
    annulerLocation,
    creerLocation,
    exporterLocationsCsv,
    exporterLocationsJson,
    importerLocationsCsv,
    importerLocationsJson,
    listerLocations,
    modifierLocation,
    supprimerLocation,
} from "../api/locations";
import Recherche, { useRecherche } from "../components/Recherche.jsx";
import ConfirmDialog, { useConfirmation } from "../components/ConfirmDialog.jsx";
import Spinner from "../components/Spinner.jsx";


function LocationsPage() {
    const [locations, setLocations] = useState([]);
    const [clients, setClients] = useState([]);
    const [vehicules, setVehicules] = useState([]);
    const [locationSelectionnee, setLocationSelectionnee] = useState(null);
    const [chargement, setChargement] = useState(true);
    const [cleFormulaire, setCleFormulaire] = useState(0);

    const { terme, setTerme, elementsFiltres } = useRecherche(locations, [
        "client_nom",
        "client_prenom",
        "vehicule_immatriculation",
        "statut",
    ]);
    const { elementsPage, pageActuelle, setPageActuelle, nombreDePages } = usePagination(elementsFiltres);
    const { confirmation, demanderConfirmation, confirmer, annuler } = useConfirmation();

    useEffect(() => {
        rafraichir();
    }, []);

    function reinitialiserSelection() {
        setLocationSelectionnee(null);
        setCleFormulaire((precedent) => precedent + 1);
    }

    function rafraichir() {
        setChargement(true);
        Promise.all([listerLocations(), listerClients(), listerVehicules()])
        .then(([donneesLocations, donneesClients, donneesVehicules]) => {
            setLocations(donneesLocations);
            setClients(donneesClients);
            setVehicules(donneesVehicules);
        }).catch(() => toast.error("Impossible de charger les données des locations."))
        .finally(() => setChargement(false));
    }

    function gererValidation(valeurs, modeModification) {
        const promesse = modeModification
        ? modifierLocation(locationSelectionnee.id_location, {
            date_debut: valeurs.date_debut,
            date_fin: valeurs.date_fin,
        })
        : creerLocation(valeurs);

        promesse.then(() => {
            toast.success(modeModification ? "Location modifiée avec succès." : "Location créée avec succès.");
            reinitialiserSelection();
            rafraichir();
        }).catch((erreur) => {
            toast.error(extraireMessageErreur(erreur));
        });
    }

    function gererAnnulation(location) {
        demanderConfirmation(
            `Annuler la location n°${location.id_location} (${location.vehicule_immatriculation}) ?`, () => {
                annulerLocation(location.id_location).then(() => {
                    toast.success("Location annulée avec succès.");
                    if (locationSelectionnee?.id_location === location.id_location) {
                        reinitialiserSelection();
                    }
                    rafraichir();
                }).catch((erreur) => toast.error(extraireMessageErreur(erreur)));
            }
        )
    }

    function gererSuppression(location) {
        demanderConfirmation(
            `Supprimer définitivement la location n°${location.id_location} ? Cette action est irréversible.`, () => {
                supprimerLocation(location.id_location).then(() => {
                    toast.success("Location supprimée avec succès.");
                    if (locationSelectionnee?.id_location === location.id_location) {
                        reinitialiserSelection();
                    }
                    rafraichir();
                }).catch((erreur) => toast.error(extraireMessageErreur(erreur)));
            }
        )

    }

    return (
        <div>
            <h2>Locations</h2>

            <ConfirmDialog
                confirmation={confirmation}
                onConfirmer={confirmer}
                onAnnuler={annuler}
            />

            {chargement ? (
                <Spinner />
            ) : (
                <>
                    <ExportImportBarre
                        nomFichier="locations"
                        exporterJson={exporterLocationsJson}
                        exporterCsv={exporterLocationsCsv}
                        importerJson={importerLocationsJson}
                        importerCsv={importerLocationsCsv}
                        onImportTermine={rafraichir}
                    />
                    
                    <LocationFormulaire
                        key={`${locationSelectionnee?.id_location ?? "nouveau"}-${cleFormulaire}`}
                        locationSelectionnee={locationSelectionnee}
                        clients={clients}
                        vehicules={vehicules}
                        onValider={gererValidation}
                        onReinitialiser={reinitialiserSelection}
                    />

                    <Recherche
                        terme={terme}
                        onChanger={setTerme} placeholder="Rechercher par client, véhicule, statut..."
                    />

                    <LocationTableau
                        locations={elementsPage}
                        locationSelectionnee={locationSelectionnee}
                        onSelectionner={setLocationSelectionnee}
                        onAnnuler={gererAnnulation}
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

export default LocationsPage;