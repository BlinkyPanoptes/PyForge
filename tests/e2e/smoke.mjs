// Browser smoke test: loads the app, runs Python, checks an exercise, and stops an infinite loop.
// Usage: start a static server on port 8000, then `node tests/e2e/smoke.mjs`.
// Set PYODIDE_LOCAL_DIR to serve Pyodide from a local copy instead of the CDN.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:8000";
const failures = [];
const step = async (name, fn) => {
  try {
    await fn();
    console.log(`ok - ${name}`);
  } catch (error) {
    failures.push(name);
    console.log(`not ok - ${name}\n  ${error.message.split("\n")[0]}`);
  }
};

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
if (process.env.PYODIDE_LOCAL_DIR) {
  await context.route(/cdn\.jsdelivr\.net\/pyodide\/v[^/]+\/full\/([^?]*)/, (route) => {
    const file = route.request().url().match(/full\/([^?]*)/)[1];
    const type = file.endsWith(".wasm") ? "application/wasm" : file.endsWith("js") ? "text/javascript" : "application/octet-stream";
    route.fulfill({ body: readFileSync(join(process.env.PYODIDE_LOCAL_DIR, file)), headers: { "content-type": type } });
  });
}
const page = await context.newPage();
const pageErrors = [];
page.on("pageerror", (error) => pageErrors.push(error.message));

await step("every main screen renders a heading", async () => {
  for (const route of ["overview", "path", "practice", "challenges", "projects", "reference", "progress", "settings"]) {
    await page.goto(`${BASE}/#/${route}`);
    await page.locator("h1").first().waitFor();
  }
});

await step("Python runs and prints output", async () => {
  await page.goto(`${BASE}/#/lesson/variables?ex=1`);
  await page.locator(".runtime-status[data-status=ready]").waitFor({ timeout: 120000 });
  await page.locator(".cm-content").click();
  await page.keyboard.press("Control+End");
  await page.keyboard.type("health = health - 25\nprint(health)");
  await page.locator("[data-action=run]").click();
  await page.locator("[data-role=stdout]", { hasText: "75" }).waitFor();
});

await step("a correct solution passes Check", async () => {
  await page.getByRole("button", { name: "Check", exact: true }).click();
  await page.locator(".success-box").waitFor();
});

await step("progress survives a reload", async () => {
  await page.reload();
  await page.locator("[data-role=solved]", { hasText: "Solved" }).waitFor();
});

await step("code that runs but is wrong fails Check", async () => {
  await page.goto(`${BASE}/#/lesson/variables?ex=3`);
  await page.locator(".runtime-status[data-status=ready]").waitFor({ timeout: 60000 });
  await page.getByRole("button", { name: "Check", exact: true }).click();
  await page.locator(".test-summary.is-fail").waitFor();
});

await step("an infinite loop is stopped and Python restarts", async () => {
  await page.goto(`${BASE}/#/lesson/while-loops?ex=2`);
  await page.locator(".runtime-status[data-status=ready]").waitFor({ timeout: 60000 });
  await page.locator("[data-action=run]").click();
  await page.locator(".error-box", { hasText: "TimeoutError" }).waitFor({ timeout: 20000 });
  await page.locator(".runtime-status[data-status=ready]").waitFor({ timeout: 120000 });
});

await step("no uncaught page errors", async () => {
  if (pageErrors.length) throw new Error(pageErrors.join("; "));
});

await browser.close();
if (failures.length) {
  console.log(`\n${failures.length} failed`);
  process.exit(1);
}
console.log("\nall passed");
