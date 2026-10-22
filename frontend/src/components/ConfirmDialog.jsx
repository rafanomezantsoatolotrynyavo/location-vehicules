import { useState } from "react";

export function useConfirmation() {
    const [confirmation, setConfirmation] = useState(null); // { message, action }

    function demanderConfirmation(message, action) {
        setConfirmation({ message, action });
    }

    function confirmer() {
        confirmation?.action();
        setConfirmation(null);
    }

    function annuler() {
        setConfirmation(null);
    }

    return { confirmation, demanderConfirmation, confirmer, annuler };
}

function ConfirmDialog({ confirmation, onConfirmer, onAnnuler }) {
    if (!confirmation) return null;

    return (
        <div className="dialog-fond" onClick={onAnnuler}>
            <div className="dialog-boite" onClick={(evenement) => evenement.stopPropagation()}>
                <p>{confirmation.message}</p>
                <div className="dialog-actions">
                    <button type="button" className="bouton bouton--danger" onClick={onConfirmer}>
                        Confirmer
                    </button>
                    <button type="button" className="bouton" onClick={onAnnuler}>
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDialog;