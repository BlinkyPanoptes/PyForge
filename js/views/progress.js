import { challenges, exercises, lessonContent, projects } from "../../content/index.js";
import { allLessons, findModule, modules } from "../curriculum.js";
import { escapeHtml } from "../dom.js";
import { completedMilestones, exerciseStats, getState, lessonStatus } from "../state.js";
import { moduleCompletion, pageHeader, progressBar, statusBadge } from "./shared.js";

function timeAgo(iso) {
  const minutes = Math.round((Date.now() - new Date(iso)) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  return `${Math.round(hours / 24)} d ago`;
}

export function progressView() {
  const { errors, activity } = getState();
  const solved = exercises.filter((e) => exerciseStats(e.id).passed);
  const firstTry = solved.filter((e) => exerciseStats(e.id).passedFirstTry).length;
  const withHelp = solved.length - firstTry;
  const challengesSolved = challenges.filter((c) => exerciseStats(`challenge:${c.id}`).passed).length;
  const availableModules = modules.filter((m) => m.lessons.some((l) => lessonContent[l.id]));

  // Review: lessons flagged by status, plus unsolved exercises with several attempts.
  const review = allLessons.filter((l) => lessonStatus(l.id) === "review");
  const struggling = exercises.filter((e) => {
    const s = exerciseStats(e.id);
    return !s.passed && s.attempts >= 3;
  });

  const errorRows = Object.entries(errors)
    .flatMap(([moduleId, counts]) => Object.entries(counts).map(([type, count]) => ({ module: findModule(moduleId)?.title ?? moduleId, type, count })))
    .filter((row) => row.count >= 2)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return {
    title: "Progress",
    html: `
      <div class="page">
        ${pageHeader("Progress", "What you know, and what needs another look.", "Based on exercises you solved, not on pages you opened or time spent.")}

        <section class="grid grid-4" aria-label="Summary">
          <div class="card stat"><span class="stat-value">${solved.length}</span><span class="stat-label">of ${exercises.length} exercises solved</span></div>
          <div class="card stat"><span class="stat-value">${firstTry}</span><span class="stat-label">solved first try, no hints</span></div>
          <div class="card stat"><span class="stat-value">${withHelp}</span><span class="stat-label">solved after retries or hints</span></div>
          <div class="card stat"><span class="stat-value">${challengesSolved}</span><span class="stat-label">of ${challenges.length} challenges solved</span></div>
        </section>

        <section class="stack" aria-labelledby="review-title">
          <h2 id="review-title" style="font-size:var(--text-lg)">Recommended review</h2>
          ${review.length || struggling.length ? `
            <div class="panel">
              ${review.map((l) => `
                <a class="lesson-row practice-row" href="#/lesson/${l.id}">
                  <span class="stack" style="gap:2px"><span>${escapeHtml(l.title)}</span><p>Completed with a lot of help. Redo the exercises without hints.</p></span>
                  <span></span>${statusBadge(l.id)}
                </a>`).join("")}
              ${struggling.map((e) => `
                <a class="lesson-row practice-row" href="#/practice/${e.id}">
                  <span class="stack" style="gap:2px"><span>${escapeHtml(e.title)}</span><p>${exerciseStats(e.id).attempts} attempts so far. Reread “${escapeHtml(e.lessonTitle)}”, then try again.</p></span>
                  <span></span><span class="badge badge-warning">Keep going</span>
                </a>`).join("")}
            </div>` : `<p class="notice">Nothing to review yet. Lessons you finish with lots of hints or retries will show up here.</p>`}
        </section>

        ${errorRows.length ? `
          <section class="stack" aria-labelledby="errors-title">
            <h2 id="errors-title" style="font-size:var(--text-lg)">Errors you hit most</h2>
            <div class="panel">
              <table class="table">
                <thead><tr><th scope="col">Error</th><th scope="col">Where</th><th scope="col">Times</th></tr></thead>
                <tbody>${errorRows.map((r) => `<tr><td><code>${escapeHtml(r.type === "WrongAnswer" ? "Wrong answer" : r.type)}</code></td><td>${escapeHtml(r.module)}</td><td>${r.count}</td></tr>`).join("")}</tbody>
              </table>
            </div>
          </section>` : ""}

        <section class="stack" aria-labelledby="modules-title">
          <h2 id="modules-title" style="font-size:var(--text-lg)">Modules</h2>
          <div class="panel">
            ${availableModules.map((m) => {
              const percent = moduleCompletion(m);
              return `
                <a class="module-row" href="#/path?open=${m.id}">
                  <span class="module-index">${String(modules.indexOf(m) + 1).padStart(2, "0")}</span>
                  <span class="module-title">${escapeHtml(m.title)}</span>
                  <span class="module-progress">${progressBar(percent, `${m.title} progress`)} ${percent}%</span>
                </a>`;
            }).join("")}
          </div>
        </section>

        <section class="stack" aria-labelledby="projects-title">
          <h2 id="projects-title" style="font-size:var(--text-lg)">Project milestones</h2>
          <div class="panel panel-body">
            ${projects.map((p) => `<p><a href="#/projects/${p.id}">${escapeHtml(p.title)}</a>: ${completedMilestones(p.id).length} of ${p.milestones.length} milestones</p>`).join("")}
          </div>
        </section>

        <section class="stack" aria-labelledby="activity-title">
          <h2 id="activity-title" style="font-size:var(--text-lg)">Recent activity</h2>
          ${activity.length ? `
            <ul class="panel activity">
              ${activity.slice(0, 15).map((a) => `<li><a href="${escapeHtml(a.href)}">${escapeHtml(a.text)}</a><span class="meta">${timeAgo(a.at)}</span></li>`).join("")}
            </ul>` : `<p class="notice">No activity yet. Solve an exercise to start your history.</p>`}
        </section>
      </div>`,
  };
}
