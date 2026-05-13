// src/context/AppContext.jsx
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  collection, doc, onSnapshot, addDoc, updateDoc,
  deleteDoc, serverTimestamp, query, where, getDocs,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { toast } from "react-toastify";

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

export function AppProvider({ children, userEmail }) {
  const [folders,      setFolders]      = useState([]);
  const [tasks,        setTasks]        = useState([]);
  const [activeFolder, setActiveFolder] = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);

  // userId = email nettoyé, utilisé comme clé dans Firestore
  const userId = userEmail?.toLowerCase().trim();

  // ── Écoute Firestore en temps réel ──────────────────────────────────────
  useEffect(() => {
    if (!userId) { setLoading(false); return; }

    console.log("🔥 Connexion Firestore pour:", userId);
    setLoading(true);
    setError(null);

    // ── Dossiers ────────────────────────────────────────────────────────────
    // PAS de orderBy → pas besoin d'index composite
    const fQuery = query(
      collection(db, "folders"),
      where("userId", "==", userId)
    );

    const unsubFolders = onSnapshot(
      fQuery,
      (snap) => {
        console.log("📁 Dossiers reçus:", snap.docs.length);
        const data = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .sort((a, b) => {
            // Tri côté client par createdAt
            const ta = a.createdAt?.seconds || 0;
            const tb = b.createdAt?.seconds || 0;
            return ta - tb;
          });
        setFolders(data);
        // Sélectionner le premier dossier si aucun actif
        setActiveFolder(prev => {
          if (prev && data.find(f => f.id === prev)) return prev;
          return data[0]?.id || null;
        });
        setLoading(false);
      },
      (err) => {
        console.error("❌ Erreur dossiers:", err.code, err.message);
        setError(`Erreur dossiers: ${err.message}`);
        setLoading(false);
        toast.error("Erreur de connexion Firebase");
      }
    );

    // ── Tâches ──────────────────────────────────────────────────────────────
    const tQuery = query(
      collection(db, "tasks"),
      where("userId", "==", userId)
    );

    const unsubTasks = onSnapshot(
      tQuery,
      (snap) => {
        console.log("✅ Tâches reçues:", snap.docs.length);
        const data = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .sort((a, b) => {
            const ta = a.createdAt?.seconds || 0;
            const tb = b.createdAt?.seconds || 0;
            return ta - tb;
          });
        setTasks(data);
      },
      (err) => {
        console.error("❌ Erreur tâches:", err.code, err.message);
        toast.error("Erreur récupération tâches");
      }
    );

    return () => {
      console.log("🔌 Déconnexion Firestore");
      unsubFolders();
      unsubTasks();
    };
  }, [userId]);

  // ── DOSSIERS ─────────────────────────────────────────────────────────────
  const createFolder = async ({ name, icon, color }) => {
    if (!userId) return;
    try {
      console.log("➕ Création dossier:", { name, icon, color, userId });
      const docData = {
        userId,
        name:      name.trim(),
        icon:      icon      || "📋",
        color:     color     || "#3d6ef6",
        createdAt: serverTimestamp(),
      };
      const ref = await addDoc(collection(db, "folders"), docData);
      console.log("✅ Dossier créé avec ID:", ref.id);
      setActiveFolder(ref.id);
      toast.success(`Dossier "${name}" créé !`);
    } catch (err) {
      console.error("❌ Erreur création dossier:", err.code, err.message);
      toast.error(`Erreur: ${err.message}`);
    }
  };

  const deleteFolder = async (folderId) => {
    try {
      // Supprimer d'abord toutes les tâches du dossier
      const tq = query(collection(db, "tasks"), where("folderId", "==", folderId));
      const snap = await getDocs(tq);
      await Promise.all(snap.docs.map(d => deleteDoc(doc(db, "tasks", d.id))));
      await deleteDoc(doc(db, "folders", folderId));

      const remaining = folders.filter(f => f.id !== folderId);
      setActiveFolder(remaining[0]?.id || null);
      toast.success("Dossier supprimé");
    } catch (err) {
      console.error("❌ Erreur suppression dossier:", err);
      toast.error("Erreur suppression");
    }
  };

  // ── TÂCHES ────────────────────────────────────────────────────────────────
  const createTask = async (taskData) => {
    if (!userId || !activeFolder) {
      toast.error("Sélectionnez un dossier d'abord");
      return;
    }
    try {
      console.log("➕ Création tâche:", taskData);
      const docData = {
        userId,
        folderId:    activeFolder,
        title:       taskData.title.trim(),
        description: taskData.description?.trim() || "",
        dueDate:     taskData.dueDate     || null,
        duration:    taskData.duration    ? parseInt(taskData.duration) : 0,
        status:      "pending",
        elapsed:     0,
        running:     false,
        startedAt:   null,
        completedAt: null,
        createdAt:   serverTimestamp(),
      };
      const ref = await addDoc(collection(db, "tasks"), docData);
      console.log("✅ Tâche créée avec ID:", ref.id);
      toast.success("Tâche ajoutée !");
    } catch (err) {
      console.error("❌ Erreur création tâche:", err.code, err.message);
      toast.error(`Erreur: ${err.message}`);
    }
  };

  const updateTask = async (taskId, updates) => {
    try {
      await updateDoc(doc(db, "tasks", taskId), updates);
    } catch (err) {
      console.error("❌ Erreur updateTask:", err);
      toast.error("Erreur mise à jour");
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, "tasks", taskId));
      toast.success("Tâche supprimée");
    } catch (err) {
      console.error("❌ Erreur deleteTask:", err);
      toast.error("Erreur suppression");
    }
  };

  const toggleTask = async (task) => {
    const now = Date.now();
    if (task.status !== "done") {
      const elapsed = task.running
        ? (task.elapsed || 0) + Math.floor((now - task.startedAt) / 1000)
        : (task.elapsed || 0);
      await updateTask(task.id, {
        status: "done", completedAt: now, running: false, elapsed,
      });
    } else {
      await updateTask(task.id, { status: "pending", completedAt: null });
    }
  };

  const startTimer = async (task) => {
    await updateTask(task.id, {
      running: true, startedAt: Date.now(), status: "active"
    });
  };

  const pauseTimer = async (task) => {
    const elapsed = (task.elapsed || 0) + Math.floor((Date.now() - task.startedAt) / 1000);
    await updateTask(task.id, { running: false, elapsed, status: "pending" });
  };

  // ── STATS ─────────────────────────────────────────────────────────────────
  const getStats = useCallback((folderId) => {
    const ft   = tasks.filter(t => t.folderId === (folderId || activeFolder));
    const done = ft.filter(t => t.status === "done").length;
    return {
      total: ft.length,
      done,
      pct: ft.length > 0 ? Math.round((done / ft.length) * 100) : 0,
    };
  }, [tasks, activeFolder]);

  const globalStats = {
    total:   tasks.length,
    done:    tasks.filter(t => t.status === "done").length,
    active:  tasks.filter(t => t.status === "active").length,
    pending: tasks.filter(t => t.status === "pending").length,
    pct:     tasks.length > 0
      ? Math.round((tasks.filter(t => t.status === "done").length / tasks.length) * 100)
      : 0,
  };

  // ── Debug panel (dev only) ─────────────────────────────────────────────
  useEffect(() => {
    console.log("📊 State actuel →", {
      userId,
      folders: folders.length,
      tasks: tasks.length,
      activeFolder,
      loading,
      error,
    });
  }, [folders, tasks, activeFolder, loading]);

  return (
    <AppContext.Provider value={{
      folders, tasks, activeFolder, setActiveFolder,
      loading, error, userEmail, userId,
      createFolder, deleteFolder,
      createTask, updateTask, deleteTask,
      toggleTask, startTimer, pauseTimer,
      getStats, globalStats,
    }}>
      {children}
    </AppContext.Provider>
  );
}
