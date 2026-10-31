import { challenges, exercises, lessonContent, projects } from "../../content/index.js";
import { allLessons, modules, pad } from "../curriculum.js";
import { escapeHtml } from "../dom.js";
import { icon } from "../icons.js";
import { completedMilestones, exerciseStats, getState, lessonStatus } from "../state.js";
import { moduleCompletion, pageHeader, progressBar } from "./shared.js";

const readyLessons = allLessons.filter((lesson) => lessonContent[lesson.id]);

function nextLesson() {
  const { lastLessonId } = getState();
  const last = readyLessons.find((lesson) => lesson.id === lastLessonId);
  if (last && lessonStatus(last.id) !== "completed") return last;
  return readyLessons.find((lesson) => lessonStatus(lesson.id) !== "completed") ?? readyLessons[0];
}

function suggestion() {
  const unsolvedChallenge = challenges.find((c) => !exerciseStats(`challenge:${c.id}`).passed);
  const solvedCount = exercises.filter((e) => exerciseStats(e.id).passed).length;
  if (solvedCount >= 9 && unsolvedChallenge) {
    return { text: `Try the “${unsolvedChallenge.title}” challenge to test yourself without hints.`, href: `#/challenges/${unsolvedChallenge.id}`, label: "Open challenge" };
  }
  const debug = exercises.find((e) => e.type === "debug" && !exerciseStats(e.id).passed);
  return debug
    ? { text: `Practise reading code: fix the bug in “${debug.title}”.`, href: `#/practice/${debug.id}`, label: "Open exercise" }
    : { text: "Every exercise is solved. Start the Expense Tracker project.", href: "#/projects/expense-tracker", label: "Open project" };
}

export function overviewView() {
  const lesson = nextLesson();
  const completedLessons = allLessons.filter((l) => ["completed", "review"].includes(lessonStatus(l.id))).length;
  const solved = exercises.filter((e) => exerciseStats(e.id).passed).length;
  const milestonesDone = projects.reduce((sum, p) => sum + completedMilestones(p.id).length, 0);
  const milestonesTotal = projects.reduce((sum, p) => sum + p.milestones.length, 0);
  const resumed = getState().lastLessonId === lesson.id;
  const next = suggestion();
  const lessonExercises = lessonContent[lesson.id].exercises.length;

  const stats = [
    [completedLessons, `of ${readyLessons.length} lessons completed`],
    [solved, `of ${exercises.length} exercises solved`],
    [`${milestonesDone}/${milestonesTotal}`, "project milestones"],
    [challenges.filter((c) => exerciseStats(`challenge:${c.id}`).passed).length, `of ${challenges.length} challenges solved`],
  ];

  return {
    title: "Overview",
    html: `
      <div class="page">
        ${pageHeader("Your workspace", "Build your Python foundation.", "Learn a concept. Write a solution. Understand why it works.")}

        <section class="card card-feature" aria-labelledby="continue-title">
          <div class="row row-between" style="flex-wrap:wrap">
            <span class="eyebrow">${resumed ? "Continue" : "Up next"}</span>
            <span class="meta">Module ${pad(lesson.moduleNumber)} · Lesson ${pad(lesson.lessonNumber)}</span>
          </div>
          <div class="stack">
            <h2 id="continue-title">${escapeHtml(lesson.title)}</h2>
            <p>${escapeHtml(lesson.outcome)}.</p>
          </div>
          <div class="row" style="flex-wrap:wrap">
            <a class="btn btn-primary" href="#/lesson/${lesson.id}">${resumed ? "Resume" : "Start lesson"} ${icon("arrowRight")}</a>
            <span class="meta">${lessonExercises} exercises · about ${lessonExercises * 4 + 2} minutes</span>
          </div>
        </section>

        <section aria-label="Your progress" class="grid grid-4">
          ${stats.map(([value, label]) => `
            <a class="card card-link stat" href="#/progress">
              <span class="stat-value">${value}</span>
              <span class="stat-label">${label}</span>
            </a>`).join("")}
        </section>

        <section class="card" aria-labelledby="suggest-title">
          <span class="eyebrow" id="suggest-title">Suggested next</span>
          <div class="row row-between" style="flex-wrap:wrap">
            <p style="color:var(--color-text)">${escapeHtml(next.text)}</p>
            <a class="btn btn-secondary" href="${next.href}">${next.label}</a>
          </div>
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
