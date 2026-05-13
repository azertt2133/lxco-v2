// src/components/ui/DebugPanel.jsx
// Affiche l'état Firebase en temps réel — retire en production
import { useApp } from "../../context/AppContext";

export default function DebugPanel() {
  const { folders, tasks, activeFolder, loading, error, userId } = useApp();

  if (import.meta.env.PROD) return null;

  return (
    <div style={{
      position: "fixed", bottom: 16, right: 16, zIndex: 9999,
      background: "#0e1018", border: "1px solid rgba(255,255,255,0.15)",
      borderRadius: 12, padding: "12px 16px", fontSize: 11,
      color: "rgba(255,255,255,0.6)", maxWidth: 280, fontFamily: "monospace",
    }}>
      <p style={{ color: "#6090fa", fontWeight: 700, marginBottom: 6 }}>🔥 Firebase Debug</p>
      <p>userId: <span style={{ color: "#fbbf24" }}>{userId || "—"}</span></p>
      <p>loading: <span style={{ color: loading ? "#fbbf24" : "#34d399" }}>{String(loading)}</span></p>
      {error && <p style={{ color: "#f87171" }}>error: {error}</p>}
      <p>dossiers: <span style={{ color: "#34d399" }}>{folders.length}</span></p>
      <p>tâches: <span style={{ color: "#34d399" }}>{tasks.length}</span></p>
      <p>activeFolder: <span style={{ color: "#6090fa" }}>{activeFolder?.slice(0,8) || "—"}</span></p>
    </div>
  );
}
