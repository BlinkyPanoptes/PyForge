import { challenges } from "../../content/index.js";
import { codeBlock, escapeHtml, inline } from "../dom.js";
import { exerciseStats } from "../state.js";
import { mountSplit, splitHtml } from "../split.js";
import { codePane } from "../workspace.js";
import { pageHeader } from "./shared.js";

const tiers = [
  { id: "Warm-up", description: "One clear requirement. Uses Foundations, Strings and Control Flow." },
  { id: "Core", description: "Several requirements and edge cases. Uses loops and string handling." },
  { id: "Stretch", description: "Harder logic, or writing the tests yourself." },
];

const keyFor = (challenge) => `challenge:${challenge.id}`;

export function challengesView() {
  return {
    title: "Challenges",
    html: `
      <div class="page">
        ${pageHeader("Challenges", "Solve problems on your own.", "A problem statement, examples and tests. Hints only when you ask. No leaderboards, no timers.")}
        ${tiers.map((tier) => `
          <section class="stack" aria-labelledby="tier-${tier.id}">
            <div class="stack" style="gap:2px">
              <h2 id="tier-${tier.id}" style="font-size:var(--text-lg)">${tier.id}</h2>
              <p class="meta">${tier.description}</p>
            </div>
            <div class="grid grid-3">
              ${challenges.filter((c) => c.tier === tier.id).map((c) => {
                const solved = exerciseStats(keyFor(c)).passed;
                return `
                  <a class="card card-link" href="#/challenges/${c.id}">
                    <div class="row row-between"><h3>${escapeHtml(c.title)}</h3><span class="badge ${solved ? "badge-success" : ""}">${solved ? "Solved" : "Open"}</span></div>
                    <p>${escapeHtml(c.concepts.join(", "))}</p>
                  </a>`;
              }).join("")}
            </div>
          </section>`).join("")}
      </div>`,
  };
}

export function challengeView({ params }) {
  const challenge = challenges.find((c) => c.id === params.id);
  if (!challenge) return null;
  const index = challenges.indexOf(challenge);
  const next = challenges[index + 1];

  const pane = codePane({
    kind: "challenge",
    item: { ...challenge, prompt: "Write your solution, run it with your own input, then Check." },
    key: keyFor(challenge),
    eyebrow: challenge.tier,
    attempt: { href: `#/challenges/${challenge.id}` },
    nextHref: next ? `#/challenges/${next.id}` : "#/challenges",
    nextLabel: next ? "Next challenge" : "All challenges",
  });

  const read = `
    <header class="lesson-header">
      <span class="eyebrow eyebrow-accent">${escapeHtml(challenge.tier)} challenge</span>
      <h1>${escapeHtml(challenge.title)}</h1>
    </header>
    <section class="lesson-section"><span class="eyebrow">Problem</span><p>${inline(challenge.statement)}</p></section>
    <section class="lesson-section">
      <span class="eyebrow">Examples</span>
      ${challenge.examples.map((ex) => `
        <div class="example-io">
          <span class="field-help">Input</span>${codeBlock(ex.input, "Example input")}
          <span class="field-help">Output</span>${codeBlock(ex.output, "Example output")}
        </div>`).join("")}
    </section>
    <section class="lesson-section">
      <span class="eyebrow">Constraints</span>
      <ul class="plain-list">${challenge.constraints.map((c) => `<li>${inline(c)}</li>`).join("")}</ul>
    </section>
    <a class="btn btn-ghost btn-sm" href="#/challenges">All challenges</a>`;

  return {
    title: challenge.title,
    breadcrumb: "Challenges",
    layout: "workspace",
    html: splitHtml(read, pane.html, { readLabel: "Problem" }),
    afterRender(root) {
      mountSplit(root);
      return pane.mount(root);
    },
  };
}
