import { modules, pad } from "./curriculum.js";
import { escapeHtml } from "./dom.js";
import { icon } from "./icons.js";
import { navigate, notFound, parseHash, route, startRouter } from "./router.js";
import { getState, lessonStatus, subscribe } from "./state.js";
import { lessonContent } from "../content/index.js";
import { challengeView, challengesView } from "./views/challenges.js";
import { lessonView } from "./views/lesson.js";
import { notFoundView } from "./views/not-found.js";
import { overviewView } from "./views/overview.js";
import { pathView } from "./views/path.js";
import { practiceExerciseView, practiceView } from "./views/practice.js";
import { progressView } from "./views/progress.js";
import { projectView, projectsView } from "./views/projects.js";
import { referenceView } from "./views/reference.js";
import { searchView } from "./views/search.js";
import { settingsView } from "./views/settings.js";

const app = document.querySelector(".app");
const sidebar = document.querySelector("#sidebar");
const content = document.querySelector("#main");
const headerTitle = document.querySelector("#header-title");
const menuButton = document.querySelector("#menu-button");
const searchInput = document.querySelector("#search-input");
const drawerQuery = window.matchMedia("(max-width: 1199px)");

let lastRender = null;
let cleanup = null;

const statusMarks = { completed: "✓", review: "↺", "in-progress": "•" };

// ---------- Sidebar ----------
function renderCourseNav(activeLessonId) {
  const activeModule = modules.find((m) => m.lessons.some((l) => l.id === activeLessonId)) ?? modules[0];
  document.querySelector("#course-nav").innerHTML = modules
    .map(
      (module, i) => `
      <details class="course-group" ${module === activeModule ? "open" : ""}>
        <summary><span class="course-number">${pad(i + 1)}</span> ${escapeHtml(module.title)}</summary>
        <ul class="lesson-list">
          ${module.lessons
            .map(
              (lesson) =>
                `<li><a href="#/lesson/${lesson.id}" ${lesson.id === activeLessonId ? 'aria-current="page"' : ""} class="${lessonContent[lesson.id] ? "" : "is-soon"}">${escapeHtml(lesson.title)}${lessonMark(lesson.id)}</a></li>`
            )
            .join("")}
        </ul>
      </details>`
    )
    .join("");
}

function lessonMark(lessonId) {
  if (!lessonContent[lessonId]) return '<span class="lesson-mark"><span class="visually-hidden">(</span>soon<span class="visually-hidden">)</span></span>';
  const mark = statusMarks[lessonStatus(lessonId)];
  return mark ? `<span class="lesson-mark" aria-label="${lessonStatus(lessonId).replace("-", " ")}">${mark}</span>` : "";
}

function setActiveNav(section) {
  document.querySelectorAll("[data-nav]").forEach((link) => {
    if (link.dataset.nav === section) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

function setDrawer(open) {
  app.dataset.sidebarOpen = String(open);
  menuButton.setAttribute("aria-expanded", String(open));
  // Off-screen drawer content must not be reachable by keyboard.
  sidebar.inert = drawerQuery.matches && !open;
  if (open) sidebar.querySelector("a, input, button")?.focus();
}

menuButton.addEventListener("click", () => setDrawer(app.dataset.sidebarOpen !== "true"));
document.querySelector(".sidebar-backdrop").addEventListener("click", () => setDrawer(false));
drawerQuery.addEventListener("change", () => setDrawer(false));

// ---------- Search ----------
document.querySelector("#search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const term = searchInput.value.trim();
  if (term) navigate(`/search?q=${encodeURIComponent(term)}`);
});

searchInput.addEventListener("input", () => {
  const term = searchInput.value.trim();
  const onSearch = parseHash().path === "/search";
  if (term) {
    // Live results without adding a history entry per keystroke.
    history.replaceState(null, "", `#/search?q=${encodeURIComponent(term)}`);
    render(searchView, "search", { query: new URLSearchParams({ q: term }) }, false);
  } else if (onSearch) {
    navigate("/overview");
  }
});

// ---------- Keyboard shortcuts ----------
document.addEventListener("keydown", (event) => {
  const typing = event.target.closest("input, textarea, select, [contenteditable]");
  if (event.key === "/" && !typing) {
    event.preventDefault();
    if (drawerQuery.matches) setDrawer(true);
    searchInput.focus();
    searchInput.select();
  } else if (event.key === "Escape") {
    if (app.dataset.sidebarOpen === "true") {
      setDrawer(false);
      menuButton.focus();
    } else if (event.target === searchInput) {
      searchInput.blur();
    }
  }
});

// ---------- Rendering ----------
function render(viewFn, section, context, moveFocus = true) {
  cleanup?.();
  cleanup = null;
  const view = viewFn(context) ?? notFoundView();
  lastRender = { viewFn, section, context };
  content.classList.toggle("content-wide", view.layout === "workspace");
  content.innerHTML = view.html;
  cleanup = view.afterRender?.(content) ?? null;
  document.title = `${view.title} · PyForge`;
  headerTitle.innerHTML = view.breadcrumb
    ? `${escapeHtml(view.breadcrumb)} / <strong>${escapeHtml(view.title)}</strong>`
    : `<strong>${escapeHtml(view.title)}</strong>`;
  setActiveNav(section);
  renderCourseNav(view.activeLessonId);
  if (section !== "search") searchInput.value = "";
  if (moveFocus) {
    if (drawerQuery.matches) setDrawer(false);
    window.scrollTo(0, 0);
    content.focus({ preventScroll: true });
  }
}

function applySettings({ settings }) {
  document.documentElement.style.setProperty("--editor-font-size", `${settings.editorFontSize}px`);
}

route("/overview", (ctx) => render(overviewView, "overview", ctx));
route("/path", (ctx) => render(pathView, "path", ctx));
route("/lesson/:id", (ctx) => render(lessonView, "path", ctx));
route("/practice", (ctx) => render(practiceView, "practice", ctx));
route("/practice/:id", (ctx) => render(practiceExerciseView, "practice", ctx));
route("/challenges", (ctx) => render(challengesView, "challenges", ctx));
route("/challenges/:id", (ctx) => render(challengeView, "challenges", ctx));
route("/projects", (ctx) => render(projectsView, "projects", ctx));
route("/projects/:id", (ctx) => render(projectView, "projects", ctx));
route("/progress", (ctx) => render(progressView, "progress", ctx));
route("/reference", (ctx) => render(referenceView, "reference", ctx));
route("/settings", (ctx) => render(settingsView, "settings", ctx));
route("/search", (ctx) => {
  searchInput.value = ctx.query.get("q") ?? "";
  render(searchView, "search", ctx);
});
notFound((ctx) => render(notFoundView, null, ctx));

// Keep sidebar marks current as exercises are solved; re-render summary pages after a reset.
subscribe((state) => {
  applySettings(state);
  const activeLink = document.querySelector('#course-nav a[aria-current="page"]');
  renderCourseNav(activeLink ? activeLink.getAttribute("href").replace("#/lesson/", "") : undefined);
  if (["overview", "progress"].includes(lastRender?.section)) render(lastRender.viewFn, lastRender.section, lastRender.context, false);
});

applySettings(getState());
setDrawer(false);
startRouter();
