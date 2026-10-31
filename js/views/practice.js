import { exercises, findExercise, lessonContent } from "../../content/index.js";
import { exerciseTypes, modules } from "../curriculum.js";
import { codeBlock, escapeHtml, inline } from "../dom.js";
import { exerciseStats } from "../state.js";
import { mountSplit, splitHtml } from "../split.js";
import { codePane } from "../workspace.js";
import { pageHeader } from "./shared.js";

const statusOptions = [
  { id: "all", label: "Any status" },
  { id: "todo", label: "Not solved" },
  { id: "solved", label: "Solved" },
];

function matches(exercise, filters) {
  const stats = exerciseStats(exercise.id);
  const q = filters.q.toLowerCase();
  return (
    (filters.module === "all" || exercise.moduleId === filters.module) &&
    (filters.type === "all" || exercise.type === filters.type) &&
    (filters.difficulty === "all" || exercise.difficulty === filters.difficulty) &&
    (filters.status === "all" || (filters.status === "solved") === stats.passed) &&
    (!q || [exercise.title, exercise.prompt, exercise.lessonTitle, ...(lessonContent[exercise.lessonId]?.concept ? [lessonContent[exercise.lessonId].concept] : [])].some((text) => text.toLowerCase().includes(q)))
  );
}

function select(id, label, value, options) {
  return `
    <label class="filter">
      <span class="field-help">${label}</span>
      <select class="select" id="${id}">
        ${options.map((o) => `<option value="${o.id}" ${o.id === value ? "selected" : ""}>${escapeHtml(o.label)}</option>`).join("")}
      </select>
    </label>`;
}

export function practiceView({ query }) {
  const filters = {
    module: query.get("module") ?? "all",
    type: query.get("type") ?? "all",
    difficulty: query.get("difficulty") ?? "all",
    status: query.get("status") ?? "all",
    q: query.get("q") ?? "",
  };
  const moduleOptions = [{ id: "all", label: "All concepts" }, ...modules.filter((m) => exercises.some((e) => e.moduleId === m.id)).map((m) => ({ id: m.id, label: m.title }))];
  const list = exercises.filter((e) => matches(e, filters));
  const solved = exercises.filter((e) => exerciseStats(e.id).passed).length;

  return {
    title: "Practice lab",
    html: `
      <div class="page">
        ${pageHeader("Practice lab", "Practise any concept, in any order.", `${exercises.length} exercises · ${solved} solved. Debug and Trace exercises build the reading skills testers rely on.`)}
        <section class="grid grid-3" aria-label="Exercise types">
          ${exerciseTypes.map((t) => `
            <a class="card card-link" href="#/practice?type=${t.id}">
              <h3>${t.title}</h3>
              <p>${t.description}</p>
              <span class="meta">${exercises.filter((e) => e.type === t.id).length} exercises</span>
            </a>`).join("")}
        </section>
        <form class="filters" id="practice-filters" role="search" aria-label="Filter exercises">
          <label class="filter filter-grow">
            <span class="field-help">Search</span>
            <input class="input" id="f-q" type="search" value="${escapeHtml(filters.q)}" placeholder="e.g. return, slice, while" />
          </label>
          ${select("f-module", "Concept", filters.module, moduleOptions)}
          ${select("f-type", "Type", filters.type, [{ id: "all", label: "Any type" }, ...exerciseTypes.map((t) => ({ id: t.id, label: t.title }))])}
          ${select("f-difficulty", "Difficulty", filters.difficulty, [{ id: "all", label: "Any level" }, { id: "beginner", label: "Beginner" }, { id: "core", label: "Core" }])}
          ${select("f-status", "Status", filters.status, statusOptions)}
        </form>
        <p class="meta" role="status">${list.length} matching exercise${list.length === 1 ? "" : "s"}</p>
        <div class="panel">
          ${list.map((e) => {
            const stats = exerciseStats(e.id);
            return `
              <a class="lesson-row practice-row" href="#/practice/${e.id}">
                <span class="stack" style="gap:2px">
                  <span>${escapeHtml(e.title)}</span>
                  <p>${escapeHtml(e.moduleTitle)} · ${escapeHtml(e.lessonTitle)}</p>
                </span>
                <span class="row" style="gap:var(--space-2)">
                  <span class="badge">${exerciseTypes.find((t) => t.id === e.type).title}</span>
                  <span class="badge">${e.difficulty === "beginner" ? "Beginner" : "Core"}</span>
                </span>
                <span class="badge ${stats.passed ? "badge-success" : ""}">${stats.passed ? "Solved" : "Not solved"}</span>
              </a>`;
          }).join("") || `<p class="panel-body meta">No exercises match. Clear a filter to see more.</p>`}
        </div>
      </div>`,
    afterRender(root) {
      const form = root.querySelector("#practice-filters");
      const apply = () => {
        const params = new URLSearchParams();
        const values = { q: "#f-q", module: "#f-module", type: "#f-type", difficulty: "#f-difficulty", status: "#f-status" };
        for (const [key, selector] of Object.entries(values)) {
          const value = form.querySelector(selector).value.trim();
          if (value && value !== "all") params.set(key, value);
        }
        location.hash = `/practice${params.size ? `?${params}` : ""}`;
      };
      form.querySelectorAll("select").forEach((el) => el.addEventListener("change", apply));
      form.addEventListener("submit", (event) => (event.preventDefault(), apply()));
    },
  };
}

export function practiceExerciseView({ params }) {
  const exercise = findExercise(params.id);
  if (!exercise) return null;
  const content = lessonContent[exercise.lessonId];
  const index = exercises.indexOf(exercise);
  const next = exercises[index + 1];

  const pane = codePane({
    kind: exercise.type === "trace" ? "trace" : "exercise",
    item: exercise,
    key: exercise.id,
    eyebrow: "Practice",
    attempt: {
      lessonId: exercise.lessonId,
      lessonExerciseIds: content.exercises.map((e) => e.id),
      moduleId: exercise.moduleId,
      href: `#/practice/${exercise.id}`,
    },
    nextHref: next ? `#/practice/${next.id}` : "#/practice",
    nextLabel: next ? "Next exercise" : "Back to the lab",
  });

  const read = `
    <header class="lesson-header">
      <span class="eyebrow eyebrow-accent">${escapeHtml(exercise.moduleTitle)}</span>
      <h1>${escapeHtml(exercise.lessonTitle)}</h1>
    </header>
    <section class="lesson-section"><span class="eyebrow">The idea</span><p>${inline(content.concept)}</p></section>
    <section class="lesson-section"><span class="eyebrow">Syntax</span>${codeBlock(content.syntax, "Syntax")}</section>
    <div class="row" style="flex-wrap:wrap">
      <a class="btn btn-secondary btn-sm" href="#/lesson/${exercise.lessonId}">Open the full lesson</a>
      <a class="btn btn-ghost btn-sm" href="#/practice">Back to the lab</a>
    </div>`;

  return {
    title: exercise.title,
    breadcrumb: "Practice lab",
    layout: "workspace",
    html: splitHtml(read, pane.html, { readLabel: "Concept" }),
    afterRender(root) {
      mountSplit(root);
      return pane.mount(root);
    },
  };
}
