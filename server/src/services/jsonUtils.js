/**
 * Shared helpers for turning a model's reply into usable JSON.
 */
export function extractJsonString(raw = "") {
  const trimmed = raw.trim();

  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    return trimmed;
  }

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  return trimmed;
}

/**
 * Models sometimes stop mid-object when they hit the token ceiling. Close the
 * open strings/arrays/objects so a truncated answer still yields usable data.
 */
export function repairTruncatedJson(text = "") {
  const stack = [];
  let inString = false;
  let escaped = false;
  let lastSafeIndex = -1;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === "\\") {
      escaped = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (char === "{" || char === "[") {
      stack.push(char === "{" ? "}" : "]");
    } else if (char === "}" || char === "]") {
      stack.pop();
    }

    if (!stack.length && (char === "}" || char === "]")) {
      lastSafeIndex = i;
    }
  }

  if (lastSafeIndex >= 0) {
    return text.slice(0, lastSafeIndex + 1);
  }

  let repaired = text;

  if (inString) {
    repaired += '"';
  }

  // Drop a dangling key or comma left by the cut-off, then close what is open.
  repaired = repaired.replace(/,\s*("[^"]*"\s*:?\s*)?$/, "");

  return repaired + stack.reverse().join("");
}

export function safeParseJSON(raw, fallback = {}) {
  const extracted = extractJsonString(raw);

  try {
    return JSON.parse(extracted);
  } catch {
    try {
      const parsed = JSON.parse(repairTruncatedJson(extracted));
      console.warn("AI returned truncated JSON; recovered a partial result.");
      return parsed;
    } catch (error) {
      console.error("AI JSON parse failed:", raw?.slice(0, 300));
      return fallback;
    }
  }
}
