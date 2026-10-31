import { upcoming } from "../dom.js";
import { pageHeader } from "./shared.js";

const tiers = [
  { title: "Warm-up", needs: "Foundations, Strings, Control Flow", description: "Short problems with one clear requirement." },
  { title: "Core", needs: "Loops, Lists, Dictionaries, Functions", description: "Several requirements and edge cases to handle." },
  { title: "Stretch", needs: "Errors, Files, Classes, Testing", description: "Open problems where you also write the tests." },
];

export function challengesView() {
  return {
    title: "Challenges",
    html: `
      <div class="page">
        ${pageHeader("Challenges", "Solve problems on your own.", "A problem statement, examples, constraints and tests. Hints only when you ask. No leaderboards, no timers.")}
        <div class="grid grid-3">
          ${tiers.map((t) => `
            <div class="card">
              <h3>${t.title}</h3>
              <p>${t.description}</p>
              <span class="meta">Uses: ${t.needs}</span>
            </div>`).join("")}
        </div>
        ${upcoming(5, "The challenge workspace and the first set of problems.")}
      </div>`,
  };
}
