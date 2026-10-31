import { lessonContent } from "../../content/index.js";
import { allLessons, findLesson, pad } from "../curriculum.js";
import { codeBlock, escapeHtml, inline } from "../dom.js";
import { icon } from "../icons.js";
import { runCode } from "../runtime-client.js";
import { exerciseStats, markVisited } from "../state.js";
import { mountSplit, splitHtml } from "../split.js";
import { codePane, normalizeOutput } from "../workspace.js";
import { pageHeader, statusBadge } from "./shared.js";

function lessonNav(lesson) {
  const index = allLessons.indexOf(lesson);
  const prev = allLessons[index - 1];
  const next = allLessons[index + 1];
  return `
    <nav class="row row-between lesson-nav" aria-label="Lesson navigation">
      ${prev ? `<a class="btn btn-ghost" href="#/lesson/${prev.id}">${icon("arrowLeft")} Previous</a>` : "<span></span>"}
      ${next ? `<a class="btn btn-ghost" href="#/lesson/${next.id}">Next lesson ${icon("arrowRight")}</a>` : ""}
    </nav>`;
}

function comingSoonView(lesson) {
  return {
    title: lesson.title,
    breadcrumb: lesson.moduleTitle,
    activeLessonId: lesson.id,
    html: `
      <div class="page">
        ${pageHeader(`Module ${pad(lesson.moduleNumber)} · Lesson ${pad(lesson.lessonNumber)}`, lesson.title, `${lesson.outcome}.`)}
        <section class="card">
          <h2 class="eyebrow">Concepts covered</h2>
          <div class="row" style="flex-wrap:wrap;gap:var(--space-2)">
            ${lesson.concepts.map((c) => `<code class="badge">${escapeHtml(c)}</code>`).join("")}
          </div>
        </section>
        <div class="notice" role="note"><span><strong>This lesson is still being written.</strong> Exercises for it will appear here and in the Practice lab. Until then, the Reference library covers its syntax.</span></div>
        ${lessonNav(lesson)}
      </div>`,
  };
}

function readingPane(lesson, content) {
  return `
    <header class="lesson-header">
      <span class="eyebrow eyebrow-accent">Module ${pad(lesson.moduleNumber)} · Lesson ${pad(lesson.lessonNumber)}</span>
      <h1>${escapeHtml(lesson.title)}</h1>
      <div class="row" style="flex-wrap:wrap">${statusBadge(lesson.id)}<span class="meta">${content.exercises.length} exercises</span></div>
    </header>

    <section class="lesson-section">
      <span class="eyebrow">The idea</span>
      <p>${inline(content.concept)}</p>
    </section>

    <section class="lesson-section">
      <span class="eyebrow">Syntax</span>
      ${codeBlock(content.syntax, "Syntax")}
    </section>

    <section class="lesson-section">
      <span class="eyebrow">Example</span>
      ${codeBlock(content.example.code, "Example")}
      <p class="meta">${inline(content.example.note)}</p>
    </section>

    <section class="lesson-section predict" aria-labelledby="predict-title">
      <span class="eyebrow" id="predict-title">Predict, then run</span>
      ${codeBlock(content.predict, "Code to predict")}
      <label class="visually-hidden" for="predict-input">What will this print?</label>
      <textarea id="predict-input" class="prediction" rows="2" spellcheck="false" placeholder="What will this print?"></textarea>
      <div class="row">
        <button type="button" class="btn btn-secondary btn-sm" data-action="predict">Run and compare</button>
        <span class="meta" data-role="predict-result" role="status" aria-live="polite"></span>
      </div>
    </section>

    <details class="lesson-more">
      <summary>More: mental model and a common mistake</summary>
      <section class="lesson-section">
        <span class="eyebrow">Mental model</span>
        <p>${inline(content.mentalModel)}</p>
      </section>
      <section class="lesson-section">
        <span class="eyebrow">Common mistake</span>
        ${codeBlock(content.mistake.code, "Common mistake")}
        <p class="meta">${inline(content.mistake.note)}</p>
      </section>
    </details>

    ${lessonNav(lesson)}`;
}

function exerciseSwitcher(lesson, exercises, current) {
  return `
    <nav class="exercise-switcher" aria-label="Exercises in this lesson">
      ${exercises.map((ex) => {
        const solved = exerciseStats(ex.id).passed;
        return `<a class="step ${solved ? "is-solved" : ""}" href="#/lesson/${lesson.id}?ex=${ex.number}" ${ex === current ? 'aria-current="step"' : ""} aria-label="Exercise ${ex.number}${solved ? ", solved" : ""}">${solved ? "✓" : ex.number}</a>`;
      }).join("")}
    </nav>`;
}

export function lessonView({ params, query }) {
  const lesson = findLesson(params.id);
  if (!lesson) return null;
  const content = lessonContent[lesson.id];
  if (!content) return comingSoonView(lesson);
  markVisited(lesson.id);

  const exercises = content.exercises;
  const requested = Number(query.get("ex"));
  const exercise =
    exercises.find((ex) => ex.number === requested) ??
    exercises.find((ex) => !exerciseStats(ex.id).passed) ??
    exercises[0];

  const nextExercise = exercises[exercise.number];
  const nextLesson = allLessons[allLessons.indexOf(lesson) + 1];
  const pane = codePane({
    kind: exercise.type === "trace" ? "trace" : "exercise",
    item: exercise,
    key: exercise.id,
    eyebrow: `Exercise ${exercise.number} of ${exercises.length}`,
    navHtml: exerciseSwitcher(lesson, exercises, exercise),
    attempt: {
      lessonId: lesson.id,
      lessonExerciseIds: exercises.map((ex) => ex.id),
      moduleId: lesson.moduleId,
      href: `#/lesson/${lesson.id}?ex=${exercise.number}`,
    },
    nextHref: nextExercise ? `#/lesson/${lesson.id}?ex=${nextExercise.number}` : nextLesson ? `#/lesson/${nextLesson.id}` : "#/progress",
    nextLabel: nextExercise ? "Next exercise" : nextLesson ? "Next lesson" : "See your progress",
  });

  return {
    title: lesson.title,
    breadcrumb: lesson.moduleTitle,
    activeLessonId: lesson.id,
    layout: "workspace",
    html: splitHtml(readingPane(lesson, content), pane.html, { readLabel: "Learn" }),
    afterRender(root) {
      mountSplit(root);
      const cleanup = pane.mount(root);
      const predictButton = root.querySelector('[data-action="predict"]');
      const predictResult = root.querySelector('[data-role="predict-result"]');
      predictButton.addEventListener("click", async () => {
        const guess = root.querySelector("#predict-input").value;
        try {
          const result = await runCode(content.predict, []);
          const actual = result.error ? `${result.error.type}: ${result.error.message}` : normalizeOutput(result.stdout);
          const ok = normalizeOutput(guess) === actual;
          predictResult.innerHTML = ok
            ? `<span class="text-success">✓ Correct.</span> It prints <code>${escapeHtml(actual)}</code>.`
            : `<span class="text-error">✕ Not quite.</span> It prints <code>${escapeHtml(actual)}</code>.`;
        } catch {
          predictResult.textContent = "Python isn't ready yet. Try again in a moment.";
        }
      });
      return cleanup;
    },
  };
}
