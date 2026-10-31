// Split workspace: reading pane + draggable divider + coding pane, with Learn/Code views on mobile.
import { escapeHtml } from "./dom.js";
import { load, save } from "./storage.js";

const MIN = 300;
const MAX = 640;

export function splitHtml(readHtml, codeHtml, { readLabel = "Lesson" } = {}) {
  return `
    <div class="workspace" data-view="learn">
      <div class="view-switch tabs" role="group" aria-label="Choose view">
        <button type="button" class="tab" data-view-button="learn" aria-pressed="true">${escapeHtml(readLabel)}</button>
        <button type="button" class="tab" data-view-button="code" aria-pressed="false">Code</button>
      </div>
      <article class="read-pane" aria-label="${escapeHtml(readLabel)}">${readHtml}</article>
      <div class="divider" role="separator" tabindex="0" aria-orientation="vertical" aria-label="Resize panes. Use the left and right arrow keys."></div>
      ${codeHtml}
    </div>`;
}

export function mountSplit(root) {
  const workspace = root.querySelector(".workspace");
  const divider = workspace.querySelector(".divider");
  let width = load("readWidth", 420);

  function apply(next) {
    width = Math.max(MIN, Math.min(MAX, next));
    workspace.style.setProperty("--read-width", `${width}px`);
    divider.setAttribute("aria-valuenow", String(width));
    divider.setAttribute("aria-valuemin", String(MIN));
    divider.setAttribute("aria-valuemax", String(MAX));
  }
  apply(width);

  divider.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    divider.setPointerCapture(event.pointerId);
    const startX = event.clientX;
    const startWidth = width;
    const move = (e) => apply(startWidth + e.clientX - startX);
    const up = () => {
      divider.removeEventListener("pointermove", move);
      divider.removeEventListener("pointerup", up);
      save("readWidth", width);
    };
    divider.addEventListener("pointermove", move);
    divider.addEventListener("pointerup", up);
  });

  // Keyboard alternative to dragging.
  divider.addEventListener("keydown", (event) => {
    const step = event.shiftKey ? 64 : 24;
    if (event.key === "ArrowLeft") apply(width - step);
    else if (event.key === "ArrowRight") apply(width + step);
    else return;
    event.preventDefault();
    save("readWidth", width);
  });

  workspace.querySelectorAll("[data-view-button]").forEach((button) => {
    button.addEventListener("click", () => {
      workspace.dataset.view = button.dataset.viewButton;
      workspace.querySelectorAll("[data-view-button]").forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
    });
  });
}
