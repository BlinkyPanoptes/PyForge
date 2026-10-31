// Projects: larger programs built in milestones. Runs in the browser sandbox; files live in a
// temporary virtual filesystem that resets when the page reloads.
export default [
  {
    id: "expense-tracker",
    title: "Command-line Expense Tracker",
    level: "Beginner",
    concepts: ["variables", "loops", "functions", "lists", "files"],
    summary: "Record expenses, categorise them and calculate totals.",
    requirements: [
      "Add an expense with an amount and category",
      "List saved expenses",
      "Calculate total spending",
      "Filter expenses by category",
      "Save and load data from a JSON file",
    ],
    milestones: [
      { id: "basic", title: "Build the basic version", focus: "Input, output, calculations", tasks: ["Read expenses in a loop until the user types done", "Print every expense and the total"] },
      { id: "structure", title: "Improve the structure", focus: "Functions, validation, data structures", tasks: ["Store each expense as a dictionary in a list", "Move adding, listing and totals into functions", "Reject negative or non-numeric amounts with a clear message"] },
      { id: "persist", title: "Persist and test data", focus: "JSON, exceptions, automated tests", tasks: ["Save expenses to expenses.json and load them on start", "Handle a missing file without crashing", "Write test_ functions for total and filter"] },
    ],
    starter: `import json

expenses = []

while True:
    command = input("Command (add, list, total, done): ")
    if command == "done":
        break
    # Handle the other commands here
`,
    stdin: ["add", "12.50", "food", "add", "30", "travel", "list", "total", "done"],
  },
];
