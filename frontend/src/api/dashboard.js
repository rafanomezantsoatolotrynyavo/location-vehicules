import api from "./axios";

export function obtenirDonneesDashboard() {
  return api.get("dashboard/").then((reponse) => reponse.data);
}