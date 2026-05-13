// src/components/folders/FolderModal.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "../../context/AppContext";

const ICONS  = ["📋","🏋️","💼","🎯","📚","🎨","🚀","🏠","🎮","💡","🧘","✈️","🔬","🍕","💰","🌱"];
const COLORS = ["#3d6ef6","#10b981","#f59e0b","#ef4444","#8b5cf6","#ec4899","#06b6d4","#84cc16"];

export function FolderModal({ onClose }) {
  const { createFolder } = useApp();
  const [name,  setName]  = useState("");
  const [icon,  setIcon]  = useState("📋");
  const [color, setColor] = useState("#3d6ef6");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setLoading(true);
    await createFolder({ name: name.trim(), icon, color });
    setLoading(false);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="card w-full max-w-md p-6"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="font-display text-xl font-bold text-white mb-5">Nouveau dossier</h2>

        {/* Nom */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Nom</label>
          <input
            className="input"
            placeholder="Ex: Travail, Sport, Personnel..."
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            autoFocus
          />
        </div>

        {/* Icône */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Icône</label>
          <div className="flex flex-wrap gap-2">
            {ICONS.map(ic => (
              <button
                key={ic}
                onClick={() => setIcon(ic)}
                className={`w-9 h-9 rounded-lg text-lg transition-all duration-150
                  ${icon === ic
                    ? "bg-brand-500/20 border border-brand-500/40 scale-110"
                    : "bg-white/5 border border-white/10 hover:bg-white/10"
                  }`}
              >{ic}</button>
            ))}
          </div>
        </div>

        {/* Couleur */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Couleur</label>
          <div className="flex gap-2 flex-wrap">
            {COLORS.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-7 h-7 rounded-full transition-all duration-150
                  ${color === c ? "scale-125 ring-2 ring-white/40 ring-offset-2 ring-offset-surface-800" : "hover:scale-110"}`}
                style={{ background: c }}
              />
            ))}
          </div>
        </div>

        {/* Aperçu */}
        <div className="mb-6 p-3 rounded-xl bg-white/3 border border-white/8 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
            style={{ background: `${color}20`, border: `1px solid ${color}30` }}>
            {icon}
          </div>
          <span className="text-sm text-white font-medium">{name || "Nom du dossier"}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button className="btn-ghost flex-1 justify-center" onClick={onClose}>Annuler</button>
          <button
            className="btn-primary flex-1 justify-center"
            onClick={handleSubmit}
            disabled={!name.trim() || loading}
          >
            {loading ? "Création..." : "Créer le dossier"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
