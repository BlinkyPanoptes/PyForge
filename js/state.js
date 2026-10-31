// App state: settings, progress and saved code, persisted locally, with change subscribers.
import { load, save } from "./storage.js";

const defaultSettings = {
  editorFontSize: 14,
  tabSize: 4,
};

// progress[lessonId] = { status, completedExerciseIds, attemptCount, hintCount, lastAttemptAt, lastVisitedAt }
// exercises[exerciseId] = { attempts, hints, passed, passedFirstTry, revealed, lastAttemptAt }
// Editor buffers live under their own key so unfinished work never affects completion status.
const state = {
  settings: { ...defaultSettings, ...load("settings", {}) },
  progress: load("progress", {}),
  exercises: load("exercises", {}),
  buffers: load("buffers", {}),
  errors: load("errors", {}), // errors[moduleId][errorType] = count
  milestones: load("milestones", {}), // milestones[projectId] = [milestoneId, ...]
  activity: load("activity", []),
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

function persist(...keys) {
  keys.forEach((key) => save(key, state[key]));
}

export function updateSettings(changes) {
  state.settings = { ...state.settings, ...changes };
  persist("settings");
  notify();
}

// ---------- Lessons ----------
function lessonEntry(lessonId) {
  state.progress[lessonId] ??= { status: "not-started", completedExerciseIds: [], attemptCount: 0, hintCount: 0 };
  return state.progress[lessonId];
}

export function lessonStatus(lessonId) {
  return state.progress[lessonId]?.status ?? "not-started";
}

export function markVisited(lessonId) {
  lessonEntry(lessonId).lastVisitedAt = new Date().toISOString();
  state.lastLessonId = lessonId;
  persist("progress");
  save("lastLessonId", lessonId);
}

// ---------- Exercises ----------
export function exerciseStats(exerciseId) {
  return state.exercises[exerciseId] ?? { attempts: 0, hints: 0, passed: false, passedFirstTry: false };
}

function exerciseEntry(exerciseId) {
  state.exercises[exerciseId] ??= { attempts: 0, hints: 0, passed: false, passedFirstTry: false };
  return state.exercises[exerciseId];
}

function updateLessonStatus(entry, totalExercises, lessonExerciseIds) {
  const done = lessonExerciseIds.filter((id) => entry.completedExerciseIds.includes(id)).length;
  if (done < totalExercises) {
    entry.status = "in-progress";
    return;
  }
  // Completed, but flag for review when most exercises needed help.
  const helped = lessonExerciseIds.filter((id) => {
    const stats = exerciseStats(id);
    return stats.hints >= 2 || stats.revealed || stats.attempts >= 4;
  }).length;
  entry.status = helped * 2 > totalExercises ? "review" : "completed";
}

/**
 * Record one Check of an exercise.
 * @param {{exerciseId: string, lessonId?: string, lessonExerciseIds?: string[], moduleId?: string, passed: boolean, errorType?: string, title: string, href: string}} attempt
 */
export function recordAttempt(attempt) {
  const now = new Date().toISOString();
  const stats = exerciseEntry(attempt.exerciseId);
  const firstPass = attempt.passed && !stats.passed;
  stats.attempts += 1;
  stats.lastAttemptAt = now;
  if (firstPass) {
    stats.passed = true;
    stats.passedFirstTry = stats.attempts === 1 && stats.hints === 0 && !stats.revealed;
  }

  if (attempt.lessonId) {
    const entry = lessonEntry(attempt.lessonId);
    entry.attemptCount += 1;
    entry.lastAttemptAt = now;
    if (attempt.passed && !entry.completedExerciseIds.includes(attempt.exerciseId)) {
      entry.completedExerciseIds.push(attempt.exerciseId);
    }
    updateLessonStatus(entry, attempt.lessonExerciseIds.length, attempt.lessonExerciseIds);
  }

  if (!attempt.passed && attempt.errorType && attempt.moduleId) {
    state.errors[attempt.moduleId] ??= {};
    state.errors[attempt.moduleId][attempt.errorType] = (state.errors[attempt.moduleId][attempt.errorType] ?? 0) + 1;
  }

  if (firstPass) logActivity(`Solved “${attempt.title}”${stats.passedFirstTry ? " on the first try" : ""}`, attempt.href);
  persist("exercises", "progress", "errors");
  notify();
  return { firstPass, stats };
}

export function recordHint(exerciseId, lessonId) {
  exerciseEntry(exerciseId).hints += 1;
  if (lessonId) lessonEntry(lessonId).hintCount += 1;
  persist("exercises", "progress");
}

export function recordReveal(exerciseId) {
  exerciseEntry(exerciseId).revealed = true;
  persist("exercises");
}

// ---------- Saved code ----------
export function getBuffer(key) {
  return state.buffers[key];
}

let bufferTimer = null;
export function saveBuffer(key, code) {
  state.buffers[key] = code;
  clearTimeout(bufferTimer);
  bufferTimer = setTimeout(() => persist("buffers"), 300);
}

export function clearBuffer(key) {
  delete state.buffers[key];
  persist("buffers");
}

// ---------- Projects ----------
export function completedMilestones(projectId) {
  return state.milestones[projectId] ?? [];
}

export function toggleMilestone(projectId, milestoneId, title) {
  const list = new Set(completedMilestones(projectId));
  if (list.has(milestoneId)) list.delete(milestoneId);
  else {
    list.add(milestoneId);
    logActivity(`Finished milestone “${title}”`, `#/projects/${projectId}`);
  }
  state.milestones[projectId] = [...list];
  persist("milestones");
  notify();
}

// ---------- Activity ----------
export function logActivity(text, href) {
  state.activity.unshift({ text, href, at: new Date().toISOString() });
  state.activity = state.activity.slice(0, 50);
  persist("activity");
}

export function resetProgress() {
  Object.assign(state, { progress: {}, exercises: {}, buffers: {}, errors: {}, milestones: {}, activity: [], lastLessonId: null });
  persist("progress", "exercises", "buffers", "errors", "milestones", "activity");
  save("lastLessonId", null);
  notify();
}
