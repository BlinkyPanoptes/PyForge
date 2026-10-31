// App state: settings and progress, persisted locally, with change subscribers.
import { load, save } from "./storage.js";

const defaultSettings = {
  editorFontSize: 14,
  tabSize: 4,
  autoRunOnLoad: false,
};

// progress[lessonId] = { status, completedExerciseIds, attemptCount, hintCount, lastAttemptAt, lastVisitedAt }
const state = {
  settings: { ...defaultSettings, ...load("settings", {}) },
  progress: load("progress", {}),
  lastLessonId: load("lastLessonId", null),
};

const listeners = new Set();

export function getState() {
  return state;
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify() {
  listeners.forEach((listener) => listener(state));
}

export function updateSettings(changes) {
  state.settings = { ...state.settings, ...changes };
  save("settings", state.settings);
  notify();
}

export function lessonStatus(lessonId) {
  return state.progress[lessonId]?.status ?? "not-started";
}

export function markVisited(lessonId) {
  const entry = state.progress[lessonId] ?? { status: "not-started", completedExerciseIds: [], attemptCount: 0, hintCount: 0 };
  entry.lastVisitedAt = new Date().toISOString();
  state.progress[lessonId] = entry;
  state.lastLessonId = lessonId;
  save("progress", state.progress);
  save("lastLessonId", lessonId);
}

export function resetProgress() {
  state.progress = {};
  state.lastLessonId = null;
  save("progress", state.progress);
  save("lastLessonId", null);
  notify();
}
