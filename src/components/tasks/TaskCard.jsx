// src/components/tasks/TaskCard.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../../context/AppContext";
import { useTimer, formatTime, formatDuration } from "../../hooks/useTimer";
import { TaskModal } from "./TaskModal";

const STATUS_CONFIG = {
  pending: { label: "En attente", cls: "badge-pending" },
  active:  { label: "En cours",   cls: "badge-active"  },
  done:    { label: "Terminée",   cls: "badge-done"    },
};

export default function TaskCard({ task }) {
  const { toggleTask, deleteTask, startTimer, pauseTimer } = useApp();
  const elapsed = useTimer(task);
  const [showEdit, setShowEdit] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const status = STATUS_CONFIG[task.status] || STATUS_CONFIG.pending;

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        className={`card-hover p-4 group ${task.status === "done" ? "opacity-60" : ""}`}
      >
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={() => toggleTask(task)}
            className={`mt-0.5 w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center transition-all duration-200
              ${task.status === "done"
                ? "bg-emerald-500 border-emerald-500"
                : "border-white/20 hover:border-brand-400"
              }`}
          >
            {task.status === "done" && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>

          {/* Contenu */}
          <div className="flex-1 min-w-0" onClick={() => setExpanded(v => !v)}>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className={`text-sm font-semibold text-white leading-tight ${task.status === "done" ? "line-through text-white/40" : ""}`}>
                {task.title}
              </h3>
              <span className={status.cls}>{status.label}</span>
              {task.duration > 0 && (
                <span className="text-xs text-white/25 font-mono">{formatDuration(task.duration)}</span>
              )}
            </div>

            {/* Description & détails (expandable) */}
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  {task.description && (
                    <p className="text-xs text-white/40 mt-1 leading-relaxed">{task.description}</p>
                  )}
                  {task.dueDate && (
                    <p className="text-xs text-white/30 mt-1">
                      📅 {new Date(task.dueDate).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Timer */}
            {(elapsed > 0 || task.status === "active") && (
              <div className="mt-2 flex items-center gap-1.5">
                <span className={`text-xs font-mono ${task.status === "active" ? "text-brand-400 animate-pulse-slow" : task.status === "done" ? "text-emerald-400" : "text-white/30"}`}>
                  ⏱ {task.status === "done" ? "Réalisé en" : task.status === "active" ? "En cours" : "Pausé"} : {formatTime(elapsed)}
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Timer start/pause */}
            {task.status !== "done" && (
              !task.running
                ? <button
                    onClick={() => startTimer(task)}
                    className="w-7 h-7 rounded-lg bg-brand-500/15 text-brand-400 hover:bg-brand-500/25 transition-all text-xs flex items-center justify-center"
                    title="Démarrer"
                  >▶</button>
                : <button
                    onClick={() => pauseTimer(task)}
                    className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 transition-all text-xs flex items-center justify-center"
                    title="Pause"
                  >⏸</button>
            )}

            <button
              onClick={() => setShowEdit(true)}
              className="w-7 h-7 rounded-lg bg-white/5 text-white/30 hover:text-white hover:bg-white/10 transition-all text-xs flex items-center justify-center"
              title="Modifier"
            >✏️</button>

            <button
              onClick={() => deleteTask(task.id)}
              className="w-7 h-7 rounded-lg bg-white/5 text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all text-xs flex items-center justify-center"
              title="Supprimer"
            >🗑</button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showEdit && <TaskModal task={task} onClose={() => setShowEdit(false)} />}
      </AnimatePresence>
    </>
  );
}
