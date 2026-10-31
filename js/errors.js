// Plain-language debugging help for the errors beginners hit most.
const explanations = {
  SyntaxError: "Python couldn't read this line. Look for a missing colon, bracket or quote on the line shown or the line just before it.",
  IndentationError: "The indentation doesn't line up. Lines in the same block need the same number of spaces, and the line after a colon must be indented.",
  NameError: "Python doesn't know this name. Check the spelling and capitals, and make sure the variable is assigned before this line runs.",
  TypeError: "An operation got a value of the wrong type, such as adding text to a number. Convert one side with `int()`, `float()` or `str()`.",
  ValueError: "The type was right but the value wasn't, for example `int(\"abc\")`. Check what was typed or passed in.",
  IndexError: "You asked for a position that doesn't exist. The last index of a sequence is `len(x) - 1`, or use `x[-1]`.",
  KeyError: "That key isn't in the dictionary. Check the spelling, or use `.get(key)` to avoid the crash.",
  ZeroDivisionError: "Something was divided by zero. Decide what should happen in that case and handle it before dividing.",
  AttributeError: "This value doesn't have that method or attribute. Check its type and the spelling of the name after the dot.",
  EOFError: "The program asked for more input than it was given. Add values to the Input box (one per line), or check how many times `input()` runs.",
  AssertionError: "An `assert` failed: the condition was False. Compare the actual value with what the test expected.",
  RecursionError: "A function kept calling itself without stopping. Check that it reaches a base case.",
  TimeoutError: "The program didn't finish. A `while` loop whose condition never becomes False is the usual cause.",
  ModuleNotFoundError: "That module isn't available here. PyForge runs Python in your browser with the standard library only.",
};

export function explainError(type) {
  return explanations[type] ?? "Read the last line of the traceback for the error type, and the line above it for where it happened.";
}
