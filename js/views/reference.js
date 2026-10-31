import { codeBlock, escapeHtml } from "../dom.js";
import { pageHeader } from "./shared.js";

const entries = [
  { title: "Variables", code: 'name = "Ada"\nage = 36\nage = age + 1' },
  { title: "f-strings", code: 'price = 4.5\nprint(f"Total: {price * 2:.2f}")' },
  { title: "Conditions", code: 'if score >= 90:\n    grade = "A"\nelif score >= 75:\n    grade = "B"\nelse:\n    grade = "C"' },
  { title: "Loops", code: "for i in range(3):\n    print(i)\n\nwhile count > 0:\n    count -= 1" },
  { title: "Lists", code: "items = [3, 1, 2]\nitems.append(4)\nitems.sort()\nfirst = items[0]" },
  { title: "Dictionaries", code: 'stock = {"apple": 3}\nstock["pear"] = 5\ncount = stock.get("kiwi", 0)' },
  { title: "Functions", code: "def area(width, height=1):\n    return width * height\n\nresult = area(4, 2)" },
  { title: "Handling errors", code: 'try:\n    n = int(text)\nexcept ValueError:\n    print("Not a number")' },
  { title: "Testing", code: "def test_area():\n    assert area(4, 2) == 8\n    assert area(3) == 3" },
];

export function referenceView() {
  return {
    title: "Reference library",
    html: `
      <div class="page">
        ${pageHeader("Reference library", "Quick syntax lookups.", "The patterns you will reach for most. Short on purpose.")}
        <div class="grid grid-3">
          ${entries.map((e) => `
            <section class="card">
              <h2 style="font-size:var(--text-md)">${escapeHtml(e.title)}</h2>
              ${codeBlock(e.code, `${e.title} example`)}
            </section>`).join("")}
        </div>
      </div>`,
  };
}
