// src/pages/Tasks.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../context/AppContext";
import TaskCard from "../components/tasks/TaskCard";
import { TaskModal } from "../components/tasks/TaskModal";

const FILTERS = ["Toutes", "En attente", "En cours", "Terminées"];
const STATUS_MAP = { "En attente": "pending", "En cours": "active", "Terminées": "done" };

export default function Tasks() {
  const { tasks, activeFolder, folders, getStats, loading } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [filter,    setFilter]    = useState("Toutes");
  const [search,    setSearch]    = useState("");

  const folder  = folders.find(f => f.id === activeFolder);
  const stats   = getStats(activeFolder);

  const folderTasks = tasks.filter(t => t.folderId === activeFolder);
  const filtered = folderTasks
    .filter(t => filter === "Toutes" || t.status === STATUS_MAP[filter])
    .filter(t => !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.description?.toLowerCase().includes(search.toLowerCase()));

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!activeFolder) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-4xl mb-4">📁</p>
          <h3 className="font-display text-lg font-semibold text-white mb-2">Aucun dossier</h3>
          <p className="text-white/40 text-sm">Créez un dossier dans la barre latérale pour commencer.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {folder && (
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
              style={{ background: `${folder.color}20`, border: `1px solid ${folder.color}30` }}>
              {folder.icon}
            </div>
          )}
          <div>
            <h1 className="font-display text-2xl font-bold text-white">{folder?.name || "Tâches"}</h1>
            <p className="text-white/40 text-sm">{stats.total} tâche{stats.total !== 1 ? "s" : ""}</p>
          </div>
        </div>
        <button className="btn-primary shrink-0" onClick={() => setShowModal(true)}>
          + Nouvelle tâche
        </button>
      </div>

      {/* Barre de progression */}
      {stats.total > 0 && (
        <motion.div layout className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-white/50">
              {stats.done} / {stats.total} tâches terminées
            </span>
            <span className="font-bold text-lg" style={{ color: folder?.color || "#3d6ef6" }}>
              {stats.pct}%
            </span>
          </div>
          <div className="progress-bar h-2">
            <motion.div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${stats.pct}%`,
                background: `linear-gradient(90deg, ${folder?.color || "#3d6ef6"}, ${folder?.color || "#3d6ef6"}aa)`,
              }}
            />
          </div>
          {stats.pct === 100 && stats.total > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 text-sm text-center text-emerald-400 font-semibold"
            >
              🎉 Dossier complété !
            </motion.p>
          )}
        </motion.div>
      )}

      {/* Recherche + Filtres */}
      <div className="flex gap-3 flex-wrap">
        <input
          className="input flex-1 min-w-48"
          placeholder="Rechercher une tâche..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex gap-1.5">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200
                ${filter === f
                  ? "bg-brand-500/20 text-brand-400 border border-brand-500/30"
                  : "text-white/40 hover:text-white hover:bg-white/6 border border-transparent"
                }`}
            >{f}</button>
          ))}
        </div>
      </div>

      {/* Liste */}
      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-4xl mb-3">✅</p>
            <p className="text-white/30 text-sm">
              {search ? "Aucune tâche ne correspond à votre recherche." : "Aucune tâche ici. Créez-en une !"}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            {filtered.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {showModal && <TaskModal onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </div>
  );
}
