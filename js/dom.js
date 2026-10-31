// Small DOM helpers shared by views.
export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const KEYWORDS = new Set([
  "False", "None", "True", "and", "as", "assert", "break", "class", "continue", "def", "elif", "else",
  "except", "finally", "for", "from", "if", "import", "in", "is", "lambda", "not", "or", "pass",
  "raise", "return", "try", "while", "with", "yield", "match", "case",
]);

// Minimal Python highlighter for static examples. The editor gets real highlighting in phase 3.
export function highlightPython(code) {
  const pattern = /(#[^\n]*)|(f?"(?:[^"\\\n]|\\.)*"|f?'(?:[^'\\\n]|\\.)*')|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_]\w*\b)(?=\s*\()|(\b[A-Za-z_]\w*\b)/g;
  let html = "";
  let last = 0;
  for (const match of code.matchAll(pattern)) {
    html += escapeHtml(code.slice(last, match.index));
    const [text, comment, string, number, call, word] = match;
    const escaped = escapeHtml(text);
    if (comment) html += `<span class="tok-comment">${escaped}</span>`;
    else if (string) html += `<span class="tok-string">${escaped}</span>`;
    else if (number) html += `<span class="tok-number">${escaped}</span>`;
    else if (call) html += KEYWORDS.has(call) ? `<span class="tok-keyword">${escaped}</span>` : `<span class="tok-function">${escaped}</span>`;
    else if (word && KEYWORDS.has(word)) html += `<span class="tok-keyword">${escaped}</span>`;
    else html += escaped;
    last = match.index + text.length;
  }
  return html + escapeHtml(code.slice(last));
}

export function codeBlock(code, label = "Python example") {
  return `<pre class="code-block" aria-label="${escapeHtml(label)}"><code>${highlightPython(code)}</code></pre>`;
}

export function upcoming(phase, text) {
  return `<div class="notice" role="note"><span><strong>Coming in phase ${phase}.</strong> ${text}</span></div>`;
}
