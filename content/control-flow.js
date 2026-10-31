// Module 03: Control Flow.
export default {
  "if-statements": {
    concept: "`if` runs a block only when its condition is True. `elif` checks another condition when the earlier ones were False, and `else` catches the rest. Python checks from top to bottom and runs only the first match.",
    syntax: `if condition:
    ...
elif other_condition:
    ...
else:
    ...`,
    example: {
      code: `temp = 31
if temp > 30:
    print("Hot")
elif temp > 15:
    print("Mild")
else:
    print("Cold")`,
      note: "The indented lines belong to the branch above them.",
    },
    predict: `score = 85
if score > 50:
    print("pass")
elif score > 80:
    print("great")`,
    mentalModel: "Once one branch runs, the rest are skipped. Put the most specific conditions first.",
    mistake: {
      code: `if temp > 30
print("Hot")  # SyntaxError: missing colon and indent`,
      note: "Every `if`, `elif` and `else` line ends with a colon, and its block is indented.",
    },
    exercises: [
      {
        type: "implement",
        title: "Grade letter",
        prompt: "Read a score with `int(input(\"Score: \"))`. Print `A` for 90 and above, `B` for 75 and above, `C` for 50 and above, otherwise `F`.",
        starter: `score = int(input("Score: "))
# Your solution here
`,
        stdin: ["95"],
        tests: [
          { kind: "output", stdin: ["95"], expected: "Score: 95\nA" },
          { kind: "output", stdin: ["90"], expected: "Score: 90\nA" },
          { kind: "output", stdin: ["89"], expected: "Score: 89\nB" },
          { kind: "output", stdin: ["75"], expected: "Score: 75\nB" },
          { kind: "output", stdin: ["50"], expected: "Score: 50\nC" },
          { kind: "output", stdin: ["49"], expected: "Score: 49\nF" },
        ],
        hints: ["Start with the highest grade: `if score >= 90:`.", "Use `elif` for each lower grade, and `else` for F.", "Check the boundaries: 90 is an A, 89 is a B."],
        explanation: "Checking from the top means each `elif` already knows the score is below the previous threshold.",
      },
      {
        type: "debug",
        title: "Ticket price",
        prompt: "Under 13 is a Child ticket, 13 to 17 is Teen, 18 and over is Adult. Everyone gets a Child ticket right now. Fix it.",
        starter: `age = int(input("Age: "))
if age >= 0:
    print("Child: $5")
elif age >= 13:
    print("Teen: $8")
else:
    print("Adult: $12")
`,
        stdin: ["15"],
        tests: [
          { kind: "output", stdin: ["8"], expected: "Age: 8\nChild: $5" },
          { kind: "output", stdin: ["12"], expected: "Age: 12\nChild: $5" },
          { kind: "output", stdin: ["13"], expected: "Age: 13\nTeen: $8" },
          { kind: "output", stdin: ["17"], expected: "Age: 17\nTeen: $8" },
          { kind: "output", stdin: ["18"], expected: "Age: 18\nAdult: $12" },
        ],
        hints: ["Every age is `>= 0`, so the first branch always wins.", "Test for the smallest group first: `if age < 13:`, then `elif age < 18:`."],
        explanation: "The first condition must exclude everyone it shouldn't catch. Boundaries 12, 13, 17 and 18 are exactly where these bugs hide.",
      },
      {
        type: "trace",
        title: "Two ifs",
        prompt: "What does this program print?",
        code: `x = 7
if x % 2 == 0:
    print("even")
else:
    print("odd")
if x > 5:
    print("big")`,
        hints: ["The second `if` is separate from the first; it always gets checked."],
        explanation: "Two separate `if` statements are both evaluated, so both `odd` and `big` print.",
      },
    ],
  },

  "boolean-logic": {
    concept: "`and` is True only when both sides are True. `or` is True when at least one is. `not` flips a value. Empty things (`0`, `\"\"`, `[]`, `None`) count as False in a condition; everything else counts as True.",
    syntax: `if age >= 18 and has_ticket:
if day == "Sat" or day == "Sun":
if not done:`,
    example: {
      code: `username = "ada"
password = "secret1"
if username and len(password) >= 6:
    print("Valid")`,
      note: "`username` on its own is True because it isn't empty.",
    },
    predict: `print(True and False, True or False, not True)`,
    mentalModel: "Write each comparison in full. `day == \"Sat\" or \"Sun\"` means `(day == \"Sat\") or \"Sun\"`, and a non-empty string is always truthy.",
    mistake: {
      code: `day = "Mon"
if day == "Sat" or "Sun":
    print("Weekend!")  # prints on Monday`,
      note: "Fix: `day == \"Sat\" or day == \"Sun\"`, or `day in (\"Sat\", \"Sun\")`.",
    },
    exercises: [
      {
        type: "implement",
        title: "Leap year",
        prompt: "Read a year with `int(input(\"Year: \"))`. Print `True` if it's a leap year: divisible by 4, except years divisible by 100 unless also divisible by 400.",
        starter: `year = int(input("Year: "))
# Your solution here
`,
        stdin: ["2024"],
        tests: [
          { kind: "output", stdin: ["2024"], expected: "Year: 2024\nTrue" },
          { kind: "output", stdin: ["2023"], expected: "Year: 2023\nFalse" },
          { kind: "output", stdin: ["1900"], expected: "Year: 1900\nFalse" },
          { kind: "output", stdin: ["2000"], expected: "Year: 2000\nTrue" },
        ],
        hints: ["\"Divisible by 4\" is `year % 4 == 0`.", "Combine: divisible by 4 `and` (not divisible by 100 `or` divisible by 400).", "Brackets matter: `a and (b or c)`."],
        explanation: "One expression covers all four cases. The years 1900 and 2000 are the edge cases that prove the rule.",
      },
      {
        type: "debug",
        title: "Weekend check",
        prompt: "This says every day is the weekend. Fix the condition.",
        starter: `day = input("Day: ")
if day == "Sat" or "Sun":
    print("Weekend")
else:
    print("Weekday")
`,
        stdin: ["Mon"],
        tests: [
          { kind: "output", stdin: ["Sat"], expected: "Day: Sat\nWeekend" },
          { kind: "output", stdin: ["Sun"], expected: "Day: Sun\nWeekend" },
          { kind: "output", stdin: ["Mon"], expected: "Day: Mon\nWeekday" },
        ],
        hints: ["`\"Sun\"` on its own is always truthy.", "Compare `day` on both sides of `or`."],
        explanation: "Each side of `or` is a separate condition, so each needs its own comparison.",
      },
      {
        type: "trace",
        title: "Truthiness",
        prompt: "What does this program print?",
        code: `items = []
name = "Ada"
print(bool(items), bool(name))
if not items:
    print("empty")`,
        hints: ["An empty list is falsy.", "`not` flips False to True."],
        explanation: "Empty containers are falsy, so `not items` is True and `empty` prints.",
      },
    ],
  },

  "match-statements": {
    concept: "`match` compares one value against several `case` patterns and runs the first that fits. `case _:` matches anything, like `else`. Join options with `|`.",
    syntax: `match command:
    case "start":
        ...
    case "stop" | "quit":
        ...
    case _:
        ...`,
    example: {
      code: `status = 404
match status:
    case 200:
        print("OK")
    case 404:
        print("Not found")
    case _:
        print("Other")`,
      note: "Only the first matching case runs.",
    },
    predict: `cmd = "q"
match cmd:
    case "quit" | "q":
        print("bye")
    case _:
        print("?")`,
    mentalModel: "`match` is a tidy replacement for a long `if/elif` chain that compares one value against fixed options.",
    mistake: {
      code: `match command:
    case anything:  # captures every value
        print("first")
    case "stop":
        print("never reached")`,
      note: "A bare name in a case grabs any value, so Python rejects the unreachable cases after it with a SyntaxError. Use `_` for the catch-all, last.",
    },
    exercises: [
      {
        type: "implement",
        title: "HTTP status",
        prompt: "Read a status code with `int(input(\"Status: \"))`. Use `match` to print `OK` for 200, `Created` for 201, `Client error` for 400 or 404, `Server error` for 500, and `Unknown` otherwise.",
        starter: `status = int(input("Status: "))
# Your solution here
`,
        stdin: ["404"],
        tests: [
          { kind: "output", stdin: ["200"], expected: "Status: 200\nOK" },
          { kind: "output", stdin: ["201"], expected: "Status: 201\nCreated" },
          { kind: "output", stdin: ["400"], expected: "Status: 400\nClient error" },
          { kind: "output", stdin: ["404"], expected: "Status: 404\nClient error" },
          { kind: "output", stdin: ["500"], expected: "Status: 500\nServer error" },
          { kind: "output", stdin: ["302"], expected: "Status: 302\nUnknown" },
          { kind: "source", uses: "Match", label: "Uses match", hint: "Write `match status:` with a `case` for each code." },
        ],
        hints: ["`case 400 | 404:` handles two codes at once.", "End with `case _:` for everything else."],
        explanation: "Status codes are a real QA topic: API tests check exactly these values.",
      },
      {
        type: "implement",
        title: "Tiny calculator",
        prompt: "Read `float(input(\"First: \"))`, then `input(\"Operator: \")`, then `float(input(\"Second: \"))`. Print the result for `+ - * /`, or `Unknown operator`.",
        starter: `# Your solution here
`,
        stdin: ["6", "*", "7"],
        tests: [
          { kind: "output", stdin: ["6", "*", "7"], expected: "First: 6\nOperator: *\nSecond: 7\n42.0" },
          { kind: "output", stdin: ["9", "/", "2"], expected: "First: 9\nOperator: /\nSecond: 2\n4.5" },
          { kind: "output", stdin: ["1", "-", "3"], expected: "First: 1\nOperator: -\nSecond: 3\n-2.0" },
          { kind: "output", stdin: ["2", "^", "3"], expected: "First: 2\nOperator: ^\nSecond: 3\nUnknown operator" },
        ],
        hints: ["Read all three inputs first.", "`match op:` with `case \"+\":` and so on.", "`case _:` prints `Unknown operator`."],
        explanation: "Reading inputs once at the top, then branching, keeps each case to a single line.",
      },
      {
        type: "trace",
        title: "Pattern with a name",
        prompt: "What does this program print?",
        code: `point = (0, 5)
match point:
    case (0, 0):
        print("origin")
    case (0, y):
        print(f"on y axis at {y}")
    case _:
        print("somewhere")`,
        hints: ["A name inside a pattern captures that part of the value."],
        explanation: "`(0, y)` matches any pair starting with 0 and binds `y` to the second value.",
      },
    ],
  },
};
