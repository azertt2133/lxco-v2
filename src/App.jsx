// src/App.jsx
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppProvider, useApp } from "./context/AppContext";
import LoginScreen from "./components/auth/LoginScreen";
import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./components/dashboard/Dashboard";
import Tasks from "./pages/Tasks";
import DebugPanel from "./components/ui/DebugPanel";
import { useEmailNotification } from "./hooks/useEmailNotification";

function AppInner() {
  const [activePage, setActivePage] = useState("dashboard");
  const { tasks, folders, userEmail, loading, error } = useApp();

  useEmailNotification(tasks, folders, userEmail);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#080a10" }}>
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: "rgba(61,110,246,0.3)", borderTopColor: "#3d6ef6" }} />
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>Chargement de vos données...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#080a10" }}>
        <div className="text-center max-w-md">
          <p className="text-4xl mb-4">⚠️</p>
          <h2 style={{ color: "white", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
            Erreur de connexion Firebase
          </h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 16 }}>{error}</p>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
            Vérifiez votre config dans <code>src/firebase/config.js</code> et les règles Firestore.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ background: "#080a10" }}>
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main style={{ flex: 1, overflowY: "auto" }}>
        {activePage === "dashboard"
          ? <Dashboard setActivePage={setActivePage} />
          : <Tasks />
        }
      </main>
      <DebugPanel />
    </div>
  );
}

export default function App() {
  const [userEmail, setUserEmail] = useState(null);
  const [checking,  setChecking]  = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("lxco_user_email");
    if (saved) setUserEmail(saved);
    setChecking(false);
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#080a10" }}>
        <div className="w-8 h-8 border-2 rounded-full animate-spin"
          style={{ borderColor: "rgba(61,110,246,0.3)", borderTopColor: "#3d6ef6" }} />
      </div>
    );
  }

  if (!userEmail) {
    return (
      <>
        <LoginScreen onLogin={setUserEmail} />
        <ToastContainer position="bottom-right" theme="dark" />
      </>
    );
  }

  return (
    <AppProvider userEmail={userEmail}>
      <AppInner />
      <ToastContainer position="bottom-right" theme="dark" />
    </AppProvider>
  );
}
