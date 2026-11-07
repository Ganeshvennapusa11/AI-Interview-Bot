import { createChatCompletion } from "./groqService.js";
import { getPersona } from "./personas.js";
import { getCompanyTier } from "./companyTiers.js";
import { safeParseJSON } from "./jsonUtils.js";

/**
 * Deterministic fallback problems. The AI writes the challenge, but if it
 * returns something unusable the round still has to start, so every difficulty
 * has a known-good problem with known-good tests.
 */
const FALLBACK_CHALLENGES = {
  easy: {
    title: "Two Sum",
    prompt:
      "Given an array of integers `nums` and an integer `target`, return the indices of the two numbers that add up to the target. Exactly one solution exists and you may not use the same element twice. Return the indices in ascending order.",
    functionName: "twoSum",
    signature: "twoSum(nums, target)",
    starterCode:
      "function twoSum(nums, target) {\n  // return [i, j] with i < j\n}\n",
    starterCodeByLanguage: {
      javascript: "function twoSum(nums, target) {\n  // return [i, j] with i < j\n}\n",
      python: "def two_sum(nums, target):\n    # return [i, j] with i < j\n    pass\n",
      cpp: "#include <vector>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // return {i, j} with i < j\n}\n",
      java: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // return {i, j} with i < j\n    }\n}\n",
    },
    examples: [{ input: "nums = [2, 7, 11, 15], target = 9", output: "[0, 1]" }],
    constraints: ["2 <= nums.length <= 10000", "Only one valid answer exists"],
    targetComplexity: "O(n) time, O(n) space",
    tests: [
      { name: "basic pair", args: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { name: "answer at the end", args: [[3, 2, 4], 6], expected: [1, 2] },
      { name: "duplicate values", args: [[3, 3], 6], expected: [0, 1] },
      { name: "negative numbers", args: [[-1, -2, -3, -4], -6], expected: [1, 3] },
    ],
    scalingInput:
      "const nums = Array.from({ length: n }, (_, i) => i + 1); return [nums, (n - 1) + n];",
    hints: ["A hash map of value to index turns the inner loop into a lookup."],
  },
  medium: {
    title: "Longest Substring Without Repeating Characters",
    prompt:
      "Given a string `s`, return the length of the longest substring that contains no repeated characters.",
    functionName: "lengthOfLongestSubstring",
    signature: "lengthOfLongestSubstring(s)",
    starterCode: "function lengthOfLongestSubstring(s) {\n  // return a number\n}\n",
    starterCodeByLanguage: {
      javascript: "function lengthOfLongestSubstring(s) {\n  // return a number\n}\n",
      python: "def length_of_longest_substring(s):\n    # return an int\n    pass\n",
      cpp: "#include <string>\nusing namespace std;\n\nint lengthOfLongestSubstring(string s) {\n    // return an int\n}\n",
      java: "class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // return an int\n    }\n}\n",
    },
    examples: [{ input: 's = "abcabcbb"', output: "3" }],
    constraints: ["0 <= s.length <= 50000"],
    targetComplexity: "O(n) time, O(min(n, charset)) space",
    tests: [
      { name: "repeating block", args: ["abcabcbb"], expected: 3 },
      { name: "all same", args: ["bbbbb"], expected: 1 },
      { name: "mixed", args: ["pwwkew"], expected: 3 },
      { name: "empty string", args: [""], expected: 0 },
      { name: "no repeats", args: ["abcdef"], expected: 6 },
    ],
    scalingInput:
      "const alphabet = 'abcdefghijklmnopqrstuvwxyz'; let out = ''; for (let i = 0; i < n; i++) out += alphabet[i % 26]; return [out];",
    hints: ["Slide a window and remember the last index of each character."],
  },
  hard: {
    title: "Merge Overlapping Intervals",
    prompt:
      "Given an array of `[start, end]` intervals, merge every overlapping interval and return the result sorted by start time.",
    functionName: "mergeIntervals",
    signature: "mergeIntervals(intervals)",
    starterCode: "function mergeIntervals(intervals) {\n  // return an array of [start, end]\n}\n",
    starterCodeByLanguage: {
      javascript: "function mergeIntervals(intervals) {\n  // return an array of [start, end]\n}\n",
      python: "def merge_intervals(intervals):\n    # return a list of [start, end]\n    pass\n",
      cpp: "#include <vector>\nusing namespace std;\n\nvector<vector<int>> mergeIntervals(vector<vector<int>>& intervals) {\n    // return merged intervals\n}\n",
      java: "class Solution {\n    public int[][] mergeIntervals(int[][] intervals) {\n        // return merged intervals\n    }\n}\n",
    },
    examples: [
      { input: "[[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]" },
    ],
    constraints: ["0 <= intervals.length <= 10000"],
    targetComplexity: "O(n log n) time, O(n) space",
    tests: [
      {
        name: "classic overlap",
        args: [[[1, 3], [2, 6], [8, 10], [15, 18]]],
        expected: [[1, 6], [8, 10], [15, 18]],
      },
      { name: "touching intervals", args: [[[1, 4], [4, 5]]], expected: [[1, 5]] },
      { name: "unsorted input", args: [[[5, 6], [1, 3], [2, 4]]], expected: [[1, 4], [5, 6]] },
      { name: "empty", args: [[]], expected: [] },
    ],
    scalingInput:
      "const out = []; for (let i = 0; i < n; i++) out.push([i * 2, i * 2 + 3]); return [out];",
    hints: ["Sort by start, then extend the last interval while it overlaps."],
  },
};

/** The built-in problem for a difficulty, used whenever the model cannot supply one. */
export const getFallbackChallenge = (difficulty = "medium") =>
  FALLBACK_CHALLENGES[String(difficulty).toLowerCase()] || FALLBACK_CHALLENGES.medium;

/** camelCase -> snake_case, so the Python signature reads naturally. */
const pythonName = (name = "") =>
  name.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();

const isPlainValue = (value) =>
  value === null || ["string", "number", "boolean"].includes(typeof value) || Array.isArray(value) ||
  (typeof value === "object" && value.constructor === Object);

/** A challenge is only usable if we can actually run its tests. */
export const normalizeChallenge = (challenge, difficulty = "medium") => {
  const fallback = FALLBACK_CHALLENGES[difficulty] || FALLBACK_CHALLENGES.medium;

  if (!challenge || typeof challenge !== "object") return fallback;

  const functionName = String(challenge.functionName || "").trim();
  const tests = Array.isArray(challenge.tests) ? challenge.tests : [];

  const validTests = tests
    .filter((test) => test && Array.isArray(test.args) && "expected" in test)
    .filter((test) => test.args.every(isPlainValue) && isPlainValue(test.expected))
    .slice(0, 8)
    .map((test, index) => ({
      name: String(test.name || `case ${index + 1}`).slice(0, 80),
      args: test.args,
      expected: test.expected,
    }));

  if (!/^[A-Za-z_$][\w$]*$/.test(functionName) || validTests.length < 3) {
    console.warn("Coding challenge from the model was unusable; using the fallback problem.");
    return fallback;
  }

  return {
    title: String(challenge.title || "Coding Challenge").slice(0, 120),
    prompt: String(challenge.prompt || "").slice(0, 2000),
    functionName,
    signature: String(challenge.signature || `${functionName}(...)`).slice(0, 200),
    starterCode:
      String(challenge.starterCode || `function ${functionName}() {\n  // your code here\n}\n`).slice(0, 2000),
    starterCodeByLanguage: {
      javascript: String(
        challenge.starterCodeByLanguage?.javascript ||
          challenge.starterCode ||
          `function ${functionName}() {\n  // your code here\n}\n`
      ).slice(0, 2000),
      python: String(
        challenge.starterCodeByLanguage?.python || `def ${pythonName(functionName)}():\n    pass\n`
      ).slice(0, 2000),
      cpp: String(challenge.starterCodeByLanguage?.cpp || `// implement ${functionName}\n`).slice(0, 2000),
      java: String(
        challenge.starterCodeByLanguage?.java || `class Solution {\n    // implement ${functionName}\n}\n`
      ).slice(0, 2000),
    },
    pythonFunctionName: pythonName(functionName),
    examples: (Array.isArray(challenge.examples) ? challenge.examples : [])
      .slice(0, 3)
      .map((example) => ({
        input: String(example?.input || "").slice(0, 300),
        output: String(example?.output || "").slice(0, 300),
        explanation: String(example?.explanation || "").slice(0, 300),
      })),
    constraints: (Array.isArray(challenge.constraints) ? challenge.constraints : [])
      .slice(0, 5)
      .map((item) => String(item).slice(0, 200)),
    targetComplexity: String(challenge.targetComplexity || "").slice(0, 120),
    // Optional generator body used to measure runtime growth. Never required:
    // without it the round simply skips the complexity measurement.
    scalingInput:
      typeof challenge.scalingInput === "string" && challenge.scalingInput.length < 600
        ? challenge.scalingInput
        : "",
    tests: validTests,
    hints: (Array.isArray(challenge.hints) ? challenge.hints : []).slice(0, 2).map((h) => String(h).slice(0, 200)),
  };
};

export const generateCodingChallenge = async ({
  role = "Software Engineer",
  difficulty = "medium",
  companyType = "General",
  personaId,
  parsedResume = {},
  askedTitles = [],
}) => {
  const persona = getPersona(personaId);
  const tier = getCompanyTier(companyType);
  const skills = (parsedResume.skills || []).slice(0, 12).join(", ");

  const prompt = `
You are ${persona.label}, running the live coding round for a ${role} interview.

${persona.questionGuidance}

Difficulty: ${difficulty}
Company bar: level ${tier.level} - ${tier.label}
${tier.dsaGuidance}
Candidate skills: ${skills || "Not provided"}
Already asked: ${askedTitles.slice(0, 5).join(" | ") || "None"}

Write ONE JavaScript coding problem that can be graded by running unit tests.

Hard rules:
- The solution must be a single pure function with a deterministic return value.
- No randomness, no dates, no I/O, no classes, no async, no external libraries.
- Arguments and expected values must be JSON values (numbers, strings, booleans, arrays, plain objects).
- If order could be ambiguous, state the required order in the prompt so only one output is correct.
- Provide 4 to 6 tests including at least one edge case.
${
  tier.level === 3
    ? '- This is a big-tech bar: the problem must have a naive solution that is too slow, so the target complexity genuinely matters. State the constraint that rules the brute force out.'
    : tier.level === 1
      ? "- Keep it to a single concept with no hidden traps."
      : "- Combine at most two concepts."
}
- "args" is the full argument list for one call, so a two-argument function has two entries.
- "starterCodeByLanguage" must contain the same function in JavaScript, Python (snake_case name), C++ and Java. Signature only, no solution.
- "scalingInput" must build a VALID, SOLVABLE input of size n for any n up to 100000, using only plain JavaScript. It is used to measure how the candidate's runtime grows, so it must not print anything or use randomness.

Return valid JSON only:
{
  "title": "string",
  "prompt": "problem statement, 2-5 sentences",
  "functionName": "camelCaseName",
  "signature": "functionName(arg1, arg2)",
  "starterCode": "function functionName(arg1) {\\n  // your code here\\n}\\n",
  "starterCodeByLanguage": {
    "javascript": "function functionName(arg1) {\\n  // your code here\\n}\\n",
    "python": "def function_name(arg1):\\n    pass\\n",
    "cpp": "// includes plus the function signature only\\n",
    "java": "class Solution {\\n    // method signature only\\n}\\n"
  },
  "examples": [{ "input": "string", "output": "string", "explanation": "string" }],
  "constraints": ["string"],
  "targetComplexity": "string",
  "tests": [{ "name": "string", "args": [], "expected": null }],
  "scalingInput": "JS function body taking n and returning the argument array, e.g. return [Array.from({length: n}, (_, i) => i), n - 1];",
  "hints": ["string"]
}
`.trim();

  const completion = await createChatCompletion({
    messages: [
      {
        role: "system",
        content:
          "You design runnable JavaScript interview problems. Respond with valid JSON only.",
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.6,
    max_tokens: 2200,
  });

  const parsed = safeParseJSON(completion.choices[0]?.message?.content, null);
  return normalizeChallenge(parsed, String(difficulty).toLowerCase());
};

const LANGUAGE_LABELS = {
  javascript: "JavaScript",
  python: "Python",
  cpp: "C++",
  java: "Java",
};

export const reviewCodeSubmission = async ({
  challenge,
  code,
  language = "javascript",
  executed = true,
  testSummary = {},
  complexity = null,
  role = "Software Engineer",
  personaId,
}) => {
  const persona = getPersona(personaId);
  const { passed = 0, total = 0, failures = [] } = testSummary || {};
  const languageLabel = LANGUAGE_LABELS[language] || "JavaScript";

  const prompt = `
You are ${persona.label}, reviewing a candidate's code in a ${role} interview.

${persona.evaluationGuidance}

Language: ${languageLabel}
Problem: ${challenge?.title || "Coding challenge"}
${String(challenge?.prompt || "").slice(0, 900)}
Target complexity: ${challenge?.targetComplexity || "not specified"}

Measured runtime growth (from timing this exact code on inputs of increasing size - treat as ground truth):
${
  complexity?.bestFit
    ? `- Best fit: ${complexity.bestFit} (R2 ${complexity.r2}). Samples: ${(complexity.samples || [])
        .map((sample) => `n=${sample.n}:${sample.ms}ms`)
        .join(", ")}`
    : "- Not measured."
}

${
  executed
    ? `Test results (already executed - treat these as ground truth):
Passed ${passed} of ${total}.
${failures.slice(0, 4).map((f) => `- FAILED ${f.name}: expected ${f.expected}, got ${f.actual}`).join("\n") || "- No failures"}`
    : `The code was NOT executed: ${languageLabel} cannot run in the candidate's browser.
Judge correctness by reading the code carefully. Trace it against the examples in the problem
statement and say explicitly if it fails a case. Do not claim tests passed or failed.
State the complexity from reading the code, and say that it was reasoned about, not measured.`
}

Candidate code:
\`\`\`${language}
${String(code || "").slice(0, 4000)}
\`\`\`

Judge the approach, not just the test results. ${
  executed ? "Correctness must reflect the tests, and" : "Correctness must reflect your reading of the code, and"
}
${
  complexity?.bestFit
    ? '"complexityAssessment" must agree with the measured growth above rather than contradicting it. If the measured growth is worse than the target complexity, say so plainly and score complexity accordingly.'
    : '"complexityAssessment" is your own reading of the code. Say that it was reasoned about rather than measured.'
}
Return valid JSON only:
{
  "feedback": "3-5 sentences addressed to the candidate",
  "score": {
    "overall": 0,
    "correctness": 0,
    "complexity": 0,
    "readability": 0,
    "edgeCases": 0
  },
  "complexityAssessment": "the actual time and space complexity of this code",
  "strengths": ["string"],
  "improvements": ["string"],
  "idealApproach": ["step", "step"],
  "followUpQuestion": "string"
}
`.trim();

  const completion = await createChatCompletion({
    messages: [
      { role: "system", content: "You are a strict but fair code reviewer. Respond with valid JSON only." },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
    max_tokens: 1600,
  });

  return safeParseJSON(completion.choices[0]?.message?.content, {
    feedback: "Could not review the code automatically. The test results above still stand.",
    score: { overall: 0, correctness: 0, complexity: 0, readability: 0, edgeCases: 0 },
    complexityAssessment: "",
    strengths: [],
    improvements: [],
    idealApproach: [],
    followUpQuestion: "",
  });
};
