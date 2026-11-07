import React, { useEffect, useMemo, useRef } from "react";

/**
 * A small code editor with no dependencies: a highlighted layer under a
 * transparent textarea, sharing the same font metrics so the caret lines up.
 */

const KEYWORDS = {
  javascript:
    "async|await|break|case|catch|class|const|continue|default|delete|do|else|export|extends|" +
    "finally|for|from|function|if|import|in|instanceof|let|new|of|return|static|super|switch|this|" +
    "throw|try|typeof|var|void|while|yield|true|false|null|undefined",
  python:
    "and|as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|" +
    "global|if|import|in|is|lambda|None|nonlocal|not|or|pass|raise|return|True|False|try|while|with|yield",
  cpp:
    "auto|bool|break|case|catch|char|class|const|constexpr|continue|delete|do|double|else|enum|" +
    "explicit|extern|false|float|for|friend|if|include|inline|int|long|map|namespace|new|nullptr|" +
    "operator|pair|private|protected|public|queue|return|set|short|signed|size_t|sizeof|stack|static|" +
    "string|struct|switch|template|this|throw|true|try|typedef|typename|union|unsigned|using|vector|" +
    "virtual|void|while",
  java:
    "abstract|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|" +
    "extends|final|finally|float|for|if|implements|import|instanceof|int|interface|long|new|null|" +
    "package|private|protected|public|return|short|static|String|super|switch|this|throw|throws|" +
    "true|false|try|void|while",
};

const COMMENTS = {
  python: "#[^\\n]*",
  default: "\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/",
};

const tokenizerCache = new Map();

function getTokenizer(language) {
  if (tokenizerCache.has(language)) return tokenizerCache.get(language);

  const keywords = KEYWORDS[language] || KEYWORDS.javascript;
  const comment = language === "python" ? COMMENTS.python : COMMENTS.default;

  const regex = new RegExp(
    [
      `(?<comment>${comment})`,
      "(?<string>\"(?:[^\"\\\\\\n]|\\\\.)*\"|'(?:[^'\\\\\\n]|\\\\.)*'|`(?:[^`\\\\]|\\\\.)*`)",
      "(?<number>\\b\\d+(?:\\.\\d+)?\\b)",
      `(?<keyword>\\b(?:${keywords})\\b)`,
      "(?<fn>\\b[A-Za-z_$][\\w$]*(?=\\s*\\())",
      "(?<punct>[{}()\\[\\];,.]|=>|[+\\-*/%<>=!&|?:]+)",
    ].join("|"),
    "g"
  );

  tokenizerCache.set(language, regex);
  return regex;
}

const COLORS = {
  comment: "#64748b",
  string: "#86efac",
  number: "#fca5a5",
  keyword: "#7dd3fc",
  fn: "#fbbf24",
  punct: "#94a3b8",
};

const escapeHtml = (text) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function highlight(code, language) {
  let html = "";
  let lastIndex = 0;

  for (const match of code.matchAll(getTokenizer(language))) {
    const [type] = Object.entries(match.groups).find(([, value]) => value !== undefined) || [];
    if (!type) continue;

    html += escapeHtml(code.slice(lastIndex, match.index));
    html += `<span style="color:${COLORS[type]}">${escapeHtml(match[0])}</span>`;
    lastIndex = match.index + match[0].length;
  }

  return html + escapeHtml(code.slice(lastIndex));
}

const PAIRS = { "(": ")", "[": "]", "{": "}", '"': '"', "'": "'", "`": "`" };

