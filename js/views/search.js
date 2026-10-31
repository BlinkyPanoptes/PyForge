import { allLessons, modules, pad } from "../curriculum.js";
import { escapeHtml } from "../dom.js";
import { pageHeader } from "./shared.js";

function highlight(text, term) {
  const safe = escapeHtml(text);
  if (!term) return safe;
  const escapedTerm = escapeHtml(term).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return safe.replace(new RegExp(`(${escapedTerm})`, "gi"), "<mark>$1</mark>");
}

export function searchLessons(term) {
  const q = term.trim().toLowerCase();
  if (!q) return { lessons: [], modules: [] };
  return {
    modules: modules.filter((m) => m.title.toLowerCase().includes(q) || m.summary.toLowerCase().includes(q)),
    lessons: allLessons.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.outcome.toLowerCase().includes(q) ||
        l.concepts.some((c) => c.toLowerCase().includes(q))
    ),
  };
}

export function searchView({ query }) {
  const term = query.get("q") ?? "";
  const results = searchLessons(term);
  const count = results.lessons.length + results.modules.length;

  return {
    title: "Search",
    html: `
      <div class="page">
        ${pageHeader("Search", term ? `Results for “${term}”` : "Search lessons and concepts", term ? `${count} match${count === 1 ? "" : "es"}` : "Try a concept like return, mutable or KeyError.")}
        ${results.modules.length ? `
          <section class="stack" aria-labelledby="module-results">
            <h2 id="module-results" class="eyebrow">Modules</h2>
            <div class="panel">
              ${results.modules.map((m) => `
                <a class="module-row" href="#/path?open=${m.id}">
                  <span class="module-index">${pad(modules.indexOf(m) + 1)}</span>
                  <span class="stack" style="gap:2px"><span class="module-title">${highlight(m.title, term)}</span><span class="meta">${highlight(m.summary, term)}</span></span>
                </a>`).join("")}
            </div>
          </section>` : ""}
        ${results.lessons.length ? `
          <section class="stack" aria-labelledby="lesson-results">
            <h2 id="lesson-results" class="eyebrow">Lessons</h2>
            <div class="panel">
              ${results.lessons.map((l) => `
                <a class="lesson-row" style="padding-left:var(--space-5)" href="#/lesson/${l.id}">
                  <span class="stack" style="gap:2px"><span>${highlight(l.title, term)}</span><p>${highlight(l.outcome, term)} · ${l.concepts.map((c) => highlight(c, term)).join(", ")}</p></span>
                  <span class="meta">${escapeHtml(l.moduleTitle)}</span>
                </a>`).join("")}
            </div>
          </section>` : ""}
        ${term && !count ? `<div class="notice" role="status">Nothing matches “${escapeHtml(term)}”. Try a shorter word or a Python keyword.</div>` : ""}
      </div>`,
  };
}
