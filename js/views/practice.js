import { exerciseTypes, modules } from "../curriculum.js";
import { escapeHtml, upcoming } from "../dom.js";
import { pageHeader } from "./shared.js";

export function practiceView() {
  return {
    title: "Practice lab",
    html: `
      <div class="page">
        ${pageHeader("Practice lab", "Practise any concept, in any order.", "Pick a skill and solve problems without following the lesson sequence.")}
        <section class="stack" aria-labelledby="types-title">
          <h2 id="types-title" class="eyebrow">Exercise types</h2>
          <div class="grid grid-4">
            ${exerciseTypes.map((t) => `
              <div class="card">
                <h3>${t.title}</h3>
                <p>${t.description}</p>
              </div>`).join("")}
          </div>
        </section>
        <section class="stack" aria-labelledby="skills-title">
          <h2 id="skills-title" class="eyebrow">Skills</h2>
          <div class="grid grid-3">
            ${modules.map((m) => `
              <a class="card card-link" href="#/path?open=${m.id}">
                <h3>${escapeHtml(m.title)}</h3>
                <p>${escapeHtml(m.summary)}</p>
              </a>`).join("")}
          </div>
        </section>
        ${upcoming(4, "Exercises with automatic checks, filters by concept, difficulty and type. Debug and Trace exercises get extra weight.")}
      </div>`,
  };
}
