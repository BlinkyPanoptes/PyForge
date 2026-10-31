import { projects } from "../curriculum.js";
import { escapeHtml, upcoming } from "../dom.js";
import { pageHeader } from "./shared.js";

export function projectsView() {
  return {
    title: "Projects",
    html: `
      <div class="page">
        ${pageHeader("Projects", "Combine concepts into real programs.", "Each project is built in milestones, from a basic version to a tested one.")}
        ${projects.map((p) => `
          <article class="card">
            <div class="row row-between" style="flex-wrap:wrap">
              <h2>${escapeHtml(p.title)}</h2>
              <span class="badge">${escapeHtml(p.level)}</span>
            </div>
            <p>${escapeHtml(p.summary)}</p>
            <span class="meta">Concepts: ${p.concepts.map(escapeHtml).join(", ")}</span>
            <h3 class="eyebrow" style="margin-top:var(--space-2)">Requirements</h3>
            <ul class="stack" style="margin:0;padding-left:var(--space-5);gap:var(--space-1);color:var(--color-text-muted);font-size:var(--text-sm)">
              ${p.requirements.map((r) => `<li>${escapeHtml(r)}</li>`).join("")}
            </ul>
          </article>`).join("")}
        ${upcoming(5, "Project workspaces with milestone tracking.")}
      </div>`,
  };
}
