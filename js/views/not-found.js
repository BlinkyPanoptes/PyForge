import { pageHeader } from "./shared.js";

export function notFoundView() {
  return {
    title: "Page not found",
    html: `
      <div class="page">
        ${pageHeader("404", "That page does not exist.", "The link may be out of date.")}
        <div><a class="btn btn-primary" href="#/overview">Back to overview</a></div>
      </div>`,
  };
}
