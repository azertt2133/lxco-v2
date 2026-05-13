// src/components/tasks/TaskModal.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "../../context/AppContext";

export function TaskModal({ task, onClose }) {
  const { createTask, updateTask } = useApp();
  const isEdit = !!task;

  const [form, setForm] = useState({
    title:       task?.title       || "",
    description: task?.description || "",
    dueDate:     task?.dueDate     || "",
    duration:    task?.duration    || "",
  });
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState({});

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: "" })); };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Le titre est requis";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    if (isEdit) {
      await updateTask(task.id, {
        title:       form.title.trim(),
        description: form.description.trim(),
        dueDate:     form.dueDate || null,
        duration:    form.duration ? parseInt(form.duration) : 0,
      });
    } else {
      await createTask({
        title:       form.title.trim(),
        description: form.description.trim(),
        dueDate:     form.dueDate || null,
        duration:    form.duration ? parseInt(form.duration) : 0,
      });
    }
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
        initial={{ scale: 0.92, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 10 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="card w-full max-w-lg p-6"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="font-display text-xl font-bold text-white mb-5">
          {isEdit ? "Modifier la tâche" : "Nouvelle tâche"}
        </h2>

        <div className="space-y-4">
          {/* Titre */}
          <div>
            <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">
              Titre <span className="text-red-400">*</span>
            </label>
            <input
              className={`input ${errors.title ? "border-red-500/50" : ""}`}
              placeholder="Que voulez-vous accomplir ?"
              value={form.title}
              onChange={e => set("title", e.target.value)}
              autoFocus
            />
            {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">Description</label>
            <textarea
              className="input resize-none"
              rows={3}
              placeholder="Détails, notes, contexte..."
              value={form.description}
              onChange={e => set("description", e.target.value)}
            />
          </div>

          {/* Date + Durée */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                Date limite
              </label>
              <input
                type="datetime-local"
                className="input"
                value={form.dueDate}
                onChange={e => set("dueDate", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                Durée (minutes)
              </label>
              <input
                type="number"
                className="input"
                placeholder="Ex: 45"
                min="1"
                value={form.duration}
                onChange={e => set("duration", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button className="btn-ghost flex-1 justify-center" onClick={onClose}>Annuler</button>
          <button
            className="btn-primary flex-1 justify-center"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Enregistrement..." : isEdit ? "Enregistrer" : "Créer la tâche"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
