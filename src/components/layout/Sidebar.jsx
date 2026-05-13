// src/components/layout/Sidebar.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../../context/AppContext";
import { FolderModal } from "../folders/FolderModal";

const ICONS_MAP = { "📋":"📋","🏋️":"🏋️","💼":"💼","🎯":"🎯","📚":"📚","🎨":"🎨","🚀":"🚀","🏠":"🏠","🎮":"🎮","💡":"💡","🧘":"🧘","✈️":"✈️" };

export default function Sidebar({ activePage, setActivePage }) {
  const { folders, activeFolder, setActiveFolder, getStats, globalStats, userEmail, deleteFolder } = useApp();
  const [showFolderModal, setShowFolderModal] = useState(false);

  return (
    <>
      <aside className="w-64 shrink-0 h-screen sticky top-0 flex flex-col bg-surface-900 border-r border-white/6 overflow-y-auto">
        {/* Logo */}
        <div className="p-5 border-b border-white/6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-500/15 border border-brand-500/20 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
                <rect x="4" y="8" width="24" height="3" rx="1.5" fill="#6090fa"/>
                <rect x="4" y="14.5" width="18" height="3" rx="1.5" fill="#3d6ef6"/>
                <rect x="4" y="21" width="12" height="3" rx="1.5" fill="#2550eb"/>
              </svg>
            </div>
            <span className="font-display font-bold text-white text-lg">LXCO</span>
          </div>
        </div>

        {/* User */}
        <div className="px-4 py-3 border-b border-white/6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-xs font-bold text-brand-400">
              {userEmail?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-white/40 truncate">{userEmail}</p>
            </div>
          </div>
        </div>

        {/* Nav principale */}
        <nav className="p-3 space-y-1">
          <button
            className={`sidebar-link w-full ${activePage === "dashboard" ? "active" : ""}`}
            onClick={() => setActivePage("dashboard")}
          >
            <span className="text-base">📊</span> Dashboard
          </button>
          <button
            className={`sidebar-link w-full ${activePage === "tasks" ? "active" : ""}`}
            onClick={() => setActivePage("tasks")}
          >
            <span className="text-base">✅</span> Toutes les tâches
          </button>
        </nav>

        {/* Stats globales */}
        <div className="px-4 py-3 mx-3 mb-2 rounded-xl bg-white/3 border border-white/6">
          <div className="flex justify-between text-xs text-white/40 mb-2">
            <span>Progression globale</span>
            <span className="text-brand-400 font-semibold">{globalStats.pct}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${globalStats.pct}%` }} />
          </div>
          <div className="flex gap-3 mt-2 text-xs text-white/30">
            <span>{globalStats.done} terminées</span>
            <span>·</span>
            <span>{globalStats.total - globalStats.done} restantes</span>
          </div>
        </div>

        {/* Dossiers */}
        <div className="px-3 mb-2">
          <div className="flex items-center justify-between px-1 mb-2">
            <span className="text-xs font-semibold text-white/30 uppercase tracking-wider">Dossiers</span>
            <button
              onClick={() => setShowFolderModal(true)}
              className="text-white/30 hover:text-brand-400 transition-colors text-lg leading-none"
              title="Nouveau dossier"
            >+</button>
          </div>

          <div className="space-y-0.5">
            {folders.map(folder => {
              const stats = getStats(folder.id);
              const isActive = activePage === "tasks" && activeFolder === folder.id;
              return (
                <motion.div
                  key={folder.id}
                  layout
                  className={`group flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200
                    ${isActive
                      ? "bg-brand-500/15 border border-brand-500/20 text-white"
                      : "text-white/50 hover:text-white hover:bg-white/6"
                    }`}
                  onClick={() => { setActiveFolder(folder.id); setActivePage("tasks"); }}
                >
                  <span className="text-base shrink-0">{folder.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium truncate">{folder.name}</span>
                      <span className="text-xs text-white/25 shrink-0 ml-1">{stats.done}/{stats.total}</span>
                    </div>
                    {stats.total > 0 && (
                      <div className="progress-bar mt-1">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${stats.pct}%`,
                            background: folder.color || "#3d6ef6",
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      if (window.confirm(`Supprimer "${folder.name}" ?`)) deleteFolder(folder.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all text-xs shrink-0"
                  >✕</button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Déconnexion */}
        <div className="mt-auto p-3 border-t border-white/6">
          <button
            className="btn-ghost w-full justify-center text-xs"
            onClick={() => {
              localStorage.removeItem("lxco_user_email");
              window.location.reload();
            }}
          >
            ← Changer de compte
          </button>
        </div>
      </aside>

      <AnimatePresence>
        {showFolderModal && <FolderModal onClose={() => setShowFolderModal(false)} />}
      </AnimatePresence>
    </>
  );
}
