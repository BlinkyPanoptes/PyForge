// Hash-based router: works from any GitHub Pages project URL without server rewrites.
const routes = [];
let notFoundHandler = () => {};

export function route(pattern, handler) {
  // "/lesson/:id" -> /^\/lesson\/([^/]+)$/
  const keys = [];
  const regex = new RegExp(
    "^" + pattern.replace(/:([a-z]+)/gi, (_, key) => (keys.push(key), "([^/]+)")) + "$"
  );
  routes.push({ regex, keys, handler });
}

export function notFound(handler) {
  notFoundHandler = handler;
}

export function parseHash(hash = location.hash) {
  const raw = hash.replace(/^#/, "") || "/overview";
  const [path, queryString = ""] = raw.split("?");
  return { path, query: new URLSearchParams(queryString) };
}

export function navigate(path) {
  location.hash = path;
}

function resolve() {
  const { path, query } = parseHash();
  for (const { regex, keys, handler } of routes) {
    const match = path.match(regex);
    if (match) {
      const params = Object.fromEntries(keys.map((key, i) => [key, decodeURIComponent(match[i + 1])]));
      handler({ path, params, query });
      return;
    }
  }
  notFoundHandler({ path, query });
}

export function startRouter() {
  window.addEventListener("hashchange", resolve);
  resolve();
}
