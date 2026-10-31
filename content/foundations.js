// Module 01: Python Foundations. Exercise tests are hidden from the UI; no solutions are stored.
export default {
  variables: {
    concept: "A variable is a name that refers to a value. `=` binds the name on the left to the value on the right, and you can reassign the name later.",
    syntax: "name = value",
    example: {
      code: `health = 100
health = health - 25
print(health)`,
      note: "The right side is worked out first, using the old value of `health`.",
    },
    predict: `x = 5
y = x
x = 10
print(y)`,
    mentalModel: "A variable is a label pointing at a value, not a box holding it. `y = x` points `y` at the same value; moving the `x` label later leaves `y` where it was.",
    mistake: {
      code: `5 = score  # SyntaxError`,
      note: "The name always goes on the left of `=`. A literal like `5` can't be assigned to.",
    },
    exercises: [
      {
        type: "implement",
        title: "Take damage",
        prompt: "Start with `health = 100`. Subtract 25 from it, then print `health`.",
        starter: `health = 100
# Your solution here
`,
        tests: [
          { kind: "output", expected: "75" },
          { kind: "source", notContains: "print(75)", label: "Calculates the value instead of typing 75", hint: "Update `health` with an assignment, then print the variable." },
        ],
        hints: ["Reassign the variable: `health = health - something`.", "Then print the variable itself, not a number.", "Two lines: `health = health - 25` and `print(health)`."],
        explanation: "`health = health - 25` reads the current value (100), subtracts 25, and rebinds `health` to 75.",
      },
      {
        type: "trace",
        title: "Who moved?",
        prompt: "What does this program print?",
        code: `a = 3
b = a
a = a + 4
print(a, b)`,
        hints: ["`b = a` copies the current value of `a`, which is 3.", "Changing `a` afterwards does not change `b`."],
        explanation: "`b` was bound to 3 before `a` changed, so it stays 3 while `a` becomes 7.",
      },
      {
        type: "debug",
        title: "Swap two values",
        prompt: "This should print `pear apple`, but it prints `pear pear`. Fix the swap.",
        starter: `left = "apple"
right = "pear"
left = right
right = left
print(left, right)
`,
        tests: [{ kind: "output", expected: "pear apple" }],
        hints: ["After `left = right`, nothing refers to \"apple\" any more.", "Save one value in a temporary variable before overwriting it.", "Python can also swap in one line: `left, right = right, left`."],
        explanation: "Swapping needs the old value kept somewhere. `left, right = right, left` builds the pair on the right first, then assigns both at once.",
      },
    ],
  },

  "data-types": {
    concept: "Every value has a type: `int` (whole numbers), `float` (decimals), `str` (text in quotes) and `bool` (`True` or `False`). `type(value)` tells you which one, and `int()`, `float()`, `str()` convert between them.",
    syntax: `int("42")    float("3.5")    str(7)    type(3.0)`,
    example: {
      code: `age = "36"
print(int(age) + 1)`,
      note: "Text that looks like a number is still text. Convert it before doing maths.",
    },
    predict: `print("5" + "5")
print(5 + 5)`,
    mentalModel: "Conversion makes a new value of another type. `int(age)` doesn't change `age`; it gives you a new number to use.",
    mistake: {
      code: `print("Age: " + 36)  # TypeError`,
      note: "You can't add a `str` and an `int`. Use `str(36)` or an f-string: `f\"Age: {36}\"`.",
    },
    exercises: [
      {
        type: "implement",
        title: "One year older",
        prompt: "Convert `age_text` to a number, add 1, and print the result.",
        starter: `age_text = "29"
# Your solution here
`,
        tests: [
          { kind: "output", expected: "30" },
          { kind: "source", notContains: "print(30)", label: "Converts the text instead of typing 30", hint: "Use `int(age_text)`." },
        ],
        hints: ["`age_text` is a string, so `age_text + 1` fails.", "`int(age_text)` gives you the number 29."],
        explanation: "`int(\"29\")` turns text into the integer 29, which can then be added to.",
      },
      {
        type: "trace",
        title: "Conversions",
        prompt: "What does this program print?",
        code: `print(int(7.9))
print(float(2))
print(bool(""))`,
        hints: ["`int()` on a float cuts off the decimal part; it doesn't round.", "An empty string counts as False."],
        explanation: "`int(7.9)` truncates to 7, `float(2)` is `2.0`, and an empty string is falsy.",
      },
      {
        type: "debug",
        title: "Fix the receipt",
        prompt: "This should print `Total: 12` but crashes with a TypeError. Fix it.",
        starter: `price = 4
quantity = 3
print("Total: " + price * quantity)
`,
        tests: [{ kind: "output", expected: "Total: 12" }],
        hints: ["Read the error: you can only join a `str` to another `str`.", "Convert the number with `str(...)`, or use an f-string."],
        explanation: "`f\"Total: {price * quantity}\"` formats the number into the text without manual conversion.",
      },
    ],
  },

  operators: {
    concept: "`+ - * /` work as in maths, but `/` always gives a float. `//` divides and drops the remainder, `%` gives the remainder, and `**` is a power. Comparisons like `==`, `!=` and `<` give `True` or `False`.",
    syntax: `7 // 2    7 % 2    2 ** 3    a == b    a != b`,
    example: {
      code: `minutes = 135
print(minutes // 60, "h", minutes % 60, "min")`,
      note: "`//` gives whole hours and `%` gives the minutes left over.",
    },
    predict: `print(10 / 5)`,
    mentalModel: "`=` assigns and `==` compares. `x = 3` changes `x`; `x == 3` asks a question and changes nothing.",
    mistake: {
      code: `if total = 10:  # SyntaxError
    print("Ten")`,
      note: "Use `==` to compare.",
    },
    exercises: [
      {
        type: "implement",
        title: "Split the seconds",
        prompt: "Print the hours, minutes and seconds in `seconds`, separated by spaces. For 3725 that is `1 2 5`. Use `//` and `%`.",
        starter: `seconds = 3725
# Your solution here
`,
        tests: [
          { kind: "output", expected: "1 2 5" },
          { kind: "source", uses: "FloorDiv", label: "Uses //", hint: "`seconds // 3600` gives whole hours." },
          { kind: "source", uses: "Mod", label: "Uses %", hint: "`seconds % 3600` gives what's left after the hours." },
        ],
        hints: ["Hours: `seconds // 3600`.", "What's left after the hours: `seconds % 3600`. Divide that by 60 for minutes.", "Seconds: `seconds % 60`."],
        explanation: "Peel off the biggest unit with `//`, then use `%` to keep the remainder for the next unit.",
      },
      {
        type: "trace",
        title: "Operator check",
        prompt: "What does this program print?",
        code: `print(17 // 5, 17 % 5)
print(2 ** 4)
print(3 == 3.0)`,
        hints: ["17 is 3 fives with 2 left over.", "An int and a float with the same value are equal."],
        explanation: "`17 // 5` is 3 remainder 2, `2 ** 4` is 16, and `3 == 3.0` compares values, so it's True.",
      },
      {
        type: "implement",
        title: "Even or odd",
        prompt: "Print `True` if `number` is even, otherwise `False`. Don't use `if`: print a comparison.",
        starter: `number = 14
# Your solution here
`,
        tests: [
          { kind: "output", expected: "True" },
          { kind: "source", uses: "Mod", label: "Uses %", hint: "An even number has remainder 0 when divided by 2." },
          { kind: "source", notContains: "print(True)", label: "Prints a comparison, not a literal", hint: "Print the result of `number % 2 == 0`." },
        ],
        hints: ["Even numbers divide by 2 with nothing left over.", "`number % 2` is 0 for even numbers.", "Print the comparison itself: `print(number % 2 == 0)`."],
        explanation: "A comparison is a value. `number % 2 == 0` evaluates to True or False, and you can print it directly.",
      },
    ],
  },

  "input-output": {
    concept: "`print()` shows values separated by spaces. `input()` waits for the user and always returns a `str`. An f-string like `f\"Hi {name}\"` puts values inside text.",
    syntax: `name = input("Name: ")
print(f"Hello, {name}!")`,
    example: {
      code: `price = 3.5
qty = 4
print(f"{qty} items cost \${price * qty:.2f}")`,
      note: "`:.2f` shows exactly two decimal places.",
    },
    predict: `print("a", "b", sep="-")`,
    mentalModel: "`input()` pauses the program and hands back whatever was typed, always as text. Convert it with `int()` or `float()` before doing maths.",
    mistake: {
      code: `age = input("Age: ")
print(age + 1)  # TypeError: age is a str`,
      note: "Wrap it: `int(input(\"Age: \"))`.",
    },
    exercises: [
      {
        type: "implement",
        title: "Greet the user",
        prompt: "Ask for a name with `input(\"Name: \")`, then print `Hello, <name>!`.",
        starter: `name = input("Name: ")
# Your solution here
`,
        stdin: ["Ada"],
        tests: [
          { kind: "output", stdin: ["Ada"], expected: "Name: Ada\nHello, Ada!" },
          { kind: "output", stdin: ["Sam"], expected: "Name: Sam\nHello, Sam!" },
        ],
        hints: ["An f-string can include the variable: `f\"Hello, {name}!\"`."],
        explanation: "The f-string places the typed name between the fixed text.",
      },
      {
        type: "implement",
        title: "Double it",
        prompt: "Read a whole number with `input(\"Number: \")` and print it doubled.",
        starter: `# Your solution here
`,
        stdin: ["21"],
        tests: [
          { kind: "output", stdin: ["21"], expected: "Number: 21\n42" },
          { kind: "output", stdin: ["-4"], expected: "Number: -4\n-8" },
        ],
        hints: ["`input()` gives text. Convert it with `int()`.", "`number = int(input(\"Number: \"))`, then print `number * 2`."],
        explanation: "Without `int()`, `\"21\" * 2` would repeat the text and print `2121`.",
      },
      {
        type: "debug",
        title: "Shopping total",
        prompt: "This should print the price times the quantity, like `Total: 10.0`, but it crashes. Fix it.",
        starter: `price = input("Price: ")
qty = input("Quantity: ")
print(f"Total: {price * qty}")
`,
        stdin: ["2.5", "4"],
        tests: [
          { kind: "output", stdin: ["2.5", "4"], expected: "Price: 2.5\nQuantity: 4\nTotal: 10.0" },
          { kind: "output", stdin: ["1.25", "2"], expected: "Price: 1.25\nQuantity: 2\nTotal: 2.5" },
        ],
        hints: ["Both values are strings. You can't multiply two strings.", "Price can have decimals, so use `float()`. Quantity is a whole number, so `int()`."],
        explanation: "Converting at the point of input keeps the rest of the program working with numbers.",
      },
    ],
  },
};
