/**
 * A deterministic, non-AI answer grader.
 *
 * It exists for three reasons:
 *   1. It is the control condition the LLM grader is measured against.
 *   2. It explains itself - every point is traceable to a signal.
 *   3. It keeps the app usable when the AI provider is unavailable.
 *
 * No model, no network. Same input always produces the same score.
 */
import {
  containsNormalizedTerm,
  getKeywordAliases,
  getRoleExpectedKeywords,
  normalizeToken,
} from "./textAnalysis.js";

const STOPWORDS = new Set(
  ("a an the and or but if then than that this these those of in on at to for with by from as is are was were be been being " +
    "do does did doing have has had you your yours i me my we our they them it its how what when where which who why can could " +
    "would should will shall may might must about into over under again more most some such no nor not only own same so too very")
    .split(" ")
);

const FILLERS = ["um", "uh", "like", "you know", "basically", "actually", "literally", "i mean", "sort of", "kind of"];
const HEDGES = ["maybe", "i think", "i guess", "probably", "perhaps", "not sure", "i believe", "something like"];

const STAR_MARKERS = {
  situation: /\b(context|situation|project|at the time|we were|the team was|background)\b/i,
  task: /\b(task|goal|objective|responsible|needed to|had to|challenge|problem was)\b/i,
  action: /\b(i built|i implemented|i designed|i wrote|i led|i fixed|i optimi[sz]ed|i chose|i migrated|my approach)\b/i,
  result: /\b(result|impact|improved|reduced|increased|saved|dropped|grew|led to|outcome)\b/i,
};

const TECHNICAL_MARKERS = {
  definition: /\b(is a|refers to|means that|is used to|defined as|is when)\b/i,
  mechanism: /\b(works by|internally|under the hood|it does this by|the way it works|behind the scenes|algorithm|process)\b/i,
  example: /\b(for example|for instance|such as|e\.g\.|in my project|in our case|say you)\b/i,
  tradeoff: /\b(tradeoff|trade-off|downside|drawback|instead of|compared to|whereas|the cost is|limitation|but it)\b/i,
};

// Domain vocabulary that signals technical substance regardless of the role.
const TECH_LEXICON = [
  "index", "indexes", "cache", "caching", "query", "queries", "schema", "join", "joins",
  "latency", "throughput", "complexity", "algorithm", "hash", "map", "array", "tree", "graph",
  "recursion", "pointer", "memory", "heap", "stack", "thread", "threads", "async", "await",
  "promise", "concurrency", "race condition", "deadlock", "transaction", "acid", "normalisation",
  "normalization", "partition", "shard", "replica", "load balancer", "queue", "worker", "batch",
  "pagination", "rate limit", "retry", "timeout", "idempotent", "middleware", "endpoint", "payload",
  "token", "session", "cookie", "hashing", "encryption", "validation", "sanitise", "sanitize",
  "state", "props", "hook", "render", "virtual dom", "bundle", "lazy load", "debounce", "throttle",
  "migration", "rollback", "deploy", "pipeline", "container", "docker", "test", "tests", "mock",
  "unit test", "integration test", "profiler", "benchmark", "explain", "big o", "o(n)", "o(1)",
  "bottleneck", "optimise", "optimize", "refactor", "edge case", "null", "exception", "log",
];

const EVIDENCE = /(\d+(\.\d+)?\s*(%|percent|ms|milliseconds?|seconds?|minutes?|hours?|x|times|users?|requests?|rows?|records?|gb|mb|kb|k\b|million|thousand))|(\bO\(|\bo\(n)/i;
const REASONING = /\b(because|since|therefore|so that|as a result|which means|the reason|due to|in order to|otherwise|however|although)\b/i;

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);
const round1 = (value) => Math.round(value * 10) / 10;

const words = (text = "") => normalizeToken(text).split(" ").filter(Boolean);

const countMatches = (text, phrases) =>
  phrases.reduce((total, phrase) => {
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const matches = text.match(new RegExp(`\\b${escaped}\\b`, "gi"));
    return total + (matches ? matches.length : 0);
  }, 0);

/** Content words from the question, used to check the answer is on topic. */
const questionTerms = (question = "") => {
  const seen = new Set();

  return words(question)
    .filter((word) => word.length > 3 && !STOPWORDS.has(word))
    .filter((word) => (seen.has(word) ? false : seen.add(word)))
    .slice(0, 12);
};

const lengthFitScore = (wordCount) => {
  if (wordCount === 0) return 0;
  if (wordCount < 25) return clamp(wordCount / 60);
  if (wordCount < 60) return 0.45 + ((wordCount - 25) / 35) * 0.4;
  if (wordCount <= 200) return 1;
  if (wordCount <= 320) return 1 - ((wordCount - 200) / 120) * 0.25;
  return 0.7;
};

const readabilityScore = (text) => {
  const sentences = text.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean);
  if (!sentences.length) return 0;

  const avgWords = words(text).length / sentences.length;
  if (avgWords <= 8) return 0.7;
  if (avgWords <= 24) return 1;
  if (avgWords <= 38) return 0.75;
  return 0.5;
};

/**
 * @returns {{score:number, breakdown:object, matchedTerms:string[], missingTerms:string[], notes:string[]}}
 */
export function gradeAnswerWithoutAI({
  question = "",
  answer = "",
  role = "Software Engineer",
  roundType = "technical_1_dsa",
} = {}) {
  const text = String(answer || "").trim();
  const wordList = words(text);
  const wordCount = wordList.length;
  const isBehavioural = /hr|managerial/.test(roundType);

  if (wordCount < 3) {
    return {
      score: 0,
      breakdown: { coverage: 0, structure: 0, evidence: 0, reasoning: 0, specificity: 0, lengthFit: 0, onTopic: 0 },
      matchedTerms: [],
      missingTerms: [],
      notes: ["The answer is empty or too short to assess."],
    };
  }

  // --- Coverage: role vocabulary the answer actually uses -------------------
  const expected = getRoleExpectedKeywords(role);
  const matchedTerms = expected.filter((keyword) =>
    getKeywordAliases(keyword).some((alias) => containsNormalizedTerm(text, alias))
  );
  const missingTerms = expected.filter((keyword) => !matchedTerms.includes(keyword));
  const techTerms = [...new Set(TECH_LEXICON.filter((term) => containsNormalizedTerm(text, term)))];
  // Four domain terms in one answer already reads as technically substantive.
  const coverage = clamp((matchedTerms.length + techTerms.length) / 4);

  // --- On topic: does the answer engage with the question's own terms? ------
  const terms = questionTerms(question);
  const normalizedAnswer = ` ${normalizeToken(text)} `;
  // Prefix match so "optimise" in the question is satisfied by "optimized" in the answer.
  const hitTerms = terms.filter((term) => {
    if (containsNormalizedTerm(text, term)) return true;
    const stem = term.slice(0, Math.max(5, Math.ceil(term.length * 0.7)));
    return normalizedAnswer.includes(` ${stem}`);
  });
  const onTopic = terms.length ? clamp(hitTerms.length / Math.min(terms.length, 4)) : 0.6;

  // --- Structure: STAR for behavioural, explanation shape for technical -----
  const markers = isBehavioural ? STAR_MARKERS : TECHNICAL_MARKERS;
  const presentMarkers = Object.entries(markers).filter(([, pattern]) => pattern.test(text));
  const structure = presentMarkers.length / Object.keys(markers).length;

  // --- Evidence and reasoning ---------------------------------------------
  const evidence = EVIDENCE.test(text) ? 1 : 0;
  const reasoningHits = (text.match(new RegExp(REASONING.source, "gi")) || []).length;
  const reasoning = clamp(reasoningHits / 3);

  // --- Specificity: concrete language minus filler and hedging -------------
  const fillerCount = countMatches(text, FILLERS);
  const hedgeCount = countMatches(text, HEDGES);
  const uniqueRatio = new Set(wordList).size / wordCount;
  // A twelve-word sentence trivially has a high unique-word ratio, so damp the
  // signal until the answer is long enough for it to mean anything.
  const lexicalConfidence = Math.min(1, wordCount / 45);
  const specificity = clamp(
    (0.45 + uniqueRatio * 0.55 - (fillerCount / wordCount) * 12 - (hedgeCount / wordCount) * 8) *
      lexicalConfidence
  );

  const lengthFit = lengthFitScore(wordCount);
  const readability = readabilityScore(text);

  const weights = isBehavioural
    ? { onTopic: 0.18, structure: 0.26, evidence: 0.16, reasoning: 0.12, specificity: 0.12, lengthFit: 0.1, coverage: 0.06 }
    : { onTopic: 0.2, structure: 0.18, evidence: 0.12, reasoning: 0.16, specificity: 0.12, lengthFit: 0.1, coverage: 0.12 };

  const signals = { onTopic, structure, evidence, reasoning, specificity, lengthFit, coverage };
  const weighted = Object.entries(weights).reduce((sum, [key, weight]) => sum + signals[key] * weight, 0);

  /**
   * Substance gate.
   *
   * Surface signals (readability, length fit, vocabulary) can all look healthy
   * in an answer that says nothing. Fluency is not knowledge, so an answer with
   * none of the four substance signals cannot pass as a good answer no matter
   * how well it reads.
   */
  const substanceSignals = [
    evidence === 1,
    presentMarkers.length >= 2,
    reasoningHits >= 2,
    wordCount >= 60,
  ].filter(Boolean).length;

  const substanceCap = substanceSignals === 0 ? 0.22 : substanceSignals === 1 ? 0.5 : 1;

  // Readability acts as a light multiplier rather than its own slice.
  const adjusted = Math.min(clamp(weighted * (0.9 + readability * 0.1)), substanceCap);
  // Calibration: the raw weighted sum tops out around 0.75 for genuinely strong
  // answers, so a mild concave curve maps the usable range onto 0-10.
  const score = round1(Math.pow(adjusted, 0.78) * 10);

  const notes = [];
  if (!evidence) notes.push("No concrete numbers, metrics or complexity given.");
  if (isBehavioural && !STAR_MARKERS.result.test(text)) notes.push("No outcome stated - the STAR 'result' is missing.");
  if (!isBehavioural && !TECHNICAL_MARKERS.example.test(text)) notes.push("No worked example or concrete instance.");
  if (!isBehavioural && !TECHNICAL_MARKERS.tradeoff.test(text)) notes.push("No tradeoff or limitation discussed.");
  if (reasoningHits === 0) notes.push("No causal reasoning ('because', 'so that', 'therefore').");
  if (fillerCount > 3) notes.push(`${fillerCount} filler phrases detected.`);
  if (hedgeCount > 2) notes.push(`${hedgeCount} hedging phrases weaken the answer.`);
  if (wordCount < 40) notes.push("Too short to demonstrate depth.");
  if (onTopic < 0.34) notes.push("The answer barely engages with what was asked.");
  if (substanceSignals === 0) notes.push("Reads fluently but contains no evidence, structure or reasoning.");

  return {
    score,
    breakdown: {
      onTopic: round1(onTopic * 10),
      structure: round1(structure * 10),
      evidence: round1(evidence * 10),
      reasoning: round1(reasoning * 10),
      specificity: round1(specificity * 10),
      lengthFit: round1(lengthFit * 10),
      coverage: round1(coverage * 10),
      readability: round1(readability * 10),
    },
    signals: {
      wordCount,
      substanceSignals,
      techTerms,
      fillerCount,
      hedgeCount,
      markersPresent: presentMarkers.map(([name]) => name),
      questionTermsHit: hitTerms,
    },
    matchedTerms,
    missingTerms: missingTerms.slice(0, 8),
    notes,
  };
}
