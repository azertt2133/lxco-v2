// src/components/ui/Loader.jsx
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const STEPS = [
  { text: "Connexion à Firebase...",         pct: 20 },
  { text: "Récupération de vos dossiers...", pct: 45 },
  { text: "Chargement de vos tâches...",     pct: 70 },
  { text: "Synchronisation des données...",  pct: 88 },
  { text: "Presque prêt...",                 pct: 96 },
];

export default function Loader({ visible }) {
  const [step,     setStep]     = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!visible) { setStep(0); setProgress(0); return; }
    let i = 0;
    const t = setInterval(() => {
      i = Math.min(i + 1, STEPS.length - 1);
      setStep(i);
      setProgress(STEPS[i].pct);
      if (i === STEPS.length - 1) clearInterval(t);
    }, 700);
    setProgress(STEPS[0].pct);
    return () => clearInterval(t);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "#080a10",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: 0,
          }}
        >
          {/* Ambient glows */}
          <div style={{
            position: "absolute", top: "25%", left: "50%", transform: "translateX(-50%)",
            width: 500, height: 500, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(61,110,246,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}/>
          <div style={{
            position: "absolute", bottom: "20%", left: "25%",
            width: 300, height: 300, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(96,144,250,0.07) 0%, transparent 70%)",
            pointerEvents: "none",
          }}/>

          {/* Logo animé */}
          <motion.div
            animate={{ scale: [1, 1.06, 1], opacity: [0.9, 1, 0.9] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 80, height: 80, borderRadius: 22,
              background: "rgba(61,110,246,0.12)",
              border: "1px solid rgba(61,110,246,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 24,
              boxShadow: "0 0 40px rgba(61,110,246,0.2)",
            }}
          >
            <svg width="38" height="38" viewBox="0 0 32 32" fill="none">
              <motion.rect
                x="4" y="7" width="24" height="3.5" rx="1.75" fill="#6090fa"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
              />
              <motion.rect
                x="4" y="14.25" width="18" height="3.5" rx="1.75" fill="#3d6ef6"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
              />
              <motion.rect
                x="4" y="21.5" width="12" height="3.5" rx="1.75" fill="#2550eb"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
              />
            </svg>
          </motion.div>

          {/* Titre */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ fontSize: 26, fontWeight: 800, color: "white", marginBottom: 6, letterSpacing: -0.5 }}
          >
            LXCO Tasks
          </motion.h1>

          {/* Message dynamique */}
          <div style={{ height: 24, marginBottom: 32, overflow: "hidden" }}>
            <AnimatePresence mode="wait">
              <motion.p
                key={step}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textAlign: "center" }}
              >
                {STEPS[step].text}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Barre de progression */}
          <div style={{
            width: 240, height: 3,
            background: "rgba(255,255,255,0.07)",
            borderRadius: 999, overflow: "hidden",
          }}>
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{
                height: "100%", borderRadius: 999,
                background: "linear-gradient(90deg, #2550eb, #6090fa)",
                boxShadow: "0 0 12px rgba(61,110,246,0.6)",
              }}
            />
          </div>

          {/* Pourcentage */}
          <motion.p
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 10, fontFamily: "monospace" }}
          >
            {progress}%
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