export default function CodeEditor({
  value,
  onChange,
  onRun,
  language = "javascript",
  readOnly = false,
  minHeight = 320,
}) {
  const textareaRef = useRef(null);
  const highlightRef = useRef(null);
  const INDENT = language === "python" ? "    " : "  ";

  const lineCount = useMemo(() => value.split("\n").length, [value]);
  const highlighted = useMemo(() => highlight(value, language), [value, language]);

  // Keep the highlighted layer aligned with the textarea while scrolling.
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return undefined;

    const sync = () => {
      if (!highlightRef.current) return;
      highlightRef.current.scrollTop = textarea.scrollTop;
      highlightRef.current.scrollLeft = textarea.scrollLeft;
    };

    textarea.addEventListener("scroll", sync);
    return () => textarea.removeEventListener("scroll", sync);
  }, []);

  const replaceSelection = (insert, caretOffset = insert.length) => {
    const textarea = textareaRef.current;
    const { selectionStart: start, selectionEnd: end } = textarea;
    const next = value.slice(0, start) + insert + value.slice(end);

    onChange(next);
    requestAnimationFrame(() => {
      textarea.selectionStart = start + caretOffset;
      textarea.selectionEnd = start + caretOffset;
    });
  };

  const handleKeyDown = (event) => {
    const textarea = textareaRef.current;
    const { selectionStart: start, selectionEnd: end } = textarea;

    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      onRun?.();
      return;
    }

    if (event.key === "Tab") {
      event.preventDefault();

      if (event.shiftKey) {
        const lineStart = value.lastIndexOf("\n", start - 1) + 1;
        if (value.startsWith(INDENT, lineStart)) {
          const next = value.slice(0, lineStart) + value.slice(lineStart + INDENT.length);
          onChange(next);
          requestAnimationFrame(() => {
            textarea.selectionStart = Math.max(lineStart, start - INDENT.length);
            textarea.selectionEnd = Math.max(lineStart, end - INDENT.length);
          });
        }
        return;
      }

      replaceSelection(INDENT);
      return;
    }

    if (event.key === "Enter") {
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const currentLine = value.slice(lineStart, start);
      const indent = currentLine.match(/^\s*/)[0];
      const opensBlock =
        language === "python" ? /:\s*$/.test(currentLine) : /[{([]\s*$/.test(currentLine);
      const closesNext = /^\s*[})\]]/.test(value.slice(start));

      event.preventDefault();

      if (opensBlock && closesNext) {
        replaceSelection(`\n${indent}${INDENT}\n${indent}`, 1 + indent.length + INDENT.length);
        return;
      }

      replaceSelection(`\n${indent}${opensBlock ? INDENT : ""}`);
      return;
    }

    if (PAIRS[event.key] && start === end) {
      const closing = PAIRS[event.key];
      const nextChar = value[start];

      // Typing over an auto-inserted closer should step past it, not double it.
      if ((event.key === '"' || event.key === "'" || event.key === "`") && nextChar === event.key) {
        event.preventDefault();
        requestAnimationFrame(() => {
          textarea.selectionStart = start + 1;
          textarea.selectionEnd = start + 1;
        });
        return;
      }

      event.preventDefault();
      replaceSelection(event.key + closing, 1);
      return;
    }

    if (event.key === "Backspace" && start === end && start > 0) {
      const before = value[start - 1];
      const after = value[start];
      if (PAIRS[before] && PAIRS[before] === after) {
        event.preventDefault();
        const next = value.slice(0, start - 1) + value.slice(start + 1);
        onChange(next);
        requestAnimationFrame(() => {
          textarea.selectionStart = start - 1;
          textarea.selectionEnd = start - 1;
        });
      }
    }
  };

  const sharedType = {
    fontFamily:
      'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
    fontSize: "13px",
    lineHeight: "20px",
    tabSize: 2,
  };

  return (
    <div
      className="relative overflow-hidden rounded-md border border-slate-800 bg-[#0f1720]"
      style={{ minHeight }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-11 select-none border-r border-slate-800 bg-[#0b1118] py-3 text-right"
        style={{ ...sharedType, color: "#475569" }}
      >
        {Array.from({ length: lineCount }, (_, index) => (
          <div key={index} className="pr-2">
            {index + 1}
          </div>
        ))}
      </div>

      <pre
        ref={highlightRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-auto py-3 pl-14 pr-4"
        style={{ ...sharedType, color: "#e2e8f0", margin: 0, whiteSpace: "pre" }}
        dangerouslySetInnerHTML={{ __html: `${highlighted}\n` }}
      />

      <textarea
        ref={textareaRef}
        value={value}
        readOnly={readOnly}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        spellCheck="false"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        className="relative block w-full resize-none overflow-auto bg-transparent py-3 pl-14 pr-4 text-transparent caret-sky-300 outline-none"
        style={{ ...sharedType, minHeight, whiteSpace: "pre" }}
      />
    </div>
  );
}
