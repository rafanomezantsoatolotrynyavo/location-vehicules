import { useEffect, useState } from "react";
import { cinValide, passeportValide, telephoneValide } from "../utils/validationFormat";


const VALEURS_VIDES = {
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
    adresse: "",
    type_client: "Malgache",
    num_cin: "",
    num_passeport: "",
}

function ClientFormulaire({
    clientSelectionne, onValider, onReinitialiser
}) {
    const [valeurs, setValeurs] = useState(VALEURS_VIDES);
    const modeModification = clientSelectionne !== null;

    useEffect(() => {
        setValeurs(
            clientSelectionne ? { ...VALEURS_VIDES, ...clientSelectionne } : VALEURS_VIDES
        );
    }, [clientSelectionne]);

    function gererChargement(event) {
        const { name, value } = event.target;
        setValeurs((precedent) => ({ ...precedent, [name]: value}));
    }

    function gererEnvoi(event) {
        event.preventDefault();
        onValider(valeurs, modeModification);
    }

    function gererReinitialisation() {
        setValeurs(VALEURS_VIDES);
        onReinitialiser();
    }

    const isMalgache = valeurs.type_client === "Malgache";
    const erreurTelephone = valeurs.telephone !== "" && !telephoneValide(valeurs.telephone);
    const erreurCin = isMalgache && valeurs.num_cin !== "" && !cinValide(valeurs.num_cin);
    const erreurPasseport = !isMalgache && valeurs.num_passeport !== "" && !passeportValide(valeurs.num_passeport);
    const formulaireInvalide = erreurTelephone || erreurCin || erreurPasseport;

    return (
        <form className="formulaire" onSubmit={gererEnvoi} autoComplete="off">
            <div className="formulaire-champ">
                <label htmlFor="type_client">Type de client</label>
                <select
                    id="type_client"
                    name="type_client"
                    value={valeurs.type_client}
                    onChange={gererChargement}
                    disabled={modeModification}
                >
                    <option value="Malgache">Malgache</option>
                    <option value="Etranger">Étranger</option>
                </select>
            </div>

            <div className="formulaire-champ">
                <label htmlFor="nom">Nom</label>
                <input
                    id="nom"
                    name="nom"
                    value={valeurs.nom}
                    onChange={gererChargement}
                    required
                    disabled={modeModification}
                />
            </div>

            <div className="formulaire-champ">
                <label htmlFor="prenom">Prénom</label>
                <input
                    id="prenom"
                    name="prenom"
                    value={valeurs.prenom}
                    onChange={gererChargement}
                    required
                    disabled={modeModification}
                />
            </div>

            {isMalgache ? (
                <div className="formulaire-champ">
                    <label htmlFor="num_cin">Numéro de CIN</label>
                    <input
                        id="num_cin"
                        name="num_cin"
                        value={valeurs.num_cin ?? ""}
                        onChange={gererChargement}
                        placeholder="12 chiffres"
                        maxLength={12}
                        required
                        disabled={modeModification}
                        className={erreurCin?"champ-invalide" : ""}
                    />
                    {erreurCin && <p className="champ-erreur">Le CIN doit contenir exactement 12 chiffres.</p>}
                </div>
            ) : (
                <div className="formulaire-champ">
                    <label htmlFor="num_passeport">Numéro de passeport</label>
                    <input
                        id="num_passeport"
                        name="num_passeport"
                        value={valeurs.num_passeport ?? ""}
                        onChange={gererChargement}
                        required
                        disabled={modeModification}
                        className={erreurPasseport?"champ-invalide":""}
                    />
                    {erreurPasseport && <p className="champ-erreur">Format attendu: AB1234567</p>}
                </div>
            )}

            <div className="formulaire-champ">
                <label htmlFor="telephone">Téléphone</label>
                <input
                    id="telephone"
                    name="telephone"
                    value={valeurs.telephone}
                    onChange={gererChargement}
                    placeholder="034 12 345 67"
                    required
                    className={erreurTelephone?"champ-invalide":""}
                />
                {erreurTelephone && <p className="champ-erreur">Format attendu: 034 12 345 67</p>}
            </div>

            <div className="formulaire-champ">
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={valeurs.email}
                    onChange={gererChargement}
                    required
                />
            </div>

            <div className="formulaire-champ">
                <label htmlFor="adresse">Adresse</label>
                <input
                    id="adresse"
                    name="adresse"
                    value={valeurs.adresse}
                    onChange={gererChargement}
                    required
                />
            </div>

            <div className="formulaire-actions">
                <button type="submit" className="bouton bouton--principal" disabled={formulaireInvalide}>
                    {modeModification ? "Modifier" : "Ajouter"}
                </button>

                <button type="button" className="bouton" onClick={gererReinitialisation}>
                    Réinitialiser
                </button>
            </div>
        </form>
    );
}

export default ClientFormulaire;