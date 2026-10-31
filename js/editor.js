// CodeMirror 6 editor configured for PyForge: Python mode, theme from design tokens, run shortcuts.
import {
  Compartment,
  EditorState,
  EditorView,
  HighlightStyle,
  basicSetup,
  indentUnit,
  indentWithTab,
  keymap,
  python,
  syntaxHighlighting,
  tags,
} from "../vendor/codemirror/codemirror.bundle.js";

const theme = EditorView.theme(
  {
    "&": { backgroundColor: "var(--color-bg)", color: "var(--syntax-variable)", height: "100%" },
    ".cm-scroller": { fontFamily: "var(--font-mono)", lineHeight: "1.65", fontVariantLigatures: "none" },
    ".cm-content": { caretColor: "var(--color-text)", padding: "12px 0" },
    ".cm-cursor": { borderLeftColor: "var(--color-text)" },
    ".cm-gutters": { backgroundColor: "var(--color-bg)", color: "var(--syntax-comment)", border: "none" },
    ".cm-activeLine": { backgroundColor: "rgba(255,255,255,0.03)" },
    ".cm-activeLineGutter": { backgroundColor: "transparent", color: "var(--color-text-muted)" },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection": { backgroundColor: "rgba(130,170,255,0.25)" },
    ".cm-matchingBracket": { backgroundColor: "rgba(255,255,255,0.08)", outline: "1px solid var(--color-border)" },
    ".cm-tooltip": { backgroundColor: "var(--color-surface-raised)", border: "1px solid var(--color-border)" },
    ".cm-tooltip-autocomplete > ul > li[aria-selected]": { backgroundColor: "var(--color-accent-soft)", color: "var(--color-text)" },
    ".cm-error-line": { backgroundColor: "rgba(240,120,127,0.12)" },
  },
  { dark: true }
);

const highlight = HighlightStyle.define([
  { tag: [tags.keyword, tags.controlKeyword, tags.operatorKeyword, tags.definitionKeyword, tags.moduleKeyword], color: "var(--syntax-keyword)" },
  { tag: [tags.string, tags.special(tags.string)], color: "var(--syntax-string)" },
  { tag: [tags.number, tags.bool, tags.null], color: "var(--syntax-number)" },
  { tag: [tags.function(tags.variableName), tags.function(tags.propertyName), tags.definition(tags.function(tags.variableName))], color: "var(--syntax-function)" },
  { tag: tags.comment, color: "var(--syntax-comment)", fontStyle: "italic" },
  { tag: [tags.className, tags.definition(tags.className)], color: "var(--syntax-number)" },
]);

const fontCompartment = new Compartment();
const indentCompartment = new Compartment();

function fontTheme(size) {
  return EditorView.theme({ "&": { fontSize: `${size}px` } });
}

function indentConfig(size) {
  return [indentUnit.of(" ".repeat(size)), EditorState.tabSize.of(size)];
}

export function createEditor(parent, { doc, fontSize = 14, tabSize = 4, onChange, onRun, onCheck, label = "Python code editor" }) {
  const view = new EditorView({
    parent,
    state: EditorState.create({
      doc,
      extensions: [
        basicSetup,
        python(),
        theme,
        syntaxHighlighting(highlight),
        fontCompartment.of(fontTheme(fontSize)),
        indentCompartment.of(indentConfig(tabSize)),
        keymap.of([
          { key: "Mod-Enter", run: () => (onRun?.(), true) },
          { key: "Shift-Mod-Enter", run: () => (onCheck?.(), true) },
          indentWithTab,
        ]),
        EditorView.contentAttributes.of({ "aria-label": label }),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) onChange?.(update.state.doc.toString());
        }),
      ],
    }),
  });

  return {
    view,
    getValue: () => view.state.doc.toString(),
    setValue(text) {
      view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: text } });
    },
    setFontSize(size) {
      view.dispatch({ effects: fontCompartment.reconfigure(fontTheme(size)) });
    },
    setTabSize(size) {
      view.dispatch({ effects: indentCompartment.reconfigure(indentConfig(size)) });
    },
    focusLine(line) {
      if (!line || line > view.state.doc.lines) return;
      const { from } = view.state.doc.line(line);
      view.dispatch({ selection: { anchor: from }, scrollIntoView: true });
      view.focus();
    },
    focus: () => view.focus(),
    destroy: () => view.destroy(),
  };
}
