import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const jeton = localStorage.getItem("jeton");
  if (jeton) {
    config.headers.Authorization = `Token ${jeton}`;
  }
  return config;
});

api.interceptors.response.use(
  (reponse) => reponse,
  (erreur) => {
    if (erreur.response?.status === 401) {
      localStorage.removeItem("jeton");
      localStorage.removeItem("utilisateur");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(erreur);
  }
);

export default api;