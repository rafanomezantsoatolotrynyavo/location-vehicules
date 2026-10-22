import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COULEURS_PAR_STATUT = {
    Disponible: "#10b981",
    Réservé: "#f59e0b",
    Loué: "#2563eb",
    "En maintenance": "#ef4444",
};

function DashboardGraphique({ repartition }) {
    const donnees = repartition.map((item) => ({
        nom: item.statut,
        valeur: item.nombre,
    }));

    return (
        <div className="dashboard-graphique">
            <h3>Répartition des véhicules par statut</h3>
            <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                    <Pie
                        data={donnees}
                        dataKey="valeur"
                        nameKey="nom"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        label={({ nom, valeur, percent }) => (percent > 0 ? `${nom} : ${valeur}` : "")}
                    >
                        {donnees.map((entree) => (
                            <Cell key={entree.nom} fill={COULEURS_PAR_STATUT[entree.nom]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

export default DashboardGraphique;