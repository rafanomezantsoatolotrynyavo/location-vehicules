export function formaterDate(dateIso) {
    if (!dateIso) return "";
    const [annee, mois, jour] = dateIso.split("-");
    return `${jour}/${mois}/${annee}`;
}