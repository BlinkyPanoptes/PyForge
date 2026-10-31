// The coding pane shared by lessons, practice, challenges and projects:
// editor, Run/Check/Hint, input, output, test results and feedback states.
import { createEditor } from "./editor.js";
import { codeBlock, escapeHtml, inline } from "./dom.js";
import { explainError } from "./errors.js";
import { checkCode, ensureRuntime, onStatus, runCode } from "./runtime-client.js";
import {
  clearBuffer,
  exerciseStats,
  getBuffer,
  getState,
  recordAttempt,
  recordHint,
  recordReveal,
  saveBuffer,
  subscribe,
} from "./state.js";

const typeLabels = { implement: "Implement", trace: "Trace", debug: "Debug", challenge: "Challenge", project: "Project" };

export function normalizeOutput(text) {
  const lines = String(text).replace(/\r\n/g, "\n").split("\n").map((line) => line.trimEnd());
  while (lines.length && !lines[lines.length - 1]) lines.pop();
  return lines.join("\n");
}

function statusText(status, detail) {
  return {
    idle: "Python loads when you first run code",
    loading: "Loading Python…",
    ready: "Python ready",
    running: "Running…",
    error: detail ?? "Python could not load",
  }[status];
}

/**
 * @param {object} options
 * @param {"exercise"|"trace"|"challenge"|"project"} options.kind
 * @param {object} options.item exercise, challenge or project record
 * @param {string} options.key storage key for the buffer and stats
 * @param {string} options.eyebrow e.g. "Exercise 1 of 3"
 * @param {object} [options.attempt] fields passed to recordAttempt (lessonId, lessonExerciseIds, moduleId, href)
 * @param {string} [options.nextHref] where "Next" goes after a pass
 * @param {string} [options.nextLabel]
 * @param {string} [options.navHtml] exercise switcher shown under the title
 */
export function codePane(options) {
  const { kind, item, key } = options;
  const isTrace = kind === "trace";
  const canCheck = kind !== "project";
  const stats = exerciseStats(key);
  const typeLabel = typeLabels[kind === "exercise" ? item.type : kind];
  const hasInput = Boolean(item.stdin?.length) || kind === "project";

  const html = `
    <section class="code-pane" aria-label="Coding workspace">
      <header class="exercise-head">
        <div class="row row-between" style="flex-wrap:wrap">
          <span class="eyebrow">${escapeHtml(options.eyebrow)} · ${typeLabel}</span>
          ${canCheck ? `<span class="badge ${stats.passed ? "badge-success" : ""}" data-role="solved">${stats.passed ? "Solved" : "Not solved yet"}</span>` : ""}
        </div>
        <h2>${escapeHtml(item.title)}</h2>
        <p class="exercise-prompt">${inline(item.prompt ?? item.statement ?? item.summary)}</p>
        ${options.navHtml ?? ""}
      </header>

      ${isTrace ? `
        <div class="trace">
          ${codeBlock(item.code, "Code to trace")}
          <label class="field-label" for="prediction">Your prediction</label>
          <textarea id="prediction" class="prediction" rows="4" spellcheck="false" placeholder="Type exactly what you think it prints">${escapeHtml(getBuffer(key) ?? "")}</textarea>
        </div>` : `
        <div class="panel editor-panel">
          <div class="panel-header">
            <span class="file-name">main.py</span>
            <span class="row" style="gap:var(--space-1)">
              <button type="button" class="btn btn-ghost btn-sm" data-action="copy" aria-label="Copy code">Copy</button>
              <button type="button" class="btn btn-ghost btn-sm" data-action="reset" aria-label="Reset to starter code">Reset</button>
            </span>
          </div>
          <div class="editor-host" data-role="editor"></div>
        </div>`}

      <div class="toolbar">
        ${isTrace ? "" : `<button type="button" class="btn btn-secondary" data-action="run" title="Ctrl+Enter">Run <kbd>Ctrl ↵</kbd></button>`}
        ${canCheck ? `<button type="button" class="btn btn-primary" data-action="check" title="Ctrl+Shift+Enter">${isTrace ? "Check prediction" : "Check"}</button>` : ""}
        ${item.hints?.length ? `<button type="button" class="btn btn-ghost" data-action="hint">Get a hint</button>` : ""}
        ${isTrace ? `<button type="button" class="btn btn-ghost" data-action="reveal">Show output</button>` : ""}
        <span class="runtime-status" data-role="runtime" role="status" aria-live="polite"></span>
      </div>

      <div class="hints" data-role="hints" aria-live="polite"></div>

      <div class="panel results-panel">
        <div class="panel-header results-tabs" role="tablist" aria-label="Results">
          <span class="row" style="gap:2px">
            <button type="button" class="tab" role="tab" data-tab="output" aria-selected="true" aria-controls="tab-output">Output</button>
            ${canCheck ? `<button type="button" class="tab" role="tab" data-tab="tests" aria-selected="false" aria-controls="tab-tests">Tests</button>` : ""}
            ${hasInput ? `<button type="button" class="tab" role="tab" data-tab="input" aria-selected="false" aria-controls="tab-input">Input</button>` : ""}
          </span>
          <button type="button" class="btn btn-ghost btn-sm" data-action="collapse" aria-expanded="true">Hide</button>
        </div>
        <div class="results-body">
          <div id="tab-output" role="tabpanel" data-panel="output">
            <p class="meta" data-role="output-placeholder">${isTrace ? "Type your prediction, then check it." : "Your program's output will appear here."}</p>
            <pre class="terminal" data-role="stdout" hidden></pre>
            <div data-role="error" hidden></div>
          </div>
          ${canCheck ? `<div id="tab-tests" role="tabpanel" data-panel="tests" hidden><p class="meta">Press Check to run the tests.</p></div>` : ""}
          ${hasInput ? `
            <div id="tab-input" role="tabpanel" data-panel="input" hidden>
              <label class="field-help" for="stdin">Values for <code>input()</code> when you press Run, one per line. Check uses its own test values.</label>
              <textarea id="stdin" class="prediction" rows="4" spellcheck="false">${escapeHtml((item.stdin ?? []).join("\n"))}</textarea>
            </div>` : ""}
        </div>
      </div>

      <div class="success" data-role="success" hidden></div>
    </section>`;

  function mount(root) {
    const pane = root.querySelector(".code-pane");
    const $ = (selector) => pane.querySelector(selector);
    const outputEl = $('[data-role="stdout"]');
    const errorEl = $('[data-role="error"]');
    const placeholderEl = $('[data-role="output-placeholder"]');
    const hintsEl = $('[data-role="hints"]');
    const successEl = $('[data-role="success"]');
    const runtimeEl = $('[data-role="runtime"]');
    const buttons = pane.querySelectorAll("[data-action=run], [data-action=check]");
    let hintsShown = 0;
    let editor = null;
    let prediction = null;

    // ----- Editor or prediction box -----
    const starter = item.starter ?? "";
    if (isTrace) {
      prediction = $("#prediction");
      prediction.addEventListener("input", () => saveBuffer(key, prediction.value));
      prediction.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
          event.preventDefault();
          check();
        }
      });
    } else {
      const { settings } = getState();
      editor = createEditor($('[data-role="editor"]'), {
        doc: getBuffer(key) ?? starter,
        fontSize: settings.editorFontSize,
        tabSize: settings.tabSize,
        onChange: (code) => saveBuffer(key, code),
        onRun: run,
        onCheck: canCheck ? check : run,
      });
    }

    const unsubscribeSettings = subscribe(({ settings }) => {
      editor?.setFontSize(settings.editorFontSize);
      editor?.setTabSize(settings.tabSize);
    });

    // ----- Runtime status -----
    const unsubscribeStatus = onStatus((status, detail) => {
      runtimeEl.textContent = statusText(status, detail);
      runtimeEl.dataset.status = status;
      buttons.forEach((button) => (button.disabled = status === "running" || status === "loading"));
    });
    // Start loading Python as soon as a workspace opens so the first Run is quick.
    ensureRuntime().catch(() => {});

    // ----- Tabs and collapse -----
    function showTab(name) {
      pane.querySelectorAll("[data-tab]").forEach((tab) => tab.setAttribute("aria-selected", String(tab.dataset.tab === name)));
      pane.querySelectorAll("[data-panel]").forEach((panel) => (panel.hidden = panel.dataset.panel !== name));
      expand(true);
    }
    pane.querySelectorAll("[data-tab]").forEach((tab) => tab.addEventListener("click", () => showTab(tab.dataset.tab)));

    const collapseButton = $('[data-action="collapse"]');
    function expand(open) {
      $(".results-body").hidden = !open;
      collapseButton.textContent = open ? "Hide" : "Show";
      collapseButton.setAttribute("aria-expanded", String(open));
    }
    collapseButton.addEventListener("click", () => expand($(".results-body").hidden));

    // ----- Rendering results -----
    function renderRun(result) {
      placeholderEl.hidden = true;
      const stdout = result.stdout ?? "";
      outputEl.hidden = false;
      outputEl.textContent = stdout || (result.error ? "" : "(no output)");
      outputEl.hidden = !stdout && Boolean(result.error);
      if (result.error) {
        const { type, traceback, line } = result.error;
        errorEl.hidden = false;
        errorEl.innerHTML = `
          <div class="error-box" role="alert">
            <div class="row row-between" style="flex-wrap:wrap">
              <strong>✕ ${escapeHtml(type)}</strong>
              ${line && editor ? `<button type="button" class="btn btn-ghost btn-sm" data-action="goto-line">Go to line ${line}</button>` : ""}
            </div>
            <pre class="terminal terminal-error">${escapeHtml(traceback)}</pre>
            <p class="error-help">${inline(explainError(type))}</p>
          </div>`;
        errorEl.querySelector('[data-action="goto-line"]')?.addEventListener("click", () => editor.focusLine(line));
      } else {
        errorEl.hidden = true;
        errorEl.innerHTML = "";
      }
    }

    function renderTests(results, error) {
      const panel = $('[data-panel="tests"]');
      const passed = results.filter((r) => r.pass).length;
      panel.innerHTML = `
        <p class="test-summary ${passed === results.length && !error ? "is-pass" : "is-fail"}">
          ${passed} of ${results.length} checks passed
        </p>
        <ul class="test-list">
          ${results.map((r) => `
            <li class="test-item ${r.pass ? "is-pass" : "is-fail"}">
              <span class="test-icon" aria-hidden="true">${r.pass ? "✓" : "✕"}</span>
              <span class="test-text">
                <span class="visually-hidden">${r.pass ? "Passed:" : "Failed:"}</span>
                ${inline(r.label ?? "Check")}
                ${!r.pass && r.detail ? `<pre class="terminal test-detail">${escapeHtml(r.detail)}</pre>` : ""}
              </span>
            </li>`).join("")}
        </ul>`;
    }

    function markSolved() {
      const badge = $('[data-role="solved"]');
      badge.textContent = "Solved";
      badge.classList.add("badge-success");
    }

    function showSuccess(firstTry) {
      successEl.hidden = false;
      successEl.innerHTML = `
        <div class="success-box" role="status">
          <strong>✓ ${firstTry ? "Solved on the first try." : "Solved."}</strong>
          ${item.explanation ? `<p><span class="eyebrow">Why it works</span><br />${inline(item.explanation)}</p>` : ""}
          ${options.nextHref ? `<a class="btn btn-primary" href="${options.nextHref}">${escapeHtml(options.nextLabel ?? "Next")} →</a>` : ""}
        </div>`;
    }

    function hideSuccess() {
      successEl.hidden = true;
    }

    function friendlyFailure(error) {
      return {
        stdout: "",
        error: { type: "RuntimeError", message: error.message, traceback: "The Python runtime is unavailable. Check your connection and reload the page.", line: null },
      };
    }

    // ----- Actions -----
    async function run() {
      if (isTrace) return;
      hideSuccess();
      showTab("output");
      const stdin = ($("#stdin")?.value ?? "").split("\n").filter((line, i, all) => line !== "" || i < all.length - 1);
      try {
        renderRun(await runCode(editor.getValue(), stdin));
      } catch (error) {
        if (error.code !== "busy") renderRun(friendlyFailure(error));
      }
    }

    function record(passed, errorType) {
      const result = recordAttempt({
        exerciseId: key,
        passed,
        errorType,
        title: item.title,
        href: options.attempt?.href ?? location.hash,
        ...options.attempt,
      });
      if (passed) markSolved();
      return result;
    }

    async function check() {
      if (!canCheck) return run();
      hideSuccess();
      try {
        if (isTrace) {
          const result = await runCode(item.code, []);
          // Only printed output counts, so "what prints before it stops" works for code that raises.
          const ok = normalizeOutput(prediction.value) === normalizeOutput(result.stdout);
          showTab("tests");
          renderTests([{ pass: ok, label: ok ? "Your prediction matches the output" : "Your prediction doesn't match yet", detail: ok ? null : "Look at each line again, then try once more. Use Show output if you're stuck." }]);
          const { firstPass, stats: updated } = record(ok);
          if (ok) {
            renderRun(result);
            showSuccess(firstPass && updated.passedFirstTry);
          }
          return;
        }
        const code = editor.getValue();
        const result = await checkCode(code, item.tests, item.stdin ?? []);
        renderRun(result.run);
        if (result.timedOut) {
          showTab("output");
          record(false, "TimeoutError");
          return;
        }
        const allPassed = result.results.length > 0 && result.results.every((r) => r.pass);
        renderTests(result.results, result.run.error);
        showTab(result.run.error && !allPassed ? "output" : "tests");
        const { firstPass, stats: updated } = record(allPassed, result.run.error?.type ?? (allPassed ? undefined : "WrongAnswer"));
        if (allPassed) showSuccess(firstPass && updated.passedFirstTry);
      } catch (error) {
        if (error.code !== "busy") renderRun(friendlyFailure(error));
      }
    }

    function hint() {
      if (hintsShown >= item.hints.length) return;
      hintsShown += 1;
      recordHint(key, options.attempt?.lessonId);
      hintsEl.innerHTML = item.hints
        .slice(0, hintsShown)
        .map((text, i) => `<div class="hint"><span class="eyebrow">Hint ${i + 1} of ${item.hints.length}</span><p>${inline(text)}</p></div>`)
        .join("");
      const button = $('[data-action="hint"]');
      if (hintsShown >= item.hints.length) {
        button.disabled = true;
        button.textContent = "No more hints";
      } else button.textContent = `Next hint (${hintsShown + 1} of ${item.hints.length})`;
    }

    async function reveal() {
      recordReveal(key);
      try {
        const result = await runCode(item.code, []);
        showTab("output");
        renderRun(result);
      } catch (error) {
        if (error.code !== "busy") renderRun(friendlyFailure(error));
      }
    }

    const actions = {
      run,
      check,
      hint,
      reveal,
      reset() {
        if (editor.getValue() !== starter && !confirm("Replace your code with the starter code?")) return;
        editor.setValue(starter);
        clearBuffer(key);
        editor.focus();
      },
      async copy(button) {
        try {
          await navigator.clipboard.writeText(editor.getValue());
          button.textContent = "Copied";
        } catch {
          button.textContent = "Copy failed";
        }
        setTimeout(() => (button.textContent = "Copy"), 1500);
      },
    };

    pane.addEventListener("click", (event) => {
      const button = event.target.closest("[data-action]");
      if (button && actions[button.dataset.action]) actions[button.dataset.action](button);
    });

    return () => {
      unsubscribeStatus();
      unsubscribeSettings();
      editor?.destroy();
    };
  }

  return { html, mount };
}
