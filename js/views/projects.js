import { projects } from "../../content/index.js";
import { escapeHtml } from "../dom.js";
import { completedMilestones, toggleMilestone } from "../state.js";
import { mountSplit, splitHtml } from "../split.js";
import { codePane } from "../workspace.js";
import { pageHeader, progressBar } from "./shared.js";

function percentDone(project) {
  return Math.round((completedMilestones(project.id).length / project.milestones.length) * 100);
}

export function projectsView() {
  return {
    title: "Projects",
    html: `
      <div class="page">
        ${pageHeader("Projects", "Combine concepts into real programs.", "Build each project in milestones, from a basic version to a tested one. Tick a milestone when its tasks work.")}
        ${projects.map((p) => {
          const percent = percentDone(p);
          return `
            <a class="card card-link" href="#/projects/${p.id}">
              <div class="row row-between" style="flex-wrap:wrap">
                <h2>${escapeHtml(p.title)}</h2>
                <span class="badge">${escapeHtml(p.level)}</span>
              </div>
              <p>${escapeHtml(p.summary)}</p>
              <span class="meta">Concepts: ${p.concepts.map(escapeHtml).join(", ")}</span>
              <span class="module-progress">${progressBar(percent, `${p.title} milestones`)} ${percent}%</span>
            </a>`;
        }).join("")}
        <div class="notice" role="note"><span><strong>Browser sandbox.</strong> Projects run in your browser. Files you write go to a temporary virtual folder that resets when you reload, and there is no network access. Projects that need a real terminal are best finished locally with Python installed.</span></div>
      </div>`,
  };
}

export function projectView({ params }) {
  const project = projects.find((p) => p.id === params.id);
  if (!project) return null;
  const done = completedMilestones(project.id);

  const pane = codePane({
    kind: "project",
    item: { ...project, prompt: "Run your program with the values in the Input tab. Tick milestones on the left as you finish them." },
    key: `project:${project.id}`,
    eyebrow: project.level,
  });

  const read = `
    <header class="lesson-header">
      <span class="eyebrow eyebrow-accent">Project</span>
      <h1>${escapeHtml(project.title)}</h1>
      <p class="meta">${escapeHtml(project.summary)}</p>
    </header>
    <section class="lesson-section">
      <span class="eyebrow">Requirements</span>
      <ul class="plain-list">${project.requirements.map((r) => `<li>${escapeHtml(r)}</li>`).join("")}</ul>
    </section>
    <section class="lesson-section">
      <span class="eyebrow">Milestones</span>
      <ol class="milestones">
        ${project.milestones.map((m, i) => `
          <li class="milestone">
            <label class="row" style="align-items:flex-start">
              <input type="checkbox" data-milestone="${m.id}" ${done.includes(m.id) ? "checked" : ""} />
              <span class="stack" style="gap:2px">
                <strong>${String(i + 1).padStart(2, "0")} · ${escapeHtml(m.title)}</strong>
                <span class="meta">${escapeHtml(m.focus)}</span>
              </span>
            </label>
            <ul class="plain-list">${m.tasks.map((t) => `<li>${escapeHtml(t)}</li>`).join("")}</ul>
          </li>`).join("")}
      </ol>
    </section>
    <a class="btn btn-ghost btn-sm" href="#/projects">All projects</a>`;

  return {
    title: project.title,
    breadcrumb: "Projects",
    layout: "workspace",
    html: splitHtml(read, pane.html, { readLabel: "Brief" }),
    afterRender(root) {
      mountSplit(root);
      root.querySelectorAll("[data-milestone]").forEach((box) => {
        box.addEventListener("change", () => {
          const milestone = project.milestones.find((m) => m.id === box.dataset.milestone);
          toggleMilestone(project.id, milestone.id, milestone.title);
        });
      });
      return pane.mount(root);
    },
  };
}
