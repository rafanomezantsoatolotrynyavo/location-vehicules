import { useEffect, useState } from "react";


const ELEMENTS_PAR_PAGE = 5;

export function usePagination(elements) {
    const [pageActuelle, setPageActuelle] = useState(1);
    const nombreDePages = Math.max(1, Math.ceil(elements.length / ELEMENTS_PAR_PAGE));

    useEffect(() => {
        if (pageActuelle > nombreDePages) {
            setPageActuelle(1);
        }
    }, [elements.length, pageActuelle, nombreDePages]);

    const debut = (pageActuelle - 1) * ELEMENTS_PAR_PAGE;
    const elementsPage = elements.slice(debut, debut + ELEMENTS_PAR_PAGE);

    return { elementsPage, pageActuelle, setPageActuelle, nombreDePages };
}

function Pagination({ pageActuelle, nombreDePages, onChangerPage}) {
    if (nombreDePages <= 1) return null;

    return (
        <div className="pagination">
            <button
                type="button"
                className="bouton"
                disabled={pageActuelle === 1}
                onClick={() => onChangerPage(pageActuelle - 1)}
            >
                Précédent
            </button>

            <span className="pagination-info">
                Page {pageActuelle} sur {nombreDePages}
            </span>

            <button
                type="button"
                className="bouton"
                disabled={pageActuelle === nombreDePages}
                onClick={() => onChangerPage(pageActuelle + 1)}
            >
                Suivant
            </button>
        </div>
    );
}

export default Pagination;