import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [jeton, setJeton] = useState(() => localStorage.getItem("jeton"));
  const [utilisateur, setUtilisateur] = useState(() => {
    const stocke = localStorage.getItem("utilisateur");
    return stocke ? JSON.parse(stocke) : null;
  });

  function connecter(nouveauJeton, nouvelUtilisateur) {
    localStorage.setItem("jeton", nouveauJeton);
    localStorage.setItem("utilisateur", JSON.stringify(nouvelUtilisateur));
    setJeton(nouveauJeton);
    setUtilisateur(nouvelUtilisateur);
  }

  function deconnecter() {
    localStorage.removeItem("jeton");
    localStorage.removeItem("utilisateur");
    setJeton(null);
    setUtilisateur(null);
  }

  function mettreAJourUtilisateur(utilisateurMaj) {
    localStorage.setItem("utilisateur", JSON.stringify(utilisateurMaj));
    setUtilisateur(utilisateurMaj);
  }

  return (
    <AuthContext.Provider value={{ jeton, utilisateur, connecter, deconnecter, mettreAJourUtilisateur }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexte = useContext(AuthContext);
  if (!contexte) {
    throw new Error("useAuth doit être utilisé à l'intérieur de <AuthProvider>.");
  }
  return contexte;
}