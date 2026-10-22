import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { changerMotDePasse, modifierCompte, obtenirCompte } from "../api/auth";
import { useAuth } from "../context/AuthContext.jsx";
import { extraireMessageErreur } from "../utils/erreurs";

function ComptePage() {
  const { mettreAJourUtilisateur } = useAuth();
  const [compte, setCompte] = useState(null);
  const [motsDePasse, setMotsDePasse] = useState({ ancien: "", nouveau: "", confirmation: "" });

  useEffect(() => {
    obtenirCompte()
      .then(setCompte)
      .catch(() => toast.error("Impossible de charger les informations du compte."));
  }, []);

  function gererChangementCompte(evenement) {
    const { name, value } = evenement.target;
    setCompte((precedent) => ({ ...precedent, [name]: value }));
  }

  function gererEnvoiCompte(evenement) {
    evenement.preventDefault();
    modifierCompte({ email: compte.email, prenom: compte.prenom, nom: compte.nom })
      .then((resultat) => {
        toast.success("Informations du compte mises à jour.");
        mettreAJourUtilisateur({ nom_utilisateur: resultat.nom_utilisateur, email: resultat.email });
      })
      .catch((erreur) => toast.error(extraireMessageErreur(erreur)));
  }

  function gererChangementMotDePasse(evenement) {
    const { name, value } = evenement.target;
    setMotsDePasse((precedent) => ({ ...precedent, [name]: value }));
  }

  function gererEnvoiMotDePasse(evenement) {
    evenement.preventDefault();
    if (motsDePasse.nouveau !== motsDePasse.confirmation) {
      toast.error("La confirmation ne correspond pas au nouveau mot de passe.");
      return;
    }
    changerMotDePasse(motsDePasse.ancien, motsDePasse.nouveau)
      .then(() => {
        toast.success("Mot de passe modifié avec succès.");
        setMotsDePasse({ ancien: "", nouveau: "", confirmation: "" });
      })
      .catch((erreur) => toast.error(extraireMessageErreur(erreur)));
  }

  if (!compte) return <p>Chargement…</p>;

  return (
    <div>
      <h2>Mon compte</h2>

      <form className="formulaire" onSubmit={gererEnvoiCompte} autoComplete="off">
        <div className="formulaire-champ">
          <label>Identifiant</label>
          <input value={compte.nom_utilisateur} disabled />
        </div>
        <div className="formulaire-champ">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={compte.email} onChange={gererChangementCompte} />
        </div>
        <div className="formulaire-champ">
          <label htmlFor="prenom">Prénom</label>
          <input id="prenom" name="prenom" value={compte.prenom} onChange={gererChangementCompte} />
        </div>
        <div className="formulaire-champ">
          <label htmlFor="nom">Nom</label>
          <input id="nom" name="nom" value={compte.nom} onChange={gererChangementCompte} />
        </div>
        <div className="formulaire-actions">
          <button type="submit" className="bouton bouton--principal">Enregistrer</button>
        </div>
      </form>

      <form className="formulaire" onSubmit={gererEnvoiMotDePasse} autoComplete="off">
        <div className="formulaire-champ">
          <label htmlFor="ancien">Mot de passe actuel</label>
          <input id="ancien" name="ancien" type="password" value={motsDePasse.ancien} onChange={gererChangementMotDePasse} required />
        </div>
        <div className="formulaire-champ">
          <label htmlFor="nouveau">Nouveau mot de passe</label>
          <input id="nouveau" name="nouveau" type="password" value={motsDePasse.nouveau} onChange={gererChangementMotDePasse} required />
        </div>
        <div className="formulaire-champ">
          <label htmlFor="confirmation">Confirmer le mot de passe</label>
          <input id="confirmation" name="confirmation" type="password" value={motsDePasse.confirmation} onChange={gererChangementMotDePasse} required />
        </div>
        <div className="formulaire-actions">
          <button type="submit" className="bouton bouton--principal">Changer le mot de passe</button>
        </div>
      </form>
    </div>
  );
}

export default ComptePage;