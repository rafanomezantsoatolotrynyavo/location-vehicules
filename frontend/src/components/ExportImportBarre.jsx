import { useRef } from "react";
import toast from "react-hot-toast";

import { extraireMessageErreur } from "../utils/erreurs";

function ExportImportBarre({
  nomFichier,
  exporterJson,
  exporterCsv,
  importerJson,
  importerCsv,
  onImportTermine,
}) {
  const inputFichierRef = useRef(null);

  function declencherTelechargement(contenu, nomComplet, typeContenu) {
    const blob = contenu instanceof Blob ? contenu : new Blob([JSON.stringify(contenu, null, 2)], { type: typeContenu });
    const url = URL.createObjectURL(blob);
    const lien = document.createElement("a");
    lien.href = url;
    lien.download = nomComplet;
    lien.click();
    URL.revokeObjectURL(url);
  }

  function gererExportJson() {
    exporterJson()
      .then((donnees) => declencherTelechargement(donnees, `${nomFichier}.json`, "application/json"))
      .catch(() => toast.error("Impossible de générer l'export JSON."));
  }

  function gererExportCsv() {
    exporterCsv()
      .then((blob) => declencherTelechargement(blob, `${nomFichier}.csv`, "text/csv"))
      .catch(() => toast.error("Impossible de générer l'export CSV."));
  }

  function gererChoixFichier(evenement, importer) {
    const fichier = evenement.target.files[0];
    if (!fichier) return;

    importer(fichier)
      .then((resultat) => {
        if (resultat.erreurs.length === 0) {
          toast.success(`${resultat.importes} ligne(s) importée(s) avec succès.`);
        } else {
          toast.error(
            `${resultat.importes} ligne(s) importée(s), ${resultat.erreurs.length} ligne(s) refusée(s) (voir la console).`
          );
          console.warn("Lignes refusées à l'import :", resultat.erreurs);
        }
        onImportTermine();
      })
      .catch((erreur) => toast.error(extraireMessageErreur(erreur)))
      .finally(() => {
        evenement.target.value = "";
      });
  }

  return (
    <div className="export-import">
      <button type="button" className="bouton" onClick={gererExportJson}>
        Exporter JSON
      </button>
      <button type="button" className="bouton" onClick={gererExportCsv}>
        Exporter CSV
      </button>

      <button
        type="button"
        className="bouton"
        onClick={() => inputFichierRef.current.click()}
      >
        Importer un fichier
      </button>
      <input
        ref={inputFichierRef}
        type="file"
        accept=".json,.csv"
        style={{ display: "none" }}
        onChange={(evenement) => {
          const estJson = evenement.target.files[0]?.name.endsWith(".json");
          gererChoixFichier(evenement, estJson ? importerJson : importerCsv);
        }}
      />
    </div>
  );
}

export default ExportImportBarre;