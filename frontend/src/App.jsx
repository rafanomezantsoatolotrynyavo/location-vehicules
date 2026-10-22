import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Sidebar from "./components/Sidebar.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import AProposPage from "./pages/AProposPage.jsx";
import ClientsPage from "./pages/ClientsPage.jsx";
import ComptePage from "./pages/ComptePage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import LocationsPage from "./pages/LocationsPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import VehiculesPage from "./pages/VehiculesPage.jsx";

function App() {
  const { jeton } = useAuth();

  if (!jeton) {
    return (
      <>
        <LoginPage />
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      </>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="app-contenu">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/vehicules" element={<VehiculesPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/locations" element={<LocationsPage />} />
          <Route path="/a-propos" element={<AProposPage />} />
          <Route path="/compte" element={<ComptePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
    </div>
  );
}

export default App;