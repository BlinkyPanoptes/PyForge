import { escapeHtml } from "../dom.js";
import { lessonStatus } from "../state.js";

export const statusLabels = {
  "not-started": { text: "Not started", badge: "" },
  "in-progress": { text: "In progress", badge: "badge-warning" },
  completed: { text: "Completed", badge: "badge-success" },
  review: { text: "Review recommended", badge: "badge-accent" },
};

export function statusBadge(lessonId) {
  const { text, badge } = statusLabels[lessonStatus(lessonId)];
  return `<span class="badge ${badge}">${text}</span>`;
}

export function moduleCompletion(module) {
  const done = module.lessons.filter((lesson) => lessonStatus(lesson.id) === "completed").length;
  return Math.round((done / module.lessons.length) * 100);
}

export function progressBar(percent, label) {
  return `<div class="progress" role="progressbar" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100" aria-label="${escapeHtml(label)}"><div class="progress-fill" style="width:${percent}%"></div></div>`;
}

export function pageHeader(eyebrow, title, description) {
  return `
    <header class="page-header">
      ${eyebrow ? `<span class="eyebrow eyebrow-accent">${escapeHtml(eyebrow)}</span>` : ""}
      <h1>${escapeHtml(title)}</h1>
      ${description ? `<p>${escapeHtml(description)}</p>` : ""}
    </header>`;
}
