import { useEffect, useState } from "react";
import { immatriculationValide } from "../utils/validationFormat";


const TYPES = ["Berline", "4x4", "Citadine", "Utilitaire", "Minibus", "Moto"];
const STATUTS = ["Disponible", "En maintenance"];
const VALEURS_VIDES = {
    immatriculation: "",
    marque: "",
    modele: "",
    type: TYPES[0],
    prix_jour: "",
    statut: STATUTS[0]
};

function VehiculeFormulaire({vehiculeSelectionne, onValider, onReinitialiser}) {
    const [valeurs, setValeurs] = useState(VALEURS_VIDES);
    const modeModification = vehiculeSelectionne !== null;
    const erreurImmatriculation = valeurs.immatriculation !== "" && !immatriculationValide(valeurs.immatriculation);
    const erreurPrix = valeurs.prix_jour !== "" && Number(valeurs.prix_jour) <= 0;
    const formulaireInvalide = erreurImmatriculation || erreurPrix;

    useEffect(() => {
        setValeurs(vehiculeSelectionne ? { ...vehiculeSelectionne } : VALEURS_VIDES);
    }, [vehiculeSelectionne]);

    function gererChangement(event) {
        const { name, value } = event.target;
        setValeurs((precedent) => ({ ...precedent, [name]: value }));
    }

    function gererEnvoi(event) {
        event.preventDefault();
        onValider(valeurs, modeModification);
    }

    function gererReinitialisation() {
        setValeurs(VALEURS_VIDES);
        onReinitialiser();
    }

    return (
        <form className="formulaire" onSubmit={gererEnvoi} autoComplete="off">
            <div className="formulaire-champ">
                <label htmlFor="immatriculation">
                    Immatriculation
                </label>

                <input
                    id = "immatriculation"
                    name = "immatriculation"
                    value = {valeurs.immatriculation}
                    onChange={gererChangement}
                    placeholder="1234 TAB"
                    required
                    disabled={modeModification}
                    className={erreurImmatriculation?"champ-invalide":""}
                />
                {erreurImmatriculation && <p className="champ-erreur">Format attendu : 1234 TAB.</p>}
            </div>

            <div className="formulaire-champ">
                <label htmlFor="marque">Marque</label>

                <input
                    id = "marque"
                    name = "marque"
                    value = {valeurs.marque}
                    onChange={gererChangement}
                    required
                    disabled={modeModification}
                />
            </div>

            <div className="formulaire-champ">
                <label htmlFor="modele">Modèle</label>

                <input
                    id = "modele"
                    name = "modele"
                    value = {valeurs.modele}
                    onChange={gererChangement}
                    required
                    disabled={modeModification}
                />
            </div>

            <div className="formulaire-champ">
                <label htmlFor="type">Type</label>

                <select
                    id = "type"
                    name = "type"
                    value={valeurs.type}
                    onChange={gererChangement}
                    disabled={modeModification}
                >
                    {TYPES.map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
            </div>

            <div className="formulaire-champ">
                <label htmlFor="prix_jour">
                    Prix par jour (Ar)
                </label>

                <input
                    id = "prix_jour"
                    name="prix_jour"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={valeurs.prix_jour}
                    onChange={gererChangement}
                    required
                    className={erreurPrix ? "champ-invalide" : ""}
                />
                {erreurPrix && <p className="champ-erreur">Le prix doit être supérieur à 0.</p>}
            </div>

            {modeModification && (
                <div className="formulaire-champ">
                    <label htmlFor="statut">Statut</label>

                    {STATUTS.includes(valeurs.statut) ? (
                        <select
                            id="statut"
                            name="statut"
                            value={valeurs.statut}
                            onChange={gererChangement}
                        >
                            {STATUTS.map((statut) => (
                                <option
                                    key={statut}
                                    value={statut}
                                >
                                    {statut}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            value={`${valeurs.statut} (déterminé automatiquement par les locations en cours)`}
                            disabled
                        />
                    )}
                </div>
            )}

            <div className="formulaire-actions">
                {modeModification ? (
                    <button
                        type="submit"
                        className="bouton bouton--principal"
                    >
                        Modifier
                    </button>
                ) : (
                    <button
                        type="submit"
                        className="bouton bouton--principal"
                        disabled={formulaireInvalide}
                    >
                        Ajouter
                    </button>
                )}
                <button
                    type="button"
                    className="bouton"
                    onClick={gererReinitialisation}
                >
                    Réinitialiser
                </button>
            </div>
        </form>
    );
}

export default VehiculeFormulaire;