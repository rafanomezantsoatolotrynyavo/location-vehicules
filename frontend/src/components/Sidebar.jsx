import { NavLink, useNavigate } from "react-router-dom";


import { deconnexion as appelDeconnexion } from "../api/auth";
import { useAuth } from "../context/AuthContext.jsx";

const LIENS = [
    { chemin: "/", libelle: "Dashboard"},
    { chemin: "/vehicules", libelle: "Véhicules"},
    { chemin: "/clients", libelle: "Clients"},
    { chemin: "/locations", libelle: "Locations"},
    { chemin: "/a-propos", libelle: "À propos"}
];

function Sidebar() {
    const { utilisateur, deconnecter } = useAuth();
    const navigate = useNavigate();

    function gererDeconnexion() {
        appelDeconnexion().finally(() => {
        deconnecter();
        navigate("/login");
        });
    }

    return (
        <nav className="sidebar">
            <h1 className="sidebar-titre">
                🚗 Location de véhicules
            </h1>

            <ul className="sidebar-liens">
                {LIENS.map((lien) => (
                <li key={lien.chemin}>
                    <NavLink
                    to={lien.chemin}
                    end={lien.chemin === "/"}
                    className={({ isActive }) =>
                        isActive ? "sidebar-lien sidebar-lien--actif" : "sidebar-lien"
                    }
                    >
                    {lien.libelle}
                    </NavLink>
                </li>
                ))}
                <li>
                <NavLink
                    to="/compte"
                    className={({ isActive }) =>
                    isActive ? "sidebar-lien sidebar-lien--actif" : "sidebar-lien"
                    }
                >
                    Mon compte
                </NavLink>
                </li>
            </ul>

            <div className="sidebar-pied">
                {utilisateur && <p className="sidebar-utilisateur">{utilisateur.nom_utilisateur}</p>}
                <button type="button" className="bouton sidebar-deconnexion" onClick={gererDeconnexion}>
                Déconnexion
                </button>
            </div>
        </nav>
    );
}

export default Sidebar;