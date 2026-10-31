import { allLessons, modules, pad, projects } from "../curriculum.js";
import { escapeHtml } from "../dom.js";
import { icon } from "../icons.js";
import { getState, lessonStatus } from "../state.js";
import { moduleCompletion, pageHeader, progressBar } from "./shared.js";

function nextLesson() {
  const { lastLessonId } = getState();
  const last = allLessons.find((lesson) => lesson.id === lastLessonId);
  if (last && lessonStatus(last.id) !== "completed") return last;
  return allLessons.find((lesson) => lessonStatus(lesson.id) !== "completed") ?? allLessons[0];
}

export function overviewView() {
  const lesson = nextLesson();
  const completedLessons = allLessons.filter((l) => lessonStatus(l.id) === "completed").length;
  const progress = getState().progress;
  const exercisesSolved = Object.values(progress).reduce((sum, entry) => sum + (entry.completedExerciseIds?.length ?? 0), 0);
  const resumed = getState().lastLessonId === lesson.id;

  const stats = [
    [completedLessons, `of ${allLessons.length} lessons completed`],
    [exercisesSolved, "exercises solved"],
    [0, `of ${projects.length} ${projects.length === 1 ? "project" : "projects"} built`],
    [modules.length, "modules in the path"],
  ];

  return {
    title: "Overview",
    html: `
      <div class="page">
        ${pageHeader("Your workspace", "Build your Python foundation.", "Learn a concept. Write a solution. Understand why it works.")}

        <section class="card card-feature" aria-labelledby="continue-title">
          <div class="row row-between">
            <span class="eyebrow">${resumed ? "Continue" : "Start here"}</span>
            <span class="meta">Module ${pad(lesson.moduleNumber)} · Lesson ${pad(lesson.lessonNumber)}</span>
          </div>
          <div class="stack">
            <h2 id="continue-title">${escapeHtml(lesson.title)}</h2>
            <p>${escapeHtml(lesson.outcome)}.</p>
          </div>
          <div class="row">
            <a class="btn btn-primary" href="#/lesson/${lesson.id}">${resumed ? "Resume" : "Start lesson"} ${icon("arrowRight")}</a>
            <span class="meta">${escapeHtml(lesson.moduleTitle)}</span>
          </div>
        </section>

        <section aria-label="Your progress" class="grid grid-4">
          ${stats.map(([value, label]) => `
            <div class="card stat">
              <span class="stat-value">${value}</span>
              <span class="stat-label">${label}</span>
            </div>`).join("")}
        </section>

        <section class="stack" aria-labelledby="path-title">
          <div class="row row-between">
            <h2 id="path-title" style="font-size:var(--text-lg)">Your learning path</h2>
            <a class="btn btn-ghost" href="#/path">View all ${icon("arrowRight")}</a>
          </div>
          <div class="panel">
            ${modules.slice(0, 4).map((module, i) => {
              const percent = moduleCompletion(module);
              return `
                <a class="module-row" href="#/path?open=${module.id}">
                  <span class="module-index">${pad(i + 1)}</span>
                  <span class="stack" style="gap:2px">
                    <span class="module-title">${escapeHtml(module.title)}</span>
                    <span class="meta">${escapeHtml(module.summary)}</span>
                  </span>
                  <span class="module-progress">${progressBar(percent, `${module.title} progress`)} ${percent}%</span>
                </a>`;
            }).join("")}
          </div>
        </section>
      </div>`,
  };
}
