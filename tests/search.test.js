import assert from "node:assert/strict";
import { test } from "node:test";
import { searchLessons } from "../js/views/search.js";

test("search matches concepts, not only titles", () => {
  const { lessons } = searchLessons("KeyError");
  assert.ok(lessons.some((l) => l.id === "dictionaries"));
});

test("blank search returns nothing", () => {
  assert.deepEqual(searchLessons("   "), { lessons: [], modules: [] });
});
