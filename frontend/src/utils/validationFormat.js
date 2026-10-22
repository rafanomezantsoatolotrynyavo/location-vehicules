export function telephoneValide(valeur) {
    const nettoye = valeur.replace(/[\s.-]/g, "");
    return /^(0|\+261)(32|33|34|37|38|39)\d{7}$/.test(nettoye);
}

export function cinValide(valeur) {
    return /^\d{12}$/.test(valeur.replace(/\s/g, ""));
}

export function passeportValide(valeur) {
    return /^[A-Za-z0-9]{6,20}$/.test(valeur.replace(/\s/g, ""));
}

export function immatriculationValide(valeur) {
    return /^\d{3,4}\s?[A-Za-z]{2,3}$/.test(valeur.trim());
}