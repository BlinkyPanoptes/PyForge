// Checks the lesson and exercise data is well formed, so a typo can't ship a broken exercise.
import assert from "node:assert/strict";
import { test } from "node:test";
import { challenges, exercises, lessonContent, projects } from "../content/index.js";
import { allLessons, modules } from "../js/curriculum.js";

const TEST_KINDS = new Set(["output", "expr", "source", "pytest"]);
const EXERCISE_TYPES = new Set(["implement", "trace", "debug"]);

test("lesson and module ids are unique", () => {
  const ids = allLessons.map((l) => l.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(new Set(modules.map((m) => m.id)).size, modules.length);
});

test("every content entry belongs to a curriculum lesson", () => {
  for (const id of Object.keys(lessonContent)) {
    assert.ok(allLessons.some((l) => l.id === id), `unknown lesson ${id}`);
  }
});

test("every lesson with content has the full template", () => {
  for (const [id, lesson] of Object.entries(lessonContent)) {
    for (const field of ["concept", "syntax", "predict", "mentalModel"]) {
      assert.ok(lesson[field], `${id} is missing ${field}`);
    }
    assert.ok(lesson.example?.code && lesson.example?.note, `${id} needs an example with a note`);
    assert.ok(lesson.mistake?.code && lesson.mistake?.note, `${id} needs a common mistake with a note`);
    assert.ok(lesson.exercises.length >= 3, `${id} needs at least 3 exercises`);
  }
});

test("exercise ids are unique", () => {
  const ids = exercises.map((e) => e.id);
  assert.equal(new Set(ids).size, ids.length);
});

function checkGradable(item, where) {
  assert.ok(item.title, `${where} needs a title`);
  assert.ok(Array.isArray(item.hints) && item.hints.length > 0, `${where} needs hints`);
  assert.ok(item.explanation, `${where} needs an explanation`);
  assert.ok(Array.isArray(item.tests) && item.tests.length > 0, `${where} needs tests`);
  for (const t of item.tests) {
    assert.ok(TEST_KINDS.has(t.kind), `${where} has unknown test kind ${t.kind}`);
    if (t.kind === "output") assert.equal(typeof t.expected, "string", `${where} output test needs expected`);
    if (t.kind === "expr") assert.ok(t.code && t.expected, `${where} expr test needs code and expected`);
    if (t.kind === "source") assert.ok(t.label && (t.uses || t.contains || t.notContains), `${where} source test needs a label and a rule`);
    if (t.kind === "pytest") {
      assert.ok(["pass", "fail"].includes(t.expect), `${where} pytest test needs expect`);
      if (t.from !== undefined) assert.ok(item.starter.includes(t.from), `${where} mutation "${t.from}" not found in starter`);
    }
  }
}

test("every exercise is well formed", () => {
  for (const e of exercises) {
    assert.ok(EXERCISE_TYPES.has(e.type), `${e.id} has unknown type ${e.type}`);
    assert.ok(e.prompt, `${e.id} needs a prompt`);
    if (e.type === "trace") {
      assert.ok(e.code, `${e.id} trace needs code`);
      assert.ok(e.hints?.length && e.explanation, `${e.id} trace needs hints and an explanation`);
    } else {
      assert.equal(typeof e.starter, "string", `${e.id} needs starter code`);
      checkGradable(e, e.id);
    }
  }
});

test("exercises with input() tests also give sample input for Run", () => {
  for (const e of exercises.filter((e) => e.tests?.some((t) => t.stdin))) {
    assert.ok(e.stdin?.length, `${e.id} should set stdin so Run works out of the box`);
  }
});

test("no stored solutions", () => {
  for (const e of [...exercises, ...challenges]) {
    assert.equal(e.solution, undefined, `${e.id} must not ship a solution`);
  }
});

test("challenges and projects are well formed", () => {
  assert.equal(new Set(challenges.map((c) => c.id)).size, challenges.length);
  for (const c of challenges) {
    assert.ok(["Warm-up", "Core", "Stretch"].includes(c.tier), `${c.id} tier`);
    assert.ok(c.statement && c.examples.length && c.constraints.length, `${c.id} needs statement, examples, constraints`);
    checkGradable(c, c.id);
  }
  for (const p of projects) {
    assert.ok(p.milestones.length && p.requirements.length && p.starter, `${p.id} incomplete`);
  }
});
