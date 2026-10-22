import { useMemo, useState } from "react";

export function useRecherche(elements, champs) {
    const [terme, setTerme] = useState("");

    const elementsFiltres = useMemo(() => {
        const termeNormalise = terme.trim().toLowerCase();
        if (!termeNormalise) return elements;

        return elements.filter((element) =>
            champs.some((champ) => {
                const valeur = element[champ];
                return valeur != null && String(valeur).toLowerCase().includes(termeNormalise);
            })
        );
    }, [elements, champs, terme]);

    return { terme, setTerme, elementsFiltres };
}

function Recherche({ terme, onChanger, placeholder }) {
    return (
        <div className="recherche">
        <input
            type="search"
            value={terme}
            onChange={(evenement) => onChanger(evenement.target.value)}
            placeholder={placeholder}
            className="recherche-champ"
        />
        {terme && (
            <button type="button" className="bouton" onClick={() => onChanger("")}>
                Réinitialiser
            </button>
        )}
        </div>
    );
}

export default Recherche;