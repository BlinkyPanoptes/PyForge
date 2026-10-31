// Module 02: Strings.
export default {
  "string-indexing": {
    concept: "A string is a sequence of characters. `text[0]` is the first character and `text[-1]` the last. A slice `text[start:stop]` takes characters from `start` up to, but not including, `stop`. `len(text)` counts them.",
    syntax: `text[0]    text[-1]    text[1:4]    text[::-1]    len(text)`,
    example: {
      code: `word = "Python"
print(word[0], word[-1], word[0:3])`,
      note: "Positions start at 0, so `word[0:3]` is the first three characters.",
    },
    predict: `print("banana"[1:4])`,
    mentalModel: "A slice stops before its end index, so `text[a:b]` always has `b - a` characters. Leave a side empty to mean \"from the start\" or \"to the end\".",
    mistake: {
      code: `word = "cat"
print(word[3])  # IndexError: the last index is 2`,
      note: "A string of length 3 has indexes 0, 1 and 2. Use `word[-1]` for the last one.",
    },
    exercises: [
      {
        type: "implement",
        title: "First and last",
        prompt: "Read a word with `input(\"Word: \")` and print its first and last characters, separated by a space.",
        starter: `word = input("Word: ")
# Your solution here
`,
        stdin: ["Python"],
        tests: [
          { kind: "output", stdin: ["Python"], expected: "Word: Python\nP n" },
          { kind: "output", stdin: ["level"], expected: "Word: level\nl l" },
          { kind: "output", stdin: ["a"], expected: "Word: a\na a" },
        ],
        hints: ["The first character is at index 0.", "Negative indexes count from the end: `word[-1]`."],
        explanation: "`word[-1]` works for any length, so you never need `len(word) - 1`.",
      },
      {
        type: "trace",
        title: "Slice it",
        prompt: "What does this program print?",
        code: `code = "PY-2026"
print(code[:2])
print(code[3:])
print(len(code))`,
        hints: ["`[:2]` means from the start up to index 2.", "`[3:]` means from index 3 to the end."],
        explanation: "The dash is at index 2, so `[:2]` is `PY` and `[3:]` is `2026`. The string has 7 characters.",
      },
      {
        type: "implement",
        title: "Reverse it",
        prompt: "Read text with `input(\"Text: \")` and print it backwards.",
        starter: `# Your solution here
`,
        stdin: ["stressed"],
        tests: [
          { kind: "output", stdin: ["stressed"], expected: "Text: stressed\ndesserts" },
          { kind: "output", stdin: ["abc"], expected: "Text: abc\ncba" },
        ],
        hints: ["A slice can take a third value: the step.", "A step of -1 walks backwards: `text[::-1]`."],
        explanation: "`[::-1]` means the whole string, stepping backwards one character at a time.",
      },
    ],
  },

  "string-methods": {
    concept: "Methods are actions a value can do, called with a dot: `text.upper()`. String methods return a new string and never change the original. Useful ones: `strip()`, `lower()`, `upper()`, `replace()`, `split()` and `join()`.",
    syntax: `text.strip()    text.lower()    text.replace("a", "b")    text.split(",")    "-".join(parts)`,
    example: {
      code: `raw = "  Ada Lovelace  "
clean = raw.strip().upper()
print(clean)`,
      note: "Methods can be chained. Each one works on the result of the one before.",
    },
    predict: `print("a,b,c".split(","))`,
    mentalModel: "Strings are immutable. A method hands you a new string; if you don't store it in a variable, it's thrown away.",
    mistake: {
      code: `name = "ada"
name.upper()
print(name)  # still "ada"`,
      note: "Store the result: `name = name.upper()`.",
    },
    exercises: [
      {
        type: "implement",
        title: "Clean an email",
        prompt: "Read an email with `input(\"Email: \")`. Print it with surrounding spaces removed and all letters lowercase.",
        starter: `email = input("Email: ")
# Your solution here
`,
        stdin: ["  Ada@Example.COM "],
        tests: [
          { kind: "output", stdin: ["  Ada@Example.COM "], expected: "Email:   Ada@Example.COM\nada@example.com" },
          { kind: "output", stdin: ["SAM@MAIL.ORG"], expected: "Email: SAM@MAIL.ORG\nsam@mail.org" },
        ],
        hints: ["`strip()` removes spaces at both ends.", "Chain it: `email.strip().lower()`."],
        explanation: "Cleaning input before using it is a habit worth keeping: real users type stray spaces and capitals.",
      },
      {
        type: "debug",
        title: "Make a slug",
        prompt: "This should turn `Learn Python Fast` into `learn-python-fast`, but the capitals stay. Fix it.",
        starter: `title = input("Title: ")
title.lower()
slug = title.replace(" ", "-")
print(slug)
`,
        stdin: ["Learn Python Fast"],
        tests: [
          { kind: "output", stdin: ["Learn Python Fast"], expected: "Title: Learn Python Fast\nlearn-python-fast" },
          { kind: "output", stdin: ["Hello World"], expected: "Title: Hello World\nhello-world" },
        ],
        hints: ["Line 2 makes a lowercase copy, then throws it away.", "Assign the result back to `title`, or chain `.lower().replace(...)`."],
        explanation: "`title.lower()` on its own line does nothing useful because strings can't change in place.",
      },
      {
        type: "trace",
        title: "Split and join",
        prompt: "What does this program print?",
        code: `words = "red green blue".split()
print(len(words))
print("+".join(words))`,
        hints: ["`split()` with no argument splits on spaces.", "`join` puts the string between each item."],
        explanation: "`split()` gives three words, and `\"+\".join` glues them with `+` between.",
      },
    ],
  },

  "string-formatting": {
    concept: "An f-string can hold any expression inside `{}`. Add a format after a colon: `:.2f` for two decimals, `:,` for thousands separators, `:>8` to right-align in 8 characters.",
    syntax: `f"{value}"    f"{price:.2f}"    f"{count:,}"    f"{name:>10}"`,
    example: {
      code: `item = "Coffee"
price = 3.456
print(f"{item}: \${price:.2f}")`,
      note: "`:.2f` rounds what is shown. `price` itself is still 3.456.",
    },
    predict: `n = 1234567
print(f"{n:,}")`,
    mentalModel: "Formatting changes how a number looks, not the number. Use `round()` when you need the value itself changed.",
    mistake: {
      code: `total = 9
print("Total: {total}")  # prints the braces literally`,
      note: "Without the `f` before the quote, `{total}` is just text.",
    },
    exercises: [
      {
        type: "implement",
        title: "Price tag",
        prompt: "Read an item with `input(\"Item: \")` and a price with `input(\"Price: \")`. Print `<item> costs $<price>` with exactly two decimals.",
        starter: `# Your solution here
`,
        stdin: ["Tea", "2.5"],
        tests: [
          { kind: "output", stdin: ["Tea", "2.5"], expected: "Item: Tea\nPrice: 2.5\nTea costs $2.50" },
          { kind: "output", stdin: ["Cake", "3.999"], expected: "Item: Cake\nPrice: 3.999\nCake costs $4.00" },
        ],
        hints: ["Convert the price with `float()` so it can be formatted.", "Inside the f-string: `{price:.2f}`. The `$` is just text before it."],
        explanation: "`:.2f` always shows two decimals and rounds, so 3.999 becomes 4.00.",
      },
      {
        type: "debug",
        title: "Percentage",
        prompt: "This should print `You scored 84.0%`, but the braces show up instead. Fix it.",
        starter: `score = 42
total = 50
print("You scored {score / total * 100:.1f}%")
`,
        tests: [{ kind: "output", expected: "You scored 84.0%" }],
        hints: ["Look at the start of the string."],
        explanation: "Only f-strings evaluate the expressions inside braces.",
      },
      {
        type: "trace",
        title: "Format codes",
        prompt: "What does this program print?",
        code: `name = "Ada"
print(f"[{name:>5}]")
print(f"{7 / 2:.0f}")`,
        hints: ["`:>5` pads on the left to 5 characters.", "Python rounds exact halves to the nearest even number."],
        explanation: "`Ada` gets two spaces in front. 3.5 rounds to 4, the even neighbour.",
      },
    ],
  },
};
