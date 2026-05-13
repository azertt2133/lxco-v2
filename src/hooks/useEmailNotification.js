// src/hooks/useEmailNotification.js
import { useEffect, useRef } from "react";
import emailjs from "emailjs-com";

// ── Config EmailJS ─────────────────────────────────────────────────────────
// 1. Crée un compte sur https://www.emailjs.com
// 2. Crée un Service (Gmail par ex) → note le SERVICE_ID
// 3. Crée un Template avec les variables : {{task_name}}, {{folder_name}}, {{time_remaining}}, {{to_email}}
// 4. Note ton USER_ID (Public Key)
const EMAILJS_SERVICE_ID  = "service_abc123";
const EMAILJS_TEMPLATE_ID = "template_xyz789";
const EMAILJS_USER_ID     = "eYBZRXqTcWS-sXkzL";

const ALERT_BEFORE_MS = 5 * 60 * 1000; // 5 minutes en ms
const sentAlerts = new Set(); // éviter les doublons

export function useEmailNotification(tasks, folders, userEmail) {
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!userEmail || !tasks.length) return;

    const check = () => {
      const now = Date.now();
      tasks.forEach(task => {
        if (task.status === "done" || !task.dueDate || !task.duration) return;

        // Calculer l'heure de fin = dueDate + duration en minutes
        const dueTime   = new Date(task.dueDate).getTime();
        const endTime   = dueTime + (task.duration * 60 * 1000);
        const remaining = endTime - now;
        const alertKey  = `${task.id}_5min`;

        if (remaining > 0 && remaining <= ALERT_BEFORE_MS && !sentAlerts.has(alertKey)) {
          sentAlerts.add(alertKey);
          const folder = folders.find(f => f.id === task.folderId);
          const mins   = Math.round(remaining / 60000);

          emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            {
              to_email:      userEmail,
              task_name:     task.title,
              folder_name:   folder?.name || "Sans dossier",
              time_remaining: `${mins} minute${mins > 1 ? "s" : ""}`,
            },
            EMAILJS_USER_ID
          ).then(() => {
            console.log(`✉️ Alerte envoyée pour : ${task.title}`);
          }).catch(err => {
            console.error("Erreur envoi email:", err);
          });
        }
      });
    };

    intervalRef.current = setInterval(check, 60_000); // check chaque minute
    check(); // check immédiatement

    return () => clearInterval(intervalRef.current);
  }, [tasks, folders, userEmail]);
}
