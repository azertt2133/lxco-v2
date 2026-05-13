// src/components/auth/LoginScreen.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { sendLoginEmail } from "../../services/sendLoginEmail";
import Loader from "../ui/Loader";

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmed = email.trim().toLowerCase();

    // validation email
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Entrez un email valide.");
      return;
    }

    setLoading(true);

    try {
      // UX loading simulation
      await new Promise((r) => setTimeout(r, 600));

      // sauvegarde utilisateur
      localStorage.setItem("lxco_user_email", trimmed);

      // 🔥 ENVOI EMAIL DE CONNEXION
      await sendLoginEmail(trimmed);

      console.log("📩 Email de connexion envoyé :", trimmed);

      // connexion utilisateur dans l’app
      onLogin(trimmed);
    } catch (err) {
      console.error("❌ Erreur envoi email login :", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 bg-mesh flex items-center justify-center p-4">
      {/* Glow background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-brand-400/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-500/15 border border-brand-500/20 mb-4">
            <span className="text-white font-bold text-lg">LXCO</span>
          </div>

          <h1 className="font-display text-3xl font-bold text-white">
            LXCO Tasks
          </h1>
          <p className="text-white/40 mt-2 text-sm">
            Organisez votre travail efficacement
          </p>
        </div>

        {/* Card */}
        <div className="card p-8">
          <h2 className="text-xl font-semibold text-white mb-1">
            Connexion
          </h2>
          <p className="text-white/40 text-sm mb-6">
            Entrez votre email pour accéder à vos tâches
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-white/50 mb-2">
                Adresse email
              </label>

              <input
                type="email"
                className="input"
                placeholder="moupita@exemple.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
              />

              {error && (
                <p className="text-red-400 text-xs mt-2">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex justify-center items-center py-3"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connexion...
                </span>
              ) : (
                "Accéder à mes tâches →"
              )}
            </button>
          </form>

          <p className="text-center text-xs text-white/25 mt-6">
            Vos données sont liées à votre email
          </p>
        </div>
      </motion.div>
    </div>
  );
}