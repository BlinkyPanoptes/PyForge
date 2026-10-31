# PyForge

A practical Python learning lab: learn the language, understand the logic, build real things.

PyForge is a static, browser-only learning environment. Python will run in the browser through Pyodide, so there is no server, account or database.

## Run it locally

ES modules need to be served over HTTP (opening `index.html` directly will not work):

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Project structure

```
index.html        App shell: sidebar, header, content area
css/
  tokens.css      Design tokens (colors, type, spacing, radii)
  base.css        Reset and element defaults
  layout.css      App grid, header, page layout helpers
  components.css  Buttons, cards, panels, nav, badges, forms
  responsive.css  Tablet drawer and mobile layout
js/
  app.js          Wiring: routes, sidebar, search, shortcuts
  router.js       Hash router (works on GitHub Pages)
  state.js        Settings and progress, saved to localStorage
  storage.js      Safe localStorage wrapper
  curriculum.js   Modules, lessons, exercise types, projects
  dom.js          HTML escaping, static code highlighting
  icons.js        Inline SVG icons
  views/          One file per screen
```

## Build phases

1. Design system and app shell (this phase)
2. Curriculum and split lesson workspace
3. Python runtime (CodeMirror + Pyodide in a Web Worker)
4. Exercises, checks and feedback
5. Progress, challenges and projects
6. Testing and deployment
