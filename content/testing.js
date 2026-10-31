// Module 12: Testing and Debugging. "pytest" checks run your test_ functions, the way pytest would,
// against the given code and against deliberately broken versions of it.
export default {
  assert: {
    concept: "`assert condition` does nothing when the condition is True and stops the program with `AssertionError` when it is False. A test is code that asserts what a correct result looks like: normal cases, edge cases and bad input.",
    syntax: `assert add(2, 3) == 5
assert is_even(0), "0 should be even"`,
    example: {
      code: `def add(a, b):
    return a + b

assert add(2, 3) == 5
assert add(-1, 1) == 0
print("All tests passed")`,
      note: "If any assert failed, the print would never run.",
    },
    predict: `assert 2 + 2 == 4
print("ok")`,
    mentalModel: "Test at the boundaries. If a rule changes at 18, test 17, 18 and 19: off-by-one bugs live exactly there.",
    mistake: {
      code: `assert (add(2, 3) == 6, "bad")  # never fails`,
      note: "With brackets, this asserts a tuple, and a non-empty tuple is always True. Write `assert add(2, 3) == 6, \"bad\"`.",
    },
    exercises: [
      {
        type: "implement",
        title: "Guard the boundary",
        prompt: "Write asserts for `is_adult` that pass now but would fail if someone broke the age-18 boundary. Don't change the function.",
        starter: `def is_adult(age):
    return age >= 18

# Write your asserts below
`,
        tests: [
          { kind: "pytest", expect: "pass", label: "Your asserts pass on the correct function" },
          { kind: "source", uses: "Assert", label: "Uses assert", hint: "Write lines like `assert is_adult(30) == True`." },
          { kind: "pytest", expect: "fail", from: "age >= 18", to: "age > 18", label: "Catches a bug: 18-year-olds rejected" },
          { kind: "pytest", expect: "fail", from: "age >= 18", to: "age >= 17", label: "Catches a bug: 17-year-olds accepted" },
        ],
        hints: ["What happens exactly at 18? And just below?", "Assert both sides: `assert is_adult(18)` and `assert not is_adult(17)`."],
        explanation: "A test is only as good as the bugs it catches. Checking 17 and 18 pins the boundary from both sides.",
      },
      {
        type: "trace",
        title: "Where it stops",
        prompt: "What does this program print before it stops?",
        code: `def square(n):
    return n * n

assert square(3) == 9
print("first")
assert square(-2) == -4
print("second")`,
        hints: ["What is (-2) * (-2)?", "A failed assert stops the program right there."],
        explanation: "`square(-2)` is 4, so the second assert fails and `second` never prints.",
      },
      {
        type: "debug",
        title: "Fix the code, not the test",
        prompt: "The asserts describe correct behaviour, and they fail. Fix `discount` so every test passes. Keep the asserts.",
        starter: `def discount(price, percent):
    return price - percent / 100

assert discount(100, 10) == 90
assert discount(50, 50) == 25
assert discount(80, 0) == 80
print("All tests passed")
`,
        tests: [
          { kind: "output", expected: "All tests passed" },
          { kind: "expr", code: "discount(200, 25)", expected: "150.0" },
          { kind: "source", contains: "assert discount(50, 50) == 25", label: "Keeps the original asserts", hint: "Change the function, not the tests." },
        ],
        hints: ["10% off 100 should take away 10, not 0.1.", "The amount taken off is `price * percent / 100`."],
        explanation: "When a test fails, first ask whether the test or the code is wrong. Here the test matches the spec, so the code changes.",
      },
    ],
  },

  "writing-tests": {
    concept: "pytest finds functions whose names start with `test_` and runs them. Each test checks one behaviour and is named for what it expects, like `test_empty_cart_total_is_zero`. Arrange the input, act by calling the code, then assert the result.",
    syntax: `def test_name_says_what_should_happen():
    result = function(some_input)
    assert result == expected`,
    example: {
      code: `def cart_total(prices):
    return sum(prices)

def test_total_adds_prices():
    assert cart_total([2, 3]) == 5

def test_empty_cart_is_zero():
    assert cart_total([]) == 0

test_total_adds_prices()
test_empty_cart_is_zero()
print("2 passed")`,
      note: "Here we call the tests ourselves. pytest finds and calls them for you; so does Check in PyForge.",
    },
    predict: `def test_upper():
    assert "ab".upper() == "XY"

print("defined")`,
    mentalModel: "A test that can't fail is useless. After writing one, break the code on purpose and make sure the test goes red.",
    mistake: {
      code: `def test_add():
    add(2, 2) == 4  # compares, then throws the answer away`,
      note: "Without `assert`, this test always passes.",
    },
    exercises: [
      {
        type: "implement",
        title: "Test a password rule",
        prompt: "A strong password has at least 8 characters and at least one digit. Write at least two `test_` functions for `is_strong`. Check runs them like pytest, and also against broken versions of the function.",
        starter: `def is_strong(password):
    return len(password) >= 8 and any(ch.isdigit() for ch in password)


def test_long_password_with_digit_is_strong():
    assert is_strong("secret123")

# Add more tests below
`,
        tests: [
          { kind: "pytest", expect: "pass", min: 2, label: "At least two tests, all passing on the correct code" },
          { kind: "pytest", expect: "fail", from: "len(password) >= 8", to: "len(password) >= 7", label: "Catches a bug: 7 characters accepted" },
          { kind: "pytest", expect: "fail", from: " and any(ch.isdigit() for ch in password)", to: "", label: "Catches a bug: digit rule forgotten" },
        ],
        hints: ["Test the failure cases too: `assert not is_strong(...)`.", "Try a 7-character password with a digit.", "Try a long password with no digits."],
        explanation: "Good tests cover each rule separately, right at its edge, so any single broken rule makes one test fail.",
      },
      {
        type: "debug",
        title: "Tax bug",
        prompt: "Tax is 12%, but `add_tax` charges 20%. Fix it, and add a `test_` function that checks the 12% rule.",
        starter: `def add_tax(amount):
    return round(amount * 1.2, 2)

# Add a test_ function below
`,
        tests: [
          { kind: "expr", code: "add_tax(100)", expected: "112.0" },
          { kind: "expr", code: "add_tax(10)", expected: "11.2" },
          { kind: "pytest", expect: "pass", min: 1, label: "Your test passes on the fixed code" },
        ],
        hints: ["12% tax means multiplying by 1.12.", "A test: `def test_adds_12_percent(): assert add_tax(100) == 112.0`."],
        explanation: "The test you add now becomes a regression test: if anyone changes the rate back, it fails.",
      },
      {
        type: "implement",
        title: "Boundary tests",
        prompt: "Shipping costs 5 up to 1 kg, 10 up to 5 kg, and 20 above that. Write `test_` functions that would catch a mistake at either boundary.",
        starter: `def shipping_cost(weight):
    if weight <= 1:
        return 5
    elif weight <= 5:
        return 10
    return 20

# Write your tests below
`,
        tests: [
          { kind: "pytest", expect: "pass", min: 1, label: "Your tests pass on the correct code" },
          { kind: "pytest", expect: "fail", from: "weight <= 1:", to: "weight < 1:", label: "Catches a bug at exactly 1 kg" },
          { kind: "pytest", expect: "fail", from: "weight <= 5:", to: "weight < 5:", label: "Catches a bug at exactly 5 kg" },
        ],
        hints: ["Which weights sit exactly on a boundary?", "Assert `shipping_cost(1) == 5` and `shipping_cost(5) == 10`."],
        explanation: "Boundary value analysis is a core QA technique: test on, just below and just above each edge.",
      },
    ],
  },

  "find-the-bug": {
    concept: "Debugging is a loop: reproduce the bug, write a test that fails because of it, find the cause, fix it, then run every test again. The failing test stays as a regression test so the bug can't quietly return.",
    syntax: `# 1. Reproduce   2. Write a failing test   3. Fix   4. Rerun all tests`,
    example: {
      code: `def last_item(items):
    return items[len(items)]  # bug

try:
    last_item([1, 2, 3])
except IndexError as error:
    print("Reproduced:", error)`,
      note: "Reproducing the bug reliably is the first step to fixing it.",
    },
    predict: `def average(nums):
    return sum(nums) / len(nums)

print(average([2, 4]))`,
    mentalModel: "Read a traceback from the bottom: the last line names the error, the line above it shows where it happened.",
    mistake: {
      code: `try:
    total = average(prices)
except ZeroDivisionError:
    total = 0  # hides the bug instead of deciding what empty should mean`,
      note: "Fix the cause in the function, not the symptom at every caller.",
    },
    exercises: [
      {
        type: "debug",
        title: "Off by one",
        prompt: "`count_up(n)` should return the list `[1, 2, ..., n]`. It's missing the last number. Fix it.",
        starter: `def count_up(n):
    return list(range(1, n))

print(count_up(3))
`,
        tests: [
          { kind: "expr", code: "count_up(3)", expected: "[1, 2, 3]" },
          { kind: "expr", code: "count_up(1)", expected: "[1]" },
          { kind: "expr", code: "count_up(0)", expected: "[]" },
        ],
        hints: ["`range` never includes its stop value."],
        explanation: "`range(1, n + 1)` includes n. Testing n = 0 and n = 1 confirms the edges.",
      },
      {
        type: "debug",
        title: "Loyalty tiers",
        prompt: "Members with 5 or more years get 20% off, 2 or more years get 10%, others 0. Customers on exactly 2 or 5 years are complaining. Fix it.",
        starter: `def member_discount(years):
    if years > 5:
        return 20
    elif years > 2:
        return 10
    return 0
`,
        tests: [
          { kind: "expr", code: "member_discount(5)", expected: "20" },
          { kind: "expr", code: "member_discount(2)", expected: "10" },
          { kind: "expr", code: "member_discount(1)", expected: "0" },
          { kind: "expr", code: "member_discount(10)", expected: "20" },
          { kind: "expr", code: "member_discount(4)", expected: "10" },
        ],
        hints: ["\"5 or more\" includes 5.", "Use `>=`."],
        explanation: "Complaints at exact boundary values almost always mean `>` where `>=` was meant.",
      },
      {
        type: "debug",
        title: "Empty cart crash",
        prompt: "`average_price([])` crashes with ZeroDivisionError. It should return `0.0` for an empty list. Fix it.",
        starter: `def average_price(prices):
    return sum(prices) / len(prices)
`,
        tests: [
          { kind: "expr", code: "average_price([])", expected: "0.0" },
          { kind: "expr", code: "average_price([2, 4])", expected: "3.0" },
          { kind: "expr", code: "average_price([5])", expected: "5.0" },
        ],
        hints: ["Handle the empty case first, before dividing.", "`if not prices: return 0.0`."],
        explanation: "Deciding what empty input should return is part of the spec, so it belongs in the function.",
      },
    ],
  },
};
