import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import ClientFormulaire from "../components/ClientFormulaire.jsx";
import ClientTableau from "../components/ClientTableau.jsx";
import { extraireMessageErreur } from "../utils/erreurs";
import Pagination, { usePagination } from "../components/Pagination.jsx";
import ExportImportBarre from "../components/ExportImportBarre.jsx";
import {
    creerClient,
    exporterClientsCsv,
    exporterClientsJson,
    importerClientsCsv,
    importerClientsJson,
    listerClients,
    modifierClient,
    supprimerClient,
} from "../api/clients";
import Recherche, { useRecherche } from "../components/Recherche.jsx";
import ConfirmDialog, { useConfirmation } from "../components/ConfirmDialog.jsx";
import Spinner from "../components/Spinner.jsx";


function ClientsPage() {
    const [clients, setClients] = useState([]);
    const [clientSelectionne, setClientSelectionne] = useState(null);
    const [chargement, setChargement] = useState(true);
    const [cleFormulaire, setCleFormulaire] = useState(0);
    const { terme, setTerme, elementsFiltres } = useRecherche(clients, [
        "nom",
        "prenom",
        "telephone",
        "email",
        "num_cin",
        "num_passeport",
    ]);
    const { elementsPage, pageActuelle, setPageActuelle, nombreDePages } = usePagination(elementsFiltres);
    const { confirmation, demanderConfirmation, confirmer, annuler } = useConfirmation();

    useEffect(() => {
        rafraichir();
    }, []);

    function rafraichir() {
        setChargement(true);
        listerClients()
        .then((donnees) => setClients(donnees))
        .catch(() => toast.error("Impossible de charger la liste des clients."))
        .finally(() => setChargement(false));
    }

    function gererValidation(valeurs, modeModification) {
        const donnees = valeurs.type_client === "Malgache"
        ? { ...valeurs, num_passeport: "" }
        : { ...valeurs, num_cin: "" };

        const promesse = modeModification ? modifierClient(clientSelectionne.id_client, donnees) : creerClient(donnees);

        promesse.then(() => {
            toast.success(modeModification ? "Client modifié avec succès." : "Client ajouté avec succès.");
            reinitialiserSelection();
            rafraichir();
        }).catch((erreur) => {
            toast.error(extraireMessageErreur(erreur));
        });
    }

    function gererSuppression(client) {
        demanderConfirmation(
            `Supprimer le client ${client.prenom} ${client.nom} ? Cette action est irréversible.`,
            () => {
                supprimerClient(client.id_client).then(() => {
                    toast.success("Client supprimé avec succès.");
                    if (clientSelectionne?.id_client === client.id_client) {
                        reinitialiserSelection();
                    }
                    rafraichir();
                }).catch((erreur) => toast.error(extraireMessageErreur(erreur)));
            }
        );
    }

    function reinitialiserSelection() {
        setClientSelectionne(null);
        setCleFormulaire((precedent) => precedent + 1);
    }

    return (
        <div>
            <h2>Clients</h2>

            <ConfirmDialog
                confirmation={confirmation}
                onConfirmer={confirmer}
                onAnnuler={annuler}
            />

            <ExportImportBarre
                nomFichier="clients"
                exporterJson={exporterClientsJson}
                exporterCsv={exporterClientsCsv}
                importerJson={importerClientsJson}
                importerCsv={importerClientsCsv}
                onImportTermine={rafraichir}
            />

            <ClientFormulaire
                key={`${clientSelectionne?.id_client ?? "nouveau"}-${cleFormulaire}`}
                clientSelectionne={clientSelectionne}
                onValider={gererValidation}
                onReinitialiser={() => setClientSelectionne(null)}
            />

            {chargement ? (
                <Spinner />
            ) : (
                <>
                    <Recherche terme={terme} onChanger={setTerme} placeholder="Rechercher par nom, téléphone, email, CIN..." />
                    <ClientTableau
                        clients={elementsPage}
                        clientSelectionne={clientSelectionne}
                        onSelectionner={setClientSelectionne}
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

export default ClientsPage;