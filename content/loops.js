// Module 04: Loops and Iteration.
export default {
  "for-loops": {
    concept: "A `for` loop runs its block once for each item in a sequence. `range(n)` gives 0 up to n - 1, `range(a, b)` gives a up to b - 1, and `range(a, b, step)` counts in steps.",
    syntax: `for item in sequence:
    ...
for i in range(5):
    ...`,
    example: {
      code: `for i in range(1, 4):
    print(i, "x 2 =", i * 2)`,
      note: "`range(1, 4)` gives 1, 2 and 3.",
    },
    predict: `for letter in "hey":
    print(letter.upper())`,
    mentalModel: "The loop variable is an ordinary variable that gets the next value each time round.",
    mistake: {
      code: `for i in range(1, 5):
    print(i)  # prints 1 to 4, not 5`,
      note: "The stop value is never included. Use `range(1, 6)` for 1 to 5.",
    },
    exercises: [
      {
        type: "implement",
        title: "Countdown",
        prompt: "Read `int(input(\"Number: \"))`. Print each number from it down to 1, one per line, then `Liftoff!`.",
        starter: `# Your solution here
`,
        stdin: ["3"],
        tests: [
          { kind: "output", stdin: ["3"], expected: "Number: 3\n3\n2\n1\nLiftoff!" },
          { kind: "output", stdin: ["1"], expected: "Number: 1\n1\nLiftoff!" },
          { kind: "source", uses: "For", label: "Uses a for loop", hint: "Loop with `for i in range(...)`." },
        ],
        hints: ["`range` can count down with a negative step.", "`range(n, 0, -1)` gives n down to 1."],
        explanation: "The stop value 0 is excluded, so the loop ends at 1.",
      },
      {
        type: "implement",
        title: "Times table",
        prompt: "Read `int(input(\"Number: \"))` and print its times table from 1 to 5 in the form `7 x 1 = 7`.",
        starter: `# Your solution here
`,
        stdin: ["7"],
        tests: [
          { kind: "output", stdin: ["7"], expected: "Number: 7\n7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n7 x 4 = 28\n7 x 5 = 35" },
          { kind: "output", stdin: ["2"], expected: "Number: 2\n2 x 1 = 2\n2 x 2 = 4\n2 x 3 = 6\n2 x 4 = 8\n2 x 5 = 10" },
        ],
        hints: ["Loop `i` over `range(1, 6)`.", "`print(f\"{n} x {i} = {n * i}\")`."],
        explanation: "The loop variable doubles as the multiplier.",
      },
      {
        type: "trace",
        title: "Stepping total",
        prompt: "What does this program print?",
        code: `total = 0
for n in range(0, 10, 3):
    total += n
print(total)`,
        hints: ["List the values of `range(0, 10, 3)` first.", "They are 0, 3, 6 and 9."],
        explanation: "0 + 3 + 6 + 9 = 18. The print is outside the loop, so it runs once.",
      },
    ],
  },

  "while-loops": {
    concept: "A `while` loop repeats as long as its condition is True. Something inside the loop must eventually make the condition False, or it never stops.",
    syntax: `while condition:
    ...`,
    example: {
      code: `balance = 100
years = 0
while balance < 150:
    balance *= 1.1
    years += 1
print(years)`,
      note: "You don't know in advance how many years it takes, which is when `while` fits.",
    },
    predict: `n = 1
while n < 20:
    n *= 3
print(n)`,
    mentalModel: "Use `for` when you know how many times to repeat. Use `while` when you repeat until something happens.",
    mistake: {
      code: `count = 5
while count > 0:
    print(count)  # count never changes: runs forever`,
      note: "Add `count -= 1` inside the loop. PyForge stops runaway programs after 5 seconds.",
    },
    exercises: [
      {
        type: "implement",
        title: "Halve until one",
        prompt: "Read `int(input(\"Number: \"))`. Keep doing `n = n // 2` while `n` is greater than 1, and print how many steps it took.",
        starter: `# Your solution here
`,
        stdin: ["8"],
        tests: [
          { kind: "output", stdin: ["8"], expected: "Number: 8\n3" },
          { kind: "output", stdin: ["1"], expected: "Number: 1\n0" },
          { kind: "output", stdin: ["100"], expected: "Number: 100\n6" },
          { kind: "source", uses: "While", label: "Uses a while loop", hint: "Write `while n > 1:`." },
        ],
        hints: ["Keep a counter starting at 0.", "Inside the loop: halve `n` and add 1 to the counter."],
        explanation: "When the input is already 1, the loop body never runs and the count stays 0.",
      },
      {
        type: "debug",
        title: "Sum until zero",
        prompt: "This should add up numbers until the user types 0, then print the total. It never finishes. Fix it.",
        starter: `total = 0
number = int(input("Number: "))
while number != 0:
    total += number
print(total)
`,
        stdin: ["5", "3", "0"],
        tests: [
          { kind: "output", stdin: ["5", "3", "0"], expected: "Number: 5\nNumber: 3\nNumber: 0\n8" },
          { kind: "output", stdin: ["0"], expected: "Number: 0\n0" },
        ],
        hints: ["Run it: it gets stopped after 5 seconds. Why?", "`number` never changes inside the loop.", "Read the next number at the end of the loop body."],
        explanation: "The loop condition depends on `number`, so the loop must update `number` or it never ends.",
      },
      {
        type: "trace",
        title: "Halving steps",
        prompt: "What does this program print?",
        code: `x = 10
steps = 0
while x != 1:
    x = x // 2
    steps += 1
print(steps, x)`,
        hints: ["Write the values of x: 10, then 5, then..."],
        explanation: "10 → 5 → 2 → 1 takes three steps.",
      },
    ],
  },

  "loop-control": {
    concept: "`break` leaves the loop immediately. `continue` skips the rest of this round and moves to the next one. A loop's `else` block runs only if the loop finished without a `break`.",
    syntax: `for item in items:
    if should_skip:
        continue
    if found_it:
        break
else:
    ...  # runs only when there was no break`,
    example: {
      code: `for n in range(2, 10):
    if 30 % n == 0 and n > 4:
        print("found", n)
        break`,
      note: "The loop stops at the first match.",
    },
    predict: `for n in range(6):
    if n % 2 == 0:
        continue
    print(n)`,
    mentalModel: "`break` and `continue` only affect the innermost loop they are in.",
    mistake: {
      code: `for i in range(3):
    print(i)
else:
    print("not found")  # runs whenever no break happened`,
      note: "`else` on a loop means \"no break\", not \"the loop didn't run\".",
    },
    exercises: [
      {
        type: "implement",
        title: "Three tries",
        prompt: "Ask `input(\"Password: \")` up to 3 times. If the answer is `letmein`, print `Welcome` and stop asking. After 3 wrong answers, print `Locked`.",
        starter: `# Your solution here
`,
        stdin: ["nope", "letmein"],
        tests: [
          { kind: "output", stdin: ["letmein"], expected: "Password: letmein\nWelcome" },
          { kind: "output", stdin: ["nope", "letmein"], expected: "Password: nope\nPassword: letmein\nWelcome" },
          { kind: "output", stdin: ["a", "b", "c"], expected: "Password: a\nPassword: b\nPassword: c\nLocked" },
        ],
        hints: ["Loop with `for attempt in range(3):`.", "On a correct answer: print and `break`.", "A `for ... else` prints `Locked` only when the loop never hit `break`."],
        explanation: "`for ... else` is made for searches like this: `else` handles the \"never found it\" case.",
      },
      {
        type: "implement",
        title: "Skip the negatives",
        prompt: "Read five numbers with `int(input(\"Number: \"))` and print the sum of only the positive ones. Use `continue` to skip the rest.",
        starter: `# Your solution here
`,
        stdin: ["3", "-1", "4", "-5", "2"],
        tests: [
          { kind: "output", stdin: ["3", "-1", "4", "-5", "2"], expected: "Number: 3\nNumber: -1\nNumber: 4\nNumber: -5\nNumber: 2\n9" },
          { kind: "output", stdin: ["-1", "-2", "-3", "-4", "-5"], expected: "Number: -1\nNumber: -2\nNumber: -3\nNumber: -4\nNumber: -5\n0" },
          { kind: "source", uses: "Continue", label: "Uses continue", hint: "When the number is not positive, `continue`." },
        ],
        hints: ["Loop 5 times, reading one number each time.", "`if number <= 0: continue`, then add it."],
        explanation: "`continue` lets you handle the unwanted case early and keep the main logic unindented.",
      },
      {
        type: "trace",
        title: "Search with else",
        prompt: "What does this program print?",
        code: `for word in ["kiwi", "fig", "plum"]:
    if len(word) == 3:
        print("found", word)
        break
else:
    print("none")`,
        hints: ["Which word has 3 letters?", "After `break`, does the `else` run?"],
        explanation: "`fig` matches and `break` skips the `else`.",
      },
    ],
  },

  "loop-patterns": {
    concept: "Most loops follow a few patterns: count matches, add up a total, track the biggest, or build a result. `enumerate()` gives you each item's position, and `zip()` walks two sequences side by side.",
    syntax: `for i, item in enumerate(items):
    ...
for a, b in zip(first, second):
    ...`,
    example: {
      code: `scores = [72, 95, 88]
best = scores[0]
for s in scores:
    if s > best:
        best = s
print(best)`,
      note: "Start `best` with a real value from the data, then improve it.",
    },
    predict: `for i, ch in enumerate("ab"):
    print(i, ch)`,
    mentalModel: "Every accumulator needs its starting value set before the loop: 0 for a sum, 1 for a product, \"\" for text.",
    mistake: {
      code: `for n in [1, 2, 3]:
    total = 0       # reset every time round
    total += n
print(total)  # 3, not 6`,
      note: "Move `total = 0` above the loop.",
    },
    exercises: [
      {
        type: "implement",
        title: "Count vowels",
        prompt: "Read text with `input(\"Text: \")` and print how many vowels (a, e, i, o, u, any case) it contains.",
        starter: `# Your solution here
`,
        stdin: ["Programming"],
        tests: [
          { kind: "output", stdin: ["Programming"], expected: "Text: Programming\n3" },
          { kind: "output", stdin: ["AEIOU xyz"], expected: "Text: AEIOU xyz\n5" },
          { kind: "output", stdin: ["rhythm"], expected: "Text: rhythm\n0" },
        ],
        hints: ["Start a counter at 0 before the loop.", "`if ch in \"aeiou\":` checks one character. Lowercase it first."],
        explanation: "`ch.lower() in \"aeiou\"` handles both cases with one check.",
      },
      {
        type: "debug",
        title: "Average",
        prompt: "This should print the average of the values, like `Average: 5.0`, but it's wrong. Fix it.",
        starter: `count = int(input("How many? "))
for i in range(count):
    total = 0
    total += float(input("Value: "))
print(f"Average: {total / count:.1f}")
`,
        stdin: ["3", "4", "5", "6"],
        tests: [
          { kind: "output", stdin: ["3", "4", "5", "6"], expected: "How many? 3\nValue: 4\nValue: 5\nValue: 6\nAverage: 5.0" },
          { kind: "output", stdin: ["2", "1", "2"], expected: "How many? 2\nValue: 1\nValue: 2\nAverage: 1.5" },
        ],
        hints: ["What is `total` just before the last value is added?", "The accumulator must start before the loop."],
        explanation: "Setting `total = 0` inside the loop throws away everything added so far.",
      },
      {
        type: "implement",
        title: "Longest word",
        prompt: "Read a sentence with `input(\"Sentence: \")` and print its longest word. If two are equally long, print the first.",
        starter: `# Your solution here
`,
        stdin: ["the quick brown fox"],
        tests: [
          { kind: "output", stdin: ["the quick brown fox"], expected: "Sentence: the quick brown fox\nquick" },
          { kind: "output", stdin: ["a bb ccc bb"], expected: "Sentence: a bb ccc bb\nccc" },
          { kind: "output", stdin: ["solo"], expected: "Sentence: solo\nsolo" },
        ],
        hints: ["`sentence.split()` gives a list of words.", "Track the longest so far; replace it only when a word is strictly longer."],
        explanation: "Using `>` rather than `>=` keeps the first word when there is a tie.",
      },
    ],
  },
};
