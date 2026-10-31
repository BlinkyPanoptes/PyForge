import { getState, resetProgress, updateSettings } from "../state.js";
import { pageHeader } from "./shared.js";

export function settingsView() {
  const { settings } = getState();
  return {
    title: "Settings",
    html: `
      <div class="page">
        ${pageHeader("Settings", "Make the workspace yours.", "Saved in this browser only.")}
        <section class="panel">
          <div class="panel-header">Editor</div>
          <div class="panel-body">
            <div class="field">
              <label for="font-size"><span class="field-label">Editor font size</span><br /><span class="field-help">Applies to the code editor and code examples.</span></label>
              <select class="select" id="font-size">
                ${[12, 13, 14, 16, 18, 20].map((size) => `<option value="${size}" ${size === settings.editorFontSize ? "selected" : ""}>${size}px</option>`).join("")}
              </select>
            </div>
            <div class="field">
              <label for="tab-size"><span class="field-label">Indent width</span><br /><span class="field-help">Python's standard is 4 spaces.</span></label>
              <select class="select" id="tab-size">
                ${[2, 4].map((size) => `<option value="${size}" ${size === settings.tabSize ? "selected" : ""}>${size} spaces</option>`).join("")}
              </select>
            </div>
          </div>
        </section>
        <section class="panel">
          <div class="panel-header">Your data</div>
          <div class="panel-body">
            <div class="field">
              <span><span class="field-label">Reset progress</span><br /><span class="field-help">Clears lesson progress and saved code in this browser. Settings are kept.</span></span>
              <button type="button" class="btn btn-secondary" id="reset-progress">Reset progress</button>
            </div>
            <p class="field-help" id="settings-status" role="status" aria-live="polite"></p>
          </div>
        </section>
      </div>`,
    afterRender(root) {
      const status = root.querySelector("#settings-status");
      root.querySelector("#font-size").addEventListener("change", (e) => {
        updateSettings({ editorFontSize: Number(e.target.value) });
        status.textContent = "Font size saved.";
      });
      root.querySelector("#tab-size").addEventListener("change", (e) => {
        updateSettings({ tabSize: Number(e.target.value) });
        status.textContent = "Indent width saved.";
      });
      root.querySelector("#reset-progress").addEventListener("click", () => {
        if (confirm("Reset all lesson progress in this browser? This cannot be undone.")) {
          resetProgress();
          status.textContent = "Progress reset.";
        }
      });
    },
  };
}
