// Joins lesson content to the curriculum and gives every exercise a stable id.
import { allLessons } from "../js/curriculum.js";
import controlFlow from "./control-flow.js";
import foundations from "./foundations.js";
import loops from "./loops.js";
import strings from "./strings.js";
import testing from "./testing.js";

export { default as challenges } from "./challenges.js";
export { default as projects } from "./projects.js";

const raw = { ...foundations, ...strings, ...controlFlow, ...loops, ...testing };

export const lessonContent = {};
export const exercises = [];

for (const lesson of allLessons) {
  const content = raw[lesson.id];
  if (!content) continue;
  const lessonExercises = content.exercises.map((exercise, index) => ({
    difficulty: lesson.moduleNumber <= 2 ? "beginner" : "core",
    ...exercise,
    id: `${lesson.id}-${index + 1}`,
    number: index + 1,
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    moduleId: lesson.moduleId,
    moduleTitle: lesson.moduleTitle,
  }));
  lessonContent[lesson.id] = { ...content, exercises: lessonExercises };
  exercises.push(...lessonExercises);
}

export function hasContent(lessonId) {
  return Boolean(lessonContent[lessonId]);
}

export function findExercise(id) {
  return exercises.find((exercise) => exercise.id === id) ?? null;
}
