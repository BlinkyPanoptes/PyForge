import { allLessons, findLesson, pad } from "../curriculum.js";
import { escapeHtml, upcoming } from "../dom.js";
import { icon } from "../icons.js";
import { markVisited } from "../state.js";
import { pageHeader, statusBadge } from "./shared.js";

export function lessonView({ params }) {
  const lesson = findLesson(params.id);
  if (!lesson) return null;
  markVisited(lesson.id);

  const index = allLessons.indexOf(lesson);
  const prev = allLessons[index - 1];
  const next = allLessons[index + 1];

  return {
    title: lesson.title,
    breadcrumb: lesson.moduleTitle,
    activeLessonId: lesson.id,
    html: `
      <div class="page">
        ${pageHeader(`Module ${pad(lesson.moduleNumber)} · Lesson ${pad(lesson.lessonNumber)}`, lesson.title, `${lesson.outcome}.`)}
        <div class="row">${statusBadge(lesson.id)}<span class="meta">${escapeHtml(lesson.moduleTitle)}</span></div>
        <section class="card" aria-labelledby="concepts-title">
          <h2 id="concepts-title" class="eyebrow">Concepts covered</h2>
          <div class="row" style="flex-wrap:wrap;gap:var(--space-2)">
            ${lesson.concepts.map((c) => `<code class="badge">${escapeHtml(c)}</code>`).join("")}
          </div>
        </section>
        ${upcoming(2, "The split workspace (short reading pane, code editor and output) opens here. Python runs in your browser from phase 3.")}
        <nav class="row row-between" aria-label="Lesson navigation">
          ${prev ? `<a class="btn btn-secondary" href="#/lesson/${prev.id}">${icon("arrowLeft")} ${escapeHtml(prev.title)}</a>` : "<span></span>"}
          ${next ? `<a class="btn btn-secondary" href="#/lesson/${next.id}">${escapeHtml(next.title)} ${icon("arrowRight")}</a>` : ""}
        </nav>
      </div>`,
  };
}
