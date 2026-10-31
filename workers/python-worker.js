// Runs learner code with Pyodide off the main thread. The main thread kills and
// restarts this worker on timeout, which is the only reliable way to stop an infinite loop.
const PYODIDE_VERSION = "314.0.7";
const INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

const HARNESS = String.raw`
import ast, builtins, io, json, linecache, math, sys, traceback

_FILENAME = "main.py"


def _pf_format_error(exc):
    if isinstance(exc, SyntaxError):
        line = exc.lineno if exc.filename == _FILENAME else None
        text = (exc.text or "").rstrip()
        caret = ""
        if text and exc.offset:
            caret = "\n    " + " " * (exc.offset - 1) + "^"
        detail = f'  File "main.py", line {exc.lineno}\n    {text}{caret}\n' if line else ""
        return {"type": type(exc).__name__, "message": exc.msg, "line": line,
                "traceback": f"{detail}{type(exc).__name__}: {exc.msg}"}
    # Keep only frames from the learner's file so the harness never shows up.
    frames = [f for f in traceback.extract_tb(exc.__traceback__) if f.filename == _FILENAME]
    line = frames[-1].lineno if frames else None
    body = "".join(traceback.format_list(frames))
    message = str(exc)
    return {"type": type(exc).__name__, "message": message, "line": line,
            "traceback": f"Traceback (most recent call last):\n{body}{type(exc).__name__}: {message}".rstrip()}


class _Capture:
    def __init__(self, inputs):
        self.out = io.StringIO()
        self.queue = [str(v) for v in (inputs or [])]

    def fake_input(self, prompt=""):
        self.out.write(str(prompt))
        if not self.queue:
            raise EOFError("input() was called but this exercise has no more input to give.")
        value = self.queue.pop(0)
        self.out.write(value + "\n")
        return value

    def __enter__(self):
        self.saved = (sys.stdout, sys.stderr, builtins.input)
        sys.stdout = sys.stderr = self.out
        builtins.input = self.fake_input
        return self

    def __exit__(self, *exc):
        sys.stdout, sys.stderr, builtins.input = self.saved
        return False


def _pf_execute(source, inputs):
    namespace = {"__name__": "__main__"}
    error = None
    # Lets tracebacks show the learner's source line.
    linecache.cache[_FILENAME] = (len(source), None, source.splitlines(True), _FILENAME)
    with _Capture(inputs) as cap:
        try:
            code = compile(source, _FILENAME, "exec")
            exec(code, namespace)
        except BaseException as exc:  # SystemExit and KeyboardInterrupt are learner errors too
            error = _pf_format_error(exc)
    return {"stdout": cap.out.getvalue(), "error": error}, namespace


def _pf_normalize(text):
    lines = [line.rstrip() for line in str(text).replace("\r\n", "\n").split("\n")]
    while lines and not lines[-1]:
        lines.pop()
    return "\n".join(lines)


def _pf_equal(got, expected):
    if isinstance(expected, bool) or isinstance(got, bool):
        return type(got) is type(expected) and got == expected
    if isinstance(expected, float) and isinstance(got, (int, float)):
        return math.isclose(got, expected, rel_tol=1e-9, abs_tol=1e-9)
    return type(got) is type(expected) and got == expected


def _pf_uses(source, node_name):
    try:
        tree = ast.parse(source)
    except SyntaxError:
        return False
    return any(type(node).__name__ == node_name for node in ast.walk(tree))


def _pf_pytest(source, test):
    """Run module code plus every test_ function, like pytest. Optionally break the code first."""
    label = test.get("label") or "Tests"
    if "from" in test:
        if test["from"] not in source:
            return {"pass": False, "label": label,
                    "detail": "Keep the given function unchanged so Check can break it on purpose."}
        source = source.replace(test["from"], test["to"], 1)
    run, namespace = _pf_execute(source, [])
    failures = []
    names = []
    if run["error"]:
        failures.append(run["error"])
    else:
        names = [n for n, v in namespace.items() if n.startswith("test_") and callable(v)]
        for name in names:
            with _Capture([]):
                try:
                    namespace[name]()
                except BaseException as exc:
                    error = _pf_format_error(exc)
                    error["test"] = name
                    failures.append(error)
    if test["expect"] == "pass":
        if failures:
            first = failures[0]
            where = f'{first["test"]} failed: ' if "test" in first else ""
            return {"pass": False, "label": label, "detail": f'{where}{first["type"]}: {first["message"]}'.rstrip(": ")}
        minimum = test.get("min", 0)
        if len(names) < minimum:
            return {"pass": False, "label": label,
                    "detail": f"Found {len(names)} test_ function(s); write at least {minimum}."}
        return {"pass": True, "label": label, "detail": None}
    caught = any(f["type"] != "SyntaxError" for f in failures)
    return {"pass": caught, "label": label,
            "detail": None if caught else "Your tests still pass when the code is broken this way. Add a test that would notice."}


def _pf_run(source, inputs):
    result, _ = _pf_execute(source, json.loads(inputs))
    return json.dumps(result)


def _pf_check(source, tests, inputs):
    tests = json.loads(tests)
    inputs = json.loads(inputs)
    base, namespace = _pf_execute(source, inputs)
    results = []
    for test in tests:
        kind = test["kind"]
        label = test.get("label")
        if kind == "pytest":
            results.append(_pf_pytest(source, test))
            continue
        if base["error"] and kind != "source":
            results.append({"pass": False, "label": label or "Program runs without errors",
                            "detail": f'{base["error"]["type"]}: {base["error"]["message"]}'})
            continue
        if kind == "output":
            run = base
            if "stdin" in test:
                run, _ = _pf_execute(source, test["stdin"])
            if run["error"]:
                results.append({"pass": False, "label": label or "Output", "detail": run["error"]["message"]})
                continue
            got, want = _pf_normalize(run["stdout"]), _pf_normalize(test["expected"])
            ok = got == want
            given = f' with input {", ".join(map(repr, test["stdin"]))}' if test.get("stdin") else ""
            results.append({"pass": ok, "label": label or f"Prints the expected output{given}",
                            "detail": None if ok else f"Expected:\n{want}\n\nYour program printed:\n{got or '(nothing)'}"})
        elif kind == "expr":
            call_label = label or f'{test["code"]} == {test["expected"]}'
            with _Capture([]) as cap:
                try:
                    got = eval(test["code"], namespace)
                    error = None
                except BaseException as exc:
                    error = _pf_format_error(exc)
            if error:
                results.append({"pass": False, "label": call_label,
                                "detail": f'{test["code"]} raised {error["type"]}: {error["message"]}'})
                continue
            expected = eval(test["expected"], {})
            ok = _pf_equal(got, expected)
            results.append({"pass": ok, "label": call_label,
                            "detail": None if ok else f'{test["code"]} gave {got!r}, expected {expected!r}'})
        elif kind == "source":
            ok = True
            if "uses" in test:
                ok = _pf_uses(source, test["uses"])
            if "contains" in test:
                ok = ok and test["contains"] in source
            if "notContains" in test:
                ok = ok and test["notContains"] not in source
            results.append({"pass": ok, "label": label, "detail": None if ok else test.get("hint")})
    return json.dumps({"run": base, "results": results})
`;

let pyodide = null;

async function init() {
  const { loadPyodide } = await import(`${INDEX_URL}pyodide.mjs`);
  pyodide = await loadPyodide({ indexURL: INDEX_URL });
  pyodide.runPython(HARNESS);
  // Learner code must not reach browser APIs through the js module.
  pyodide.runPython("import sys\nsys.modules['js'] = None\nsys.modules['pyodide_js'] = None");
}

const ready = init();

self.onmessage = async ({ data }) => {
  const { id, type } = data;
  try {
    await ready;
    if (type === "init") {
      self.postMessage({ id, ok: true, version: pyodide.version });
    } else if (type === "run") {
      const fn = pyodide.globals.get("_pf_run");
      const result = JSON.parse(fn(data.code, JSON.stringify(data.stdin ?? [])));
      fn.destroy();
      self.postMessage({ id, ok: true, result });
    } else if (type === "check") {
      const fn = pyodide.globals.get("_pf_check");
      const result = JSON.parse(fn(data.code, JSON.stringify(data.tests), JSON.stringify(data.stdin ?? [])));
      fn.destroy();
      self.postMessage({ id, ok: true, result });
    }
  } catch (error) {
    self.postMessage({ id, ok: false, error: String(error?.message ?? error) });
  }
};
