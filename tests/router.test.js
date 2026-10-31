import assert from "node:assert/strict";
import { test } from "node:test";
import { parseHash } from "../js/router.js";

test("empty hash goes to the overview", () => {
  assert.equal(parseHash("").path, "/overview");
  assert.equal(parseHash("#").path, "/overview");
});

test("query strings are parsed", () => {
  const { path, query } = parseHash("#/lesson/variables?ex=2");
  assert.equal(path, "/lesson/variables");
  assert.equal(query.get("ex"), "2");
});
