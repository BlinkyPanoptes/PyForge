# PyForge

A practical Python learning lab: learn the language, understand the logic, build real things.

PyForge runs entirely in the browser. Python executes in a Web Worker through [Pyodide](https://pyodide.org/), so there is no server, account or database. Progress and your code are saved in your browser's local storage.

**Workflow:** Understand → Predict → Code → Run → Debug → Explain → Apply.

## What's inside

- **Learning path:** 12 modules, 38 lessons. Foundations, Strings, Control Flow, Loops, and Testing and Debugging have full lessons (17 lessons, 51 exercises). The other lessons are listed and marked "soon".
- **Lesson workspace:** about a minute of reading (idea, syntax, example), a "predict, then run" box, optional extra notes, and a code editor with Run, Check and hints.
- **Exercise types:** Implement, Trace (predict the output) and Debug (fix the bug). Testing exercises check your `test_` functions the way pytest would, and also against deliberately broken code, so your tests have to catch real bugs.
- **Practice lab:** every exercise, filterable by concept, type, difficulty and status.
- **Challenges:** six problems with no walkthrough, from FizzBuzz to mutation-testing a triangle classifier.
- **Projects:** a Command-line Expense Tracker built in three milestones.
- **Progress:** exercises solved first try versus with help, review suggestions, frequent errors and recent activity.

Exercise checks are hidden test cases. No model solutions are stored anywhere in the repo.

## Run it locally

ES modules must be served over HTTP; opening `index.html` directly won't work.

```sh
python -m http.server 8000   # use python3 on macOS/Linux
```

Then open http://localhost:8000. The first Run downloads Pyodide (about 12 MB) from jsDelivr, so you need an internet connection.

## Tests

```sh
npm test                    # content and logic checks (Node 22, no install needed)

npm install --no-save playwright && npx playwright install chromium
python -m http.server 8000 &
node tests/e2e/smoke.mjs    # browser smoke test: runs real Python
```

Both run in GitHub Actions on every pull request.

## Deployment

Every push to `main` deploys to GitHub Pages through `.github/workflows/pages.yml`. In the repo settings, Pages must use **GitHub Actions** as its source.

## Project structure

```
index.html            App shell: sidebar, header, content area
css/                  tokens, base, layout, components, workspace, responsive
js/
  app.js              Routes, sidebar, search, keyboard shortcuts
  router.js           Hash router (works on GitHub Pages without rewrites)
  state.js            Settings, progress, saved code, activity (localStorage)
  runtime-client.js   Talks to the Python worker: timeouts and restarts
  editor.js           CodeMirror 6 setup
  workspace.js        Coding pane: Run, Check, hints, output, test results
  split.js            Resizable reading/coding split, Learn/Code views on mobile
  errors.js           Plain-language explanations of common errors
  views/              One file per screen
workers/
  python-worker.js    Pyodide plus the Python harness that runs and checks code
content/              Lessons, exercises, challenges and projects as data
vendor/               Bundled CodeMirror (see vendor/README.md)
tests/                Node unit tests and a Playwright smoke test
```

## Adding a lesson

Add an entry keyed by the lesson id to a file in `content/` (see `content/foundations.js`) with `concept`, `syntax`, `example`, `predict`, `mentalModel`, `mistake` and at least three `exercises`. Test kinds:

| kind | checks |
| --- | --- |
| `output` | printed output, optionally with `stdin` values for `input()` |
| `expr` | an expression evaluated after the code runs, e.g. `double(3)` equals `6` |
| `source` | the code uses an AST node (`uses: "For"`) or contains / avoids some text |
| `pytest` | runs `test_` functions; with `from`/`to`, first breaks the code and expects a test to fail |

Run `npm test` to catch malformed content.
