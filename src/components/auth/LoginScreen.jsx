// src/components/auth/LoginScreen.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { sendLoginEmail } from "../../hooks/useEmailNotification";

const FEATURES = [
  { icon: "📁", title: "Dossiers personnalisés",    desc: "Organisez vos tâches par projet, sport, travail…" },
  { icon: "✅", title: "Gestion avancée",            desc: "Titre, description, date limite, statut en temps réel." },
  { icon: "⏱️", title: "Minuteur automatique",       desc: "Chronomètre par tâche avec arrêt automatique." },
  { icon: "📧", title: "Notifications email",        desc: "Rappel automatique 5 minutes avant la fin." },
  { icon: "☁️", title: "Sauvegarde Firebase",        desc: "Données synchronisées en temps réel dans le cloud." },
  { icon: "📊", title: "Barre de progression",       desc: "Suivez votre avancement jusqu'à 100% par dossier." },
];

export default function LoginScreen({ onLogin }) {
  const [email,   setEmail]   = useState("");
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Entrez un email valide."); return;
    }
    setLoading(true);
    sendLoginEmail(trimmed).then(ok => {
      if (ok) toast.success("📧 Email de connexion envoyé !");
    });
    await new Promise(r => setTimeout(r, 700));
    localStorage.setItem("lxco_user_email", trimmed);
    onLogin(trimmed);
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#080a10", overflowX: "hidden",
      display: "flex", flexDirection: "column",
    }}>
      {/* ── Ambient background ── */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{
          position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)",
          width: 700, height: 700, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(61,110,246,0.1) 0%, transparent 65%)",
        }}/>
        <div style={{
          position: "absolute", bottom: "5%", right: "10%",
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(96,144,250,0.06) 0%, transparent 65%)",
        }}/>
      </div>

      <div style={{
        position: "relative", zIndex: 1, flex: 1,
        display: "grid", gridTemplateColumns: "1fr 1fr",
        maxWidth: 1100, margin: "0 auto", width: "100%",
        padding: "48px 24px", gap: 64, alignItems: "center",
      }}
        className="login-grid"
      >
        {/* ── Colonne gauche : présentation ── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "6px 14px", borderRadius: 999,
              background: "rgba(61,110,246,0.12)", border: "1px solid rgba(61,110,246,0.25)",
              marginBottom: 24,
            }}
          >
            <span style={{
              width: 7, height: 7, borderRadius: "50%", background: "#3d6ef6",
              boxShadow: "0 0 8px #3d6ef6", display: "inline-block",
            }}/>
            <span style={{ fontSize: 12, color: "#6090fa", fontWeight: 600 }}>
              Disponible gratuitement
            </span>
          </motion.div>

          {/* Logo + titre */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: "rgba(61,110,246,0.12)", border: "1px solid rgba(61,110,246,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
                <rect x="4" y="7" width="24" height="3.5" rx="1.75" fill="#6090fa"/>
                <rect x="4" y="14.25" width="18" height="3.5" rx="1.75" fill="#3d6ef6"/>
                <rect x="4" y="21.5" width="12" height="3.5" rx="1.75" fill="#2550eb"/>
              </svg>
            </div>
            <div>
              <h1 style={{ fontSize: 32, fontWeight: 900, color: "white", letterSpacing: -1, lineHeight: 1 }}>
                LXCO Tasks
              </h1>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>
                Gestion intelligente de tâches
              </p>
            </div>
          </div>

          <p style={{
            fontSize: 15, color: "rgba(255,255,255,0.5)", lineHeight: 1.7,
            marginBottom: 36, maxWidth: 420,
          }}>
            Organisez votre travail efficacement grâce à une gestion intelligente
            des tâches et dossiers, avec synchronisation en temps réel.
          </p>

          {/* Features grid */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12,
          }}>
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.07 }}
                style={{
                  padding: "14px 16px", borderRadius: 14,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(61,110,246,0.3)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}
              >
                <div style={{ fontSize: 20, marginBottom: 6 }}>{f.icon}</div>
                <p style={{ fontSize: 12, fontWeight: 700, color: "white", marginBottom: 3 }}>{f.title}</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", lineHeight: 1.5 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Colonne droite : formulaire ── */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div style={{
            background: "rgba(26,29,46,0.8)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 24, padding: 36,
            backdropFilter: "blur(20px)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
          }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "white", marginBottom: 6 }}>
              Accéder à mon espace
            </h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginBottom: 28, lineHeight: 1.6 }}>
              Entrez votre email pour retrouver vos dossiers et tâches.
              Vos données sont liées à cet email — aucun mot de passe requis.
            </p>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 20 }}>
                <label style={{
                  display: "block", fontSize: 11, fontWeight: 700,
                  color: "rgba(255,255,255,0.4)", textTransform: "uppercase",
                  letterSpacing: "0.08em", marginBottom: 8,
                }}>Adresse email</label>
                <input
                  type="email"
                  placeholder="vous@exemple.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(""); }}
                  autoFocus
                  style={{
                    width: "100%", padding: "13px 16px", borderRadius: 12, border: "none",
                    background: "rgba(255,255,255,0.06)",
                    outline: "1px solid rgba(255,255,255,0.1)",
                    color: "white", fontSize: 15, transition: "outline-color 0.2s",
                    boxSizing: "border-box",
                  }}
                  onFocus={e => e.target.style.outlineColor = "rgba(61,110,246,0.6)"}
                  onBlur={e => e.target.style.outlineColor = "rgba(255,255,255,0.1)"}
                />
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      style={{ marginTop: 6, fontSize: 12, color: "#f87171" }}
                    >{error}</motion.p>
                  )}
                </AnimatePresence>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%", padding: "14px", borderRadius: 12, border: "none",
                  background: loading ? "rgba(61,110,246,0.45)" : "#3d6ef6",
                  color: "white", fontWeight: 700, fontSize: 15,
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  transition: "background 0.2s, transform 0.15s",
                  boxShadow: loading ? "none" : "0 8px 24px rgba(61,110,246,0.35)",
                }}
                onMouseEnter={e => { if (!loading) e.target.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.target.style.transform = "translateY(0)"; }}
              >
                {loading ? (
                  <>
                    <span style={{
                      width: 16, height: 16,
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "white", borderRadius: "50%",
                      display: "inline-block", animation: "spin 0.7s linear infinite",
                    }}/>
                    Connexion...
                  </>
                ) : "Accéder à mes tâches →"}
              </button>
            </form>

            {/* Trust badges */}
            <div style={{
              display: "flex", justifyContent: "center", gap: 20,
              marginTop: 24, paddingTop: 20,
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}>
              {[["☁️","Firebase"], ["🔒","Sécurisé"], ["⚡","Temps réel"]].map(([ic, lb]) => (
                <div key={lb} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 16, marginBottom: 3 }}>{ic}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", fontWeight: 600 }}>{lb}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{
          position: "relative", zIndex: 1, textAlign: "center",
          padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>
          © 2026 LXCO Tasks · Données sauvegardées automatiquement · Aucun mot de passe requis
        </p>
      </motion.div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .login-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </div>
  );
}