// The Python curriculum: modules and lessons. Exercises are added in phase 4.
export const modules = [
  {
    id: "python-foundations",
    title: "Python Foundations",
    summary: "Variables, data types, operators and basic expressions",
    lessons: [
      { id: "variables", title: "Variables and assignment", outcome: "Bind names to values and reassign them", concepts: ["variable", "assignment", "="] },
      { id: "data-types", title: "Data types", outcome: "Tell int, float, str and bool apart and convert between them", concepts: ["int", "float", "str", "bool", "type", "casting"] },
      { id: "operators", title: "Operators", outcome: "Predict arithmetic, comparison and logical expressions", concepts: ["operator", "arithmetic", "comparison", "and", "or", "not", "//", "%"] },
      { id: "input-output", title: "Input and output", outcome: "Print formatted output and read user input", concepts: ["print", "input", "f-string"] },
    ],
  },
  {
    id: "strings",
    title: "Strings",
    summary: "Indexing, slicing, methods and formatting",
    lessons: [
      { id: "string-indexing", title: "Indexing and slicing", outcome: "Extract characters and substrings", concepts: ["index", "slice", "len"] },
      { id: "string-methods", title: "String methods", outcome: "Clean and transform text", concepts: ["upper", "lower", "strip", "split", "join", "replace"] },
      { id: "string-formatting", title: "Formatting text", outcome: "Build readable output with f-strings", concepts: ["f-string", "format", "round"] },
    ],
  },
  {
    id: "control-flow",
    title: "Control Flow",
    summary: "Conditions and Boolean logic",
    lessons: [
      { id: "if-statements", title: "if, elif and else", outcome: "Choose between paths in a program", concepts: ["if", "elif", "else", "condition"] },
      { id: "boolean-logic", title: "Boolean logic", outcome: "Combine conditions correctly", concepts: ["and", "or", "not", "truthy", "falsy"] },
      { id: "match-statements", title: "Matching values", outcome: "Replace long elif chains with match", concepts: ["match", "case"] },
    ],
  },
  {
    id: "loops",
    title: "Loops and Iteration",
    summary: "Repeat work and process sequences",
    lessons: [
      { id: "for-loops", title: "for loops and range", outcome: "Repeat a block a known number of times", concepts: ["for", "range", "loop"] },
      { id: "while-loops", title: "while loops", outcome: "Repeat until a condition changes", concepts: ["while", "loop", "infinite loop"] },
      { id: "loop-control", title: "break, continue and else", outcome: "Exit or skip iterations deliberately", concepts: ["break", "continue"] },
      { id: "loop-patterns", title: "Common loop patterns", outcome: "Count, sum, search and accumulate", concepts: ["accumulator", "enumerate", "zip"] },
    ],
  },
  {
    id: "lists-tuples",
    title: "Lists and Tuples",
    summary: "Ordered collections and how they change",
    lessons: [
      { id: "lists", title: "Lists", outcome: "Create, index and modify lists", concepts: ["list", "append", "pop", "insert", "mutable"] },
      { id: "list-operations", title: "Sorting and searching", outcome: "Sort, reverse and find items", concepts: ["sort", "sorted", "in", "index"] },
      { id: "comprehensions", title: "List comprehensions", outcome: "Build lists in one readable line", concepts: ["comprehension"] },
      { id: "tuples", title: "Tuples and unpacking", outcome: "Use fixed groups of values", concepts: ["tuple", "unpacking", "immutable"] },
    ],
  },
  {
    id: "dicts-sets",
    title: "Dictionaries and Sets",
    summary: "Look up values by key and keep unique items",
    lessons: [
      { id: "dictionaries", title: "Dictionaries", outcome: "Store and look up values by key", concepts: ["dict", "key", "value", "KeyError", "get"] },
      { id: "dict-iteration", title: "Looping over dictionaries", outcome: "Process keys, values and items", concepts: ["items", "keys", "values"] },
      { id: "sets", title: "Sets", outcome: "Remove duplicates and compare groups", concepts: ["set", "union", "intersection"] },
    ],
  },
  {
    id: "functions",
    title: "Functions",
    summary: "Package logic into reusable, testable pieces",
    lessons: [
      { id: "defining-functions", title: "Defining functions", outcome: "Write functions with parameters and return values", concepts: ["def", "return", "parameter", "argument"] },
      { id: "default-arguments", title: "Defaults and keyword arguments", outcome: "Make functions flexible to call", concepts: ["default", "keyword argument"] },
      { id: "scope", title: "Scope", outcome: "Know which names a function can see", concepts: ["scope", "local", "global"] },
      { id: "return-vs-print", title: "return versus print", outcome: "Return values instead of printing them", concepts: ["return", "print", "None"] },
    ],
  },
  {
    id: "errors",
    title: "Errors and Exceptions",
    summary: "Read tracebacks and handle failures",
    lessons: [
      { id: "reading-tracebacks", title: "Reading tracebacks", outcome: "Find the line and cause of an error", concepts: ["traceback", "SyntaxError", "NameError", "TypeError"] },
      { id: "try-except", title: "try and except", outcome: "Handle expected failures gracefully", concepts: ["try", "except", "finally", "ValueError"] },
      { id: "raising-errors", title: "Raising errors", outcome: "Reject bad input with clear messages", concepts: ["raise", "exception"] },
    ],
  },
  {
    id: "files-data",
    title: "Files and Data",
    summary: "Read and write text, CSV and JSON",
    lessons: [
      { id: "text-files", title: "Reading and writing files", outcome: "Open files safely with with", concepts: ["open", "with", "file"] },
      { id: "csv-files", title: "CSV data", outcome: "Process rows of tabular data", concepts: ["csv", "DictReader"] },
      { id: "json-data", title: "JSON data", outcome: "Save and load structured data", concepts: ["json", "dump", "load"] },
    ],
  },
  {
    id: "modules-stdlib",
    title: "Modules and the Standard Library",
    summary: "Reuse code that already exists",
    lessons: [
      { id: "importing", title: "Importing modules", outcome: "Use import and from ... import", concepts: ["import", "module"] },
      { id: "useful-modules", title: "Useful standard modules", outcome: "Work with math, random and datetime", concepts: ["math", "random", "datetime"] },
    ],
  },
  {
    id: "classes",
    title: "Classes and Objects",
    summary: "Model data and behaviour together",
    lessons: [
      { id: "classes-basics", title: "Defining classes", outcome: "Create objects with __init__ and methods", concepts: ["class", "__init__", "self", "method"] },
      { id: "class-design", title: "Designing small classes", outcome: "Keep state valid with methods", concepts: ["attribute", "encapsulation"] },
    ],
  },
  {
    id: "testing-debugging",
    title: "Testing and Debugging",
    summary: "Prove code works and find out why it does not",
    lessons: [
      { id: "assert", title: "assert and test thinking", outcome: "Check behaviour with assertions", concepts: ["assert", "test case", "edge case"] },
      { id: "writing-tests", title: "Writing tests", outcome: "Write pytest-style test functions", concepts: ["pytest", "test function", "boundary value"] },
      { id: "find-the-bug", title: "Finding bugs", outcome: "Write a test that exposes a defect, then fix it", concepts: ["bug", "debugging", "regression"] },
    ],
  },
];

