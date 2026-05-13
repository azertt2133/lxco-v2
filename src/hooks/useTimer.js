// src/hooks/useTimer.js
import { useState, useEffect, useRef } from "react";

export function useTimer(task) {
  const [display, setDisplay] = useState(task?.elapsed || 0);
  const ref = useRef(null);

  useEffect(() => {
    if (task?.running && task?.status !== "done") {
      ref.current = setInterval(() => {
        setDisplay((task.elapsed || 0) + Math.floor((Date.now() - task.startedAt) / 1000));
      }, 1000);
    } else {
      clearInterval(ref.current);
      setDisplay(task?.elapsed || 0);
    }
    return () => clearInterval(ref.current);
  }, [task?.running, task?.status, task?.elapsed, task?.startedAt]);

  return display;
}

export function formatTime(seconds) {
  if (!seconds) return "0s";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${String(m).padStart(2,"0")}m`;
  if (m > 0) return `${m}m ${String(s).padStart(2,"0")}s`;
  return `${s}s`;
}

export function formatDuration(minutes) {
  if (!minutes) return "";
  if (minutes < 60) return `${minutes}min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}
