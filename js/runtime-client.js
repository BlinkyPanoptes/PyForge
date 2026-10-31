// Main-thread side of the Python worker: request IDs, run state, timeouts and restarts.
const RUN_TIMEOUT_MS = 5000;
const INIT_TIMEOUT_MS = 90000;

let worker = null;
let ready = null;
let nextId = 1;
const pending = new Map();
const listeners = new Set();
let status = "idle"; // idle | loading | ready | running | error

function setStatus(next, detail) {
  status = next;
  listeners.forEach((listener) => listener(status, detail));
}

export function onStatus(listener) {
  listeners.add(listener);
  listener(status);
  return () => listeners.delete(listener);
}

export function getStatus() {
  return status;
}

function send(message, timeoutMs) {
  const id = nextId++;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      pending.delete(id);
      reject(Object.assign(new Error("timeout"), { code: "timeout" }));
    }, timeoutMs);
    pending.set(id, { resolve, reject, timer });
    worker.postMessage({ ...message, id });
  });
}

function startWorker() {
  worker = new Worker(new URL("../workers/python-worker.js", import.meta.url), { type: "module" });
  worker.onmessage = ({ data }) => {
    const entry = pending.get(data.id);
    if (!entry) return;
    clearTimeout(entry.timer);
    pending.delete(data.id);
    data.ok ? entry.resolve(data) : entry.reject(new Error(data.error));
  };
  worker.onerror = (event) => {
    event.preventDefault();
    pending.forEach(({ reject, timer }) => (clearTimeout(timer), reject(new Error("The Python runtime crashed."))));
    pending.clear();
    setStatus("error", "The Python runtime could not start. Check your connection and reload.");
  };
  setStatus("loading");
  ready = send({ type: "init" }, INIT_TIMEOUT_MS).then(
    () => setStatus("ready"),
    (error) => {
      setStatus("error", "The Python runtime could not load. Check your connection and reload the page.");
      throw error;
    }
  );
  return ready;
}

export function ensureRuntime() {
  if (!worker) startWorker();
  return ready;
}

function restart() {
  worker?.terminate();
  pending.forEach(({ reject, timer }) => (clearTimeout(timer), reject(new Error("restarted"))));
  pending.clear();
  worker = null;
  return ensureRuntime();
}

async function execute(message) {
  await ensureRuntime();
  if (status === "running") throw Object.assign(new Error("busy"), { code: "busy" });
  setStatus("running");
  try {
    const { result } = await send(message, RUN_TIMEOUT_MS);
    setStatus("ready");
    return result;
  } catch (error) {
    if (error.code === "timeout") {
      // A synchronous infinite loop can only be stopped by killing the worker.
      restart().catch(() => {});
      return {
        timedOut: true,
        run: { stdout: "", error: timeoutError() },
        stdout: "",
        error: timeoutError(),
        results: [],
      };
    }
    setStatus("ready");
    throw error;
  }
}

function timeoutError() {
  return {
    type: "TimeoutError",
    message: `Your program ran for more than ${RUN_TIMEOUT_MS / 1000} seconds and was stopped.`,
    line: null,
    traceback: `Stopped after ${RUN_TIMEOUT_MS / 1000} seconds. This usually means a loop never ends: check that its condition eventually becomes False.`,
  };
}

export function runCode(code, stdin = []) {
  return execute({ type: "run", code, stdin });
}

export function checkCode(code, tests, stdin = []) {
  return execute({ type: "check", code, tests, stdin });
}
