// src/components/dashboard/Dashboard.jsx
import { motion } from "framer-motion";
import { useApp } from "../../context/AppContext";
import { formatTime } from "../../hooks/useTimer";

const StatCard = ({ label, value, sub, color = "brand" }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="card p-5"
  >
    <p className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-3">{label}</p>
    <p className={`font-display text-3xl font-bold text-${color}-400`}>{value}</p>
    {sub && <p className="text-xs text-white/25 mt-1">{sub}</p>}
  </motion.div>
);

export default function Dashboard({ setActivePage }) {
  const { globalStats, folders, tasks, getStats, setActiveFolder } = useApp();

  const totalElapsed = tasks.reduce((acc, t) => acc + (t.elapsed || 0), 0);

  return (
    <div className="p-8 space-y-8 animate-in">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">Vue d'ensemble de votre productivité</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total tâches"   value={globalStats.total}   sub="dans tous les dossiers" />
        <StatCard label="Terminées"      value={globalStats.done}    sub={`${globalStats.pct}% complété`}     color="emerald" />
        <StatCard label="En cours"       value={globalStats.active}  sub="timers actifs"          color="brand" />
        <StatCard label="Temps total"    value={formatTime(totalElapsed)} sub="temps enregistré"  color="amber" />
      </div>

      {/* Progression globale */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-white">Progression globale</h2>
          <span className="text-gradient font-bold text-lg">{globalStats.pct}%</span>
        </div>
        <div className="progress-bar h-2">
          <motion.div
            className="progress-fill h-full"
            initial={{ width: 0 }}
            animate={{ width: `${globalStats.pct}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        {globalStats.pct === 100 && (
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 text-center text-emerald-400 font-semibold"
          >
            🎉 Toutes les tâches sont terminées !
          </motion.p>
        )}
      </div>

      {/* Dossiers */}
      <div>
        <h2 className="font-display font-semibold text-white mb-4">Mes dossiers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {folders.map((folder, i) => {
            const stats = getStats(folder.id);
            return (
              <motion.div
                key={folder.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="card-hover p-5 cursor-pointer"
                onClick={() => { setActiveFolder(folder.id); setActivePage("tasks"); }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                      style={{ background: `${folder.color}20`, border: `1px solid ${folder.color}30` }}>
                      {folder.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm">{folder.name}</h3>
                      <p className="text-xs text-white/30">{stats.total} tâche{stats.total !== 1 ? "s" : ""}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold" style={{ color: folder.color }}>
                    {stats.pct}%
                  </span>
                </div>
                <div className="progress-bar">
                  <motion.div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${stats.pct}%`,
                      background: `linear-gradient(90deg, ${folder.color}, ${folder.color}aa)`,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.pct}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                  />
                </div>
                <div className="flex gap-3 mt-3 text-xs text-white/25">
                  <span>{stats.done} terminées</span>
                  <span>·</span>
                  <span>{stats.total - stats.done} restantes</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Tâches récentes */}
      {tasks.filter(t => t.status !== "done").length > 0 && (
        <div>
          <h2 className="font-display font-semibold text-white mb-4">En attente</h2>
          <div className="space-y-2">
            {tasks.filter(t => t.status !== "done").slice(0, 5).map(task => {
              const folder = folders.find(f => f.id === task.folderId);
              return (
                <div key={task.id} className="card p-4 flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: task.status === "active" ? "#3d6ef6" : "#f59e0b" }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">{task.title}</p>
                    {folder && <p className="text-xs text-white/30">{folder.icon} {folder.name}</p>}
                  </div>
                  {task.status === "active" && (
                    <span className="badge badge-active">En cours</span>
                  )}
                  {task.status === "pending" && (
                    <span className="badge badge-pending">En attente</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