export const allLessons = modules.flatMap((module, moduleIndex) =>
  module.lessons.map((lesson, lessonIndex) => ({
    ...lesson,
    moduleId: module.id,
    moduleTitle: module.title,
    moduleNumber: moduleIndex + 1,
    lessonNumber: lessonIndex + 1,
  }))
);

export function findLesson(id) {
  return allLessons.find((lesson) => lesson.id === id) ?? null;
}

export function findModule(id) {
  return modules.find((module) => module.id === id) ?? null;
}

export function pad(number) {
  return String(number).padStart(2, "0");
}

export const exerciseTypes = [
  { id: "implement", title: "Implement", description: "Write a solution from requirements." },
  { id: "trace", title: "Trace", description: "Predict the output of unfamiliar code." },
  { id: "debug", title: "Debug", description: "Find and repair a defect." },
  { id: "explain", title: "Explain", description: "Describe why a solution works. Optional." },
];

export const projects = [
  {
    id: "expense-tracker",
    title: "Command-line Expense Tracker",
    level: "Beginner",
    concepts: ["Variables", "loops", "functions", "lists", "files"],
    summary: "Record expenses, categorise transactions and calculate totals.",
    requirements: [
      "Add an expense with an amount and category",
      "List saved expenses",
      "Calculate total spending",
      "Filter expenses by category",
      "Save and load data from a JSON file",
    ],
  },
];
