function AProposPage() {
    const technologies = {
        "Back-end": ["Python", "Django", "Django REST Framework", "SQLite"],
        "Front-end": ["React", "Vite", "React Router", "Axios", "Recharts", "react-hot-toast"],
    };

    const schemas = [
        { fichier: "/diagramme-classes.png", legende: "Diagramme de classes" },
        { fichier: "/mcd.png", legende: "Modèle Conceptuel de Données (MCD)" },
        { fichier: "/mpd.png", legende: "Modèle Physique de Données (MPD)" },
    ];

    return (
        <div>
            <h2>À propos</h2>

            <div className="apropos-bloc">
                <h3>Modélisation du projet</h3>
                {schemas.map((schema) => (
                    <figure key={schema.fichier} className="apropos-schema">
                    <img src={schema.fichier} alt={schema.legende} className="apropos-image" />
                    <figcaption>{schema.legende}</figcaption>
                    </figure>
                ))}
            </div>

            <div className="apropos-bloc">
                <h3>Informations</h3>
                <dl className="apropos-fiche">
                <div>
                    <dt>Nom</dt>
                    <dd>Tolotry Ny Avo Cédric RAFANOMEZANTSOA</dd>
                </div>
                <div>
                    <dt>Formation</dt>
                    <dd>Licence 3 Informatique de Gestion</dd>
                </div>
                <div>
                    <dt>École</dt>
                    <dd>IS-INFO Ampasamadinika</dd>
                </div>
                <div>
                    <dt>Classe</dt>
                    <dd>IG FI B</dd>
                </div>
                <div>
                    <dt>Matricule</dt>
                    <dd>3413/24</dd>
                </div>
                </dl>
            </div>

            <div className="apropos-bloc">
                <h3>Technologies utilisées</h3>
                {Object.entries(technologies).map(([categorie, liste]) => (
                    <div key={categorie} className="apropos-techno-groupe">
                        <p className="apropos-techno-titre">{categorie}</p>
                        <div className="apropos-techno-tags">
                            {liste.map((techno) => (
                                <span key={techno} className="apropos-tag">
                                {techno}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AProposPage;