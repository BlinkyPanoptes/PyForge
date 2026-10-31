import { modules, pad } from "../curriculum.js";
import { escapeHtml } from "../dom.js";
import { lessonStatus } from "../state.js";
import { moduleCompletion, pageHeader, statusBadge } from "./shared.js";

const filters = [
  { id: "all", label: "All" },
  { id: "in-progress", label: "In progress" },
  { id: "completed", label: "Completed" },
];

function matchesFilter(lessonId, filter) {
  if (filter === "all") return true;
  return lessonStatus(lessonId) === filter;
}

export function pathView({ query }) {
  const filter = filters.some((f) => f.id === query.get("filter")) ? query.get("filter") : "all";
  const openId = query.get("open") ?? modules[0].id;
  const lessonCount = modules.reduce((sum, m) => sum + m.lessons.length, 0);

  const moduleHtml = modules
    .map((module, i) => {
      const lessons = module.lessons.filter((lesson) => matchesFilter(lesson.id, filter));
      if (filter !== "all" && lessons.length === 0) return "";
      const percent = moduleCompletion(module);
      const isOpen = module.id === openId || filter !== "all";
      return `
        <details class="panel module-card" id="module-${module.id}" ${isOpen ? "open" : ""}>
          <summary>
            <span class="module-index">${pad(i + 1)}</span>
            <span class="stack" style="gap:2px">
              <span class="module-title">${escapeHtml(module.title)}</span>
              <span class="meta">${escapeHtml(module.summary)} · ${module.lessons.length} lessons</span>
            </span>
            <span class="badge ${percent === 100 ? "badge-success" : ""}">${percent}% complete</span>
          </summary>
          <div>
            ${lessons.map((lesson, j) => `
              <a class="lesson-row" href="#/lesson/${lesson.id}">
                <span class="stack" style="gap:2px">
                  <span>${escapeHtml(lesson.title)}</span>
                  <p>${escapeHtml(lesson.outcome)}</p>
                </span>
                <span class="meta">Lesson ${pad(j + 1)}</span>
                ${statusBadge(lesson.id)}
              </a>`).join("")}
          </div>
        </details>`;
    })
    .join("");

  return {
    title: "Learning path",
    html: `
      <div class="page">
        ${pageHeader(`${modules.length} modules · ${lessonCount} lessons`, "Python curriculum", "A progressive path from first principles to testing your own code. Every module stays open to you; order is a suggestion, not a lock.")}
        <div class="tabs" role="group" aria-label="Filter lessons">
          ${filters.map((f) => `<button type="button" class="tab" data-filter="${f.id}" aria-pressed="${f.id === filter}">${f.label}</button>`).join("")}
        </div>
        <div class="stack">
          ${moduleHtml || `<div class="notice" role="status">No lessons match this filter yet. Lessons count as completed only after their exercises pass, not when you open them.</div>`}
        </div>
      </div>`,
    afterRender(root) {
      root.querySelectorAll("[data-filter]").forEach((button) => {
        button.addEventListener("click", () => {
          location.hash = `/path?filter=${button.dataset.filter}`;
        });
      });
      if (query.get("open")) {
        root.querySelector(`#module-${CSS.escape(openId)}`)?.scrollIntoView({ block: "start" });
      }
    },
  };
}
