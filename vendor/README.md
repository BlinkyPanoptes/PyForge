# Vendored libraries

## CodeMirror 6 (`codemirror/codemirror.bundle.js`)

MIT licensed, © Marijn Haverbeke and contributors. Bundled into a single ES module so the app needs no build step.
Built from `codemirror/entry.js` with codemirror 6.0.2, @codemirror/lang-python 6.2.1 and esbuild:

```sh
npm install codemirror@6.0.2 @codemirror/lang-python@6.2.1 esbuild
npx esbuild vendor/codemirror/entry.js --bundle --format=esm --minify --legal-comments=eof \
  --outfile=vendor/codemirror/codemirror.bundle.js
```

## Pyodide

Not vendored. The Python worker loads a pinned release (see `PYODIDE_VERSION` in `workers/python-worker.js`)
from the jsDelivr CDN at runtime.
