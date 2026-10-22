import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { connexion } from "../api/auth";
import { useAuth } from "../context/AuthContext.jsx";
import { extraireMessageErreur } from "../utils/erreurs";

function LoginPage() {
  const [nomUtilisateur, setNomUtilisateur] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const { connecter } = useAuth();
  const navigate = useNavigate();

  function gererEnvoi(evenement) {
    evenement.preventDefault();
    setEnvoiEnCours(true);
    connexion(nomUtilisateur, motDePasse)
      .then((resultat) => {
        connecter(resultat.jeton, {
          nom_utilisateur: resultat.nom_utilisateur,
          email: resultat.email,
        });
        navigate("/");
      })
      .catch((erreur) => toast.error(extraireMessageErreur(erreur)))
      .finally(() => setEnvoiEnCours(false));
  }

  return (
    <div className="login-page">
      <form className="login-formulaire" onSubmit={gererEnvoi} autoComplete="off">
        <h1>🚗 Location de véhicules</h1>
        <p className="login-sous-titre">Connectez-vous pour continuer</p>

        <div className="formulaire-champ">
          <label htmlFor="nom_utilisateur">Identifiant</label>
          <input
            id="nom_utilisateur"
            value={nomUtilisateur}
            onChange={(e) => setNomUtilisateur(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div className="formulaire-champ">
          <label htmlFor="mot_de_passe">Mot de passe</label>
          <input
            id="mot_de_passe"
            type="password"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="bouton bouton--principal" disabled={envoiEnCours}>
          {envoiEnCours ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;