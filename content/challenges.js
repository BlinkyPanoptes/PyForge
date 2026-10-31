// Independent problems: no walkthrough, hints only on request.
export default [
  {
    id: "fizzbuzz",
    tier: "Warm-up",
    title: "FizzBuzz",
    concepts: ["loops", "conditions", "%"],
    statement: "Read `n` with `int(input(\"n: \"))`. Print the numbers 1 to n, one per line, but print `Fizz` for multiples of 3, `Buzz` for multiples of 5, and `FizzBuzz` for multiples of both.",
    examples: [{ input: "5", output: "1\n2\nFizz\n4\nBuzz" }],
    constraints: ["1 ≤ n ≤ 100"],
    starter: "",
    stdin: ["15"],
    tests: [
      { kind: "output", stdin: ["5"], expected: "n: 5\n1\n2\nFizz\n4\nBuzz" },
      { kind: "output", stdin: ["15"], expected: "n: 15\n1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz" },
      { kind: "output", stdin: ["1"], expected: "n: 1\n1" },
    ],
    hints: ["Check the \"both\" case first.", "A multiple of both 3 and 5 is a multiple of 15."],
    explanation: "Order the checks from most to least specific. An alternative builds the word: start with \"\", add \"Fizz\" and/or \"Buzz\", and print the number if it's still empty.",
  },
  {
    id: "palindrome",
    tier: "Warm-up",
    title: "Palindrome sentence",
    concepts: ["strings", "slicing"],
    statement: "Read text with `input(\"Text: \")`. Print `True` if it reads the same backwards, ignoring spaces and capital letters, otherwise `False`.",
    examples: [{ input: "Never odd or even", output: "True" }, { input: "Python", output: "False" }],
    constraints: ["Only letters and spaces"],
    starter: "",
    stdin: ["Never odd or even"],
    tests: [
      { kind: "output", stdin: ["Never odd or even"], expected: "Text: Never odd or even\nTrue" },
      { kind: "output", stdin: ["Python"], expected: "Text: Python\nFalse" },
      { kind: "output", stdin: ["a"], expected: "Text: a\nTrue" },
      { kind: "output", stdin: ["Taco cat"], expected: "Text: Taco cat\nTrue" },
    ],
    hints: ["Clean the text first: remove spaces and lowercase it.", "Compare the cleaned text with its reverse, `[::-1]`."],
    explanation: "Normalising input before comparing is the key idea. `text.replace(\" \", \"\").lower()` does it in one line.",
  },
  {
    id: "run-length",
    tier: "Core",
    title: "Run-length encoding",
    concepts: ["loops", "strings", "accumulators"],
    statement: "Read text with `input(\"Text: \")` and compress runs of the same character: `aaabcc` becomes `a3b1c2`.",
    examples: [{ input: "aaabcc", output: "a3b1c2" }, { input: "abc", output: "a1b1c1" }],
    constraints: ["At least one character"],
    starter: "",
    stdin: ["aaabcc"],
    tests: [
      { kind: "output", stdin: ["aaabcc"], expected: "Text: aaabcc\na3b1c2" },
      { kind: "output", stdin: ["abc"], expected: "Text: abc\na1b1c1" },
      { kind: "output", stdin: ["zzzz"], expected: "Text: zzzz\nz4" },
      { kind: "output", stdin: ["aabaa"], expected: "Text: aabaa\na2b1a2" },
    ],
    hints: ["Track the current character and how many times you've seen it in a row.", "When the character changes, add the finished run to the result.", "Don't forget the last run after the loop ends."],
    explanation: "The classic trap is the final run: the loop ends before it's added, so it needs handling after the loop.",
  },
  {
    id: "username",
    tier: "Core",
    title: "Validate a username",
    concepts: ["strings", "boolean logic", "loops"],
    statement: "Read a username with `input(\"Username: \")`. Print `valid` if it is 3 to 16 characters long, uses only letters, digits and `_`, and doesn't start with a digit. Otherwise print `invalid`.",
    examples: [{ input: "ada_99", output: "valid" }, { input: "9lives", output: "invalid" }],
    constraints: ["Input has no spaces"],
    starter: "",
    stdin: ["ada_99"],
    tests: [
      { kind: "output", stdin: ["ada_99"], expected: "Username: ada_99\nvalid" },
      { kind: "output", stdin: ["9lives"], expected: "Username: 9lives\ninvalid" },
      { kind: "output", stdin: ["ab"], expected: "Username: ab\ninvalid" },
      { kind: "output", stdin: ["abc"], expected: "Username: abc\nvalid" },
      { kind: "output", stdin: ["a234567890123456"], expected: "Username: a234567890123456\nvalid" },
      { kind: "output", stdin: ["a2345678901234567"], expected: "Username: a2345678901234567\ninvalid" },
      { kind: "output", stdin: ["bad-name"], expected: "Username: bad-name\ninvalid" },
    ],
    hints: ["Check each rule separately and combine them with `and`.", "`ch.isalnum() or ch == \"_\"` tests one character.", "`name[0].isdigit()` checks the first character."],
    explanation: "Validation rules are where QA lives: 2, 3, 16 and 17 characters are the boundary cases the tests use.",
  },
  {
    id: "caesar",
    tier: "Stretch",
    title: "Caesar cipher",
    concepts: ["strings", "loops", "%"],
    statement: "Read text with `input(\"Text: \")` and a shift with `int(input(\"Shift: \"))`. Shift each letter forward through the alphabet, wrapping from z to a and keeping its case. Leave other characters unchanged.",
    examples: [{ input: "Hello, World!\n3", output: "Khoor, Zruog!" }],
    constraints: ["0 ≤ shift ≤ 25"],
    starter: "",
    stdin: ["Hello, World!", "3"],
    tests: [
      { kind: "output", stdin: ["Hello, World!", "3"], expected: "Text: Hello, World!\nShift: 3\nKhoor, Zruog!" },
      { kind: "output", stdin: ["xyz", "2"], expected: "Text: xyz\nShift: 2\nzab" },
      { kind: "output", stdin: ["ABC", "0"], expected: "Text: ABC\nShift: 0\nABC" },
    ],
    hints: ["`ord(\"a\")` is 97 and `chr(97)` is \"a\".", "Position in the alphabet: `ord(ch) - ord(\"a\")`. Shift it, then `% 26` to wrap.", "Handle upper and lower case with different base letters."],
    explanation: "`chr((ord(ch) - base + shift) % 26 + base)` covers both cases once `base` is `ord(\"a\")` or `ord(\"A\")`.",
  },
  {
    id: "triangle-tests",
    tier: "Stretch",
    title: "Test the triangle classifier",
    concepts: ["testing", "boundary values"],
    statement: "`classify(a, b, c)` returns `equilateral`, `isosceles`, `scalene` or `invalid`. Write `test_` functions thorough enough to catch every bug Check plants in it.",
    examples: [{ input: "classify(3, 3, 3)", output: "\"equilateral\"" }, { input: "classify(1, 2, 3)", output: "\"invalid\"" }],
    constraints: ["A triangle is invalid if any side is 0 or less, or two sides add up to no more than the third"],
    starter: `def classify(a, b, c):
    if a <= 0 or b <= 0 or c <= 0:
        return "invalid"
    if a + b <= c or a + c <= b or b + c <= a:
        return "invalid"
    if a == b == c:
        return "equilateral"
    if a == b or b == c or a == c:
        return "isosceles"
    return "scalene"


# Write your test_ functions below
`,
    tests: [
      { kind: "pytest", expect: "pass", min: 3, label: "At least three tests, all passing on the correct code" },
      { kind: "pytest", expect: "fail", from: "a + b <= c", to: "a + b < c", label: "Catches: flat triangle (1, 2, 3) accepted" },
      { kind: "pytest", expect: "fail", from: "a == b or b == c or a == c", to: "a == b or b == c", label: "Catches: isosceles with a == c missed" },
      { kind: "pytest", expect: "fail", from: " or b + c <= a", to: "", label: "Catches: long first side (5, 1, 1) accepted" },
      { kind: "pytest", expect: "fail", from: "a == b == c", to: "a == b", label: "Catches: equilateral check too loose" },
    ],
    hints: ["Each planted bug breaks one rule. Write one test per rule.", "Try every position for the repeated side: (2, 3, 2) as well as (2, 2, 3).", "Invalid cases: sides like (1, 2, 3), and the long side in every position, such as (5, 1, 1)."],
    explanation: "This is mutation testing: a suite is strong when every small mutation of the code makes at least one test fail.",
  },
];
