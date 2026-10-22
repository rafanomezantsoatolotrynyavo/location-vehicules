function ClientTableau({
    clients, clientSelectionne, onSelectionner, onSupprimer
}) {
    if (clients.length === 0) {
        return <p className="tableau-vide">Aucun client enregistré.</p>;
    }

    return (
        <div className="tableau-conteneur">
            <table className="tableau tableau--clients">
                <thead>
                <tr>
                    <th>Type</th>
                    <th>Nom</th>
                    <th>Prénom(s)</th>
                    <th>CIN / Passeport</th>
                    <th>Téléphone</th>
                    <th>Email</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                    {clients.map((client) => {
                        const isSelect = clientSelectionne?.id_client === client.id_client;
                        const id = client.type_client === "Malgache" ? client.num_cin : client.num_passeport;

                        return (
                            <tr
                                key={client.id_client}
                                className={isSelect ? "tableau-ligne tableau-ligne--selectionne" : "tableau-ligne"}
                                onClick={() => onSelectionner(client)}
                            >
                                <td data-etiquette="Type">
                                    <span className={`badge badge--${client.type_client}`}>{client.type_client}</span>
                                </td>
                                <td data-etiquette="Nom">{client.nom}</td>
                                <td data-etiquette="Prénom">{client.prenom}</td>
                                <td data-etiquette="CIN / Passeport">{id}</td>
                                <td data-etiquette="Téléphone">{client.telephone}</td>
                                <td data-etiquette="Email">{client.email}</td>
                                <td data-etiquette="">
                                    <button
                                        type="button"
                                        className="bouton bouton--danger"
                                        onClick={(event) => {event.stopPropagation();onSupprimer(client);}}
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default ClientTableau;