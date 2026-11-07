/**
 * Companies interview at different bars, so the same role should not produce the
 * same round everywhere. Each tier fixes the difficulty band, the DSA style and
 * whether system design belongs in the round at all.
 */
export const COMPANY_TIERS = [
  {
    id: "tier1",
    level: 1,
    label: "Service & early-stage",
    blurb: "Fundamentals first. Easy to medium DSA, no system design.",
    difficultyRange: ["easy", "medium"],
    codingDifficulty: "easy",
    systemDesign: false,
    companies: [
      "TCS", "Infosys", "Wipro", "Cognizant", "Accenture", "Capgemini",
      "HCL", "Tech Mahindra", "LTIMindtree", "Early-stage startup",
    ],
    dsaGuidance:
      "Keep DSA to single-concept problems: arrays, strings, hash maps, simple sorting, basic recursion. One idea per question, no layered optimisation, no tricky edge-case traps.",
    roundGuidance:
      "Weight the round towards fundamentals and clear communication: OOP, DBMS, SQL, OS basics, and a straightforward explanation of the candidate's own project. Ask for definitions and small worked examples before any depth. Do not ask system design.",
  },
  {
    id: "tier2",
    level: 2,
    label: "Product & mid-tier",
    blurb: "Applied medium DSA plus practical design tradeoffs.",
    difficultyRange: ["medium", "medium"],
    codingDifficulty: "medium",
    systemDesign: false,
    companies: [
      "General", "Zoho", "Freshworks", "Razorpay", "Swiggy", "Zomato",
      "Paytm", "PhonePe", "Adobe", "Salesforce", "Oracle", "SAP",
      "Cisco", "Intuit", "Walmart Global Tech",
    ],
    dsaGuidance:
      "Ask medium DSA that combines two ideas: two pointers with sorting, hash map with a sliding window, BFS on a grid, or a stack-based parse. Expect a working solution plus its time and space complexity, and one follow-up on how it behaves at scale.",
    roundGuidance:
      "Balance applied coding with practical engineering judgement: API shape, database choice, indexing, caching and error handling in a real feature. Ask small design questions grounded in a feature, not a whiteboard architecture of a whole product.",
  },
  {
    id: "tier3",
    level: 3,
    label: "Top product & big tech",
    blurb: "Hard to very hard DSA, system design and ambiguous scenarios.",
    difficultyRange: ["hard", "hard"],
    codingDifficulty: "hard",
    systemDesign: true,
    companies: [
      "Google", "Microsoft", "Amazon", "Meta", "Apple", "Netflix",
      "Uber", "Airbnb", "Stripe", "OpenAI", "Nvidia", "LinkedIn",
      "Atlassian", "Databricks", "Goldman Sachs",
    ],
    dsaGuidance:
      "Ask hard DSA: graphs, dynamic programming, heaps, tries, intervals, binary search on the answer, or design of a data structure with strict complexity guarantees. Every question must carry a follow-up that raises the constraint - larger input, streaming data, memory limit, or concurrent access - so a brute force cannot survive.",
    roundGuidance:
      "Interview at a big-tech bar. Include at least one system design question (scaling, storage choice, consistency, failure modes, back-of-the-envelope estimates) and at least one ambiguous situational scenario where requirements are deliberately incomplete and the candidate must ask clarifying questions, state assumptions and defend tradeoffs. Push every answer one level deeper than the candidate offers.",
  },
];

const TIER_BY_ID = new Map(COMPANY_TIERS.map((tier) => [tier.id, tier]));

const normalize = (value = "") => String(value).trim().toLowerCase();

const COMPANY_INDEX = new Map();
COMPANY_TIERS.forEach((tier) => {
  tier.companies.forEach((company) => COMPANY_INDEX.set(normalize(company), tier));
});

export const DEFAULT_TIER_ID = "tier2";

/** Match a company name to its tier, falling back to the balanced middle tier. */
export const getCompanyTier = (company = "") => {
  const key = normalize(company);

  if (COMPANY_INDEX.has(key)) return COMPANY_INDEX.get(key);

  // Tolerate "Google India", "Amazon (AWS)" and similar.
  for (const [name, tier] of COMPANY_INDEX) {
    if (name !== "general" && (key.includes(name) || name.includes(key))) {
      if (key.length > 2) return tier;
    }
  }

  return TIER_BY_ID.get(DEFAULT_TIER_ID);
};

const ORDER = ["easy", "medium", "hard"];

/**
 * The company decides the bar, so a requested difficulty is clamped into the
 * tier's band rather than obeyed blindly.
 */
export const resolveDifficulty = (company, requested = "medium") => {
  const tier = getCompanyTier(company);
  const [minLevel, maxLevel] = tier.difficultyRange;

  const requestedIndex = ORDER.indexOf(normalize(requested));
  const minIndex = ORDER.indexOf(minLevel);
  const maxIndex = ORDER.indexOf(maxLevel);

  const index = Math.min(Math.max(requestedIndex === -1 ? 1 : requestedIndex, minIndex), maxIndex);

  return { difficulty: ORDER[index], tier };
};

export const getTierGuidance = (company) => {
  const tier = getCompanyTier(company);

  return [
    `Company tier: level ${tier.level} - ${tier.label}.`,
    tier.roundGuidance,
    `DSA expectations: ${tier.dsaGuidance}`,
    tier.systemDesign
      ? "System design and situational scenarios are in scope for this tier."
      : "Do not ask full system design questions at this tier.",
  ].join("\n");
};

const TIER_QUESTION_RULES = {
  1: `- This is a level 1 bar. Keep questions easy to medium and single-concept.
- Prefer fundamentals, definitions with a small example, and a clear explanation of the candidate's own project.
- Do not ask system design, and do not ask multi-step optimisation puzzles.`,
  2: `- This is a level 2 bar. Keep every question at medium difficulty: applied, practical, and solvable in a few minutes of clear thinking.
- Combine at most two concepts per question and ask for time and space complexity where code is involved.
- Small, feature-level design questions are fine. Do not ask to design a whole product.`,
  3: `- This is a level 3 bar. Do not open with definitions. Every question must be hard enough that a prepared candidate still has to think.
- Include at least one system design question: scale, storage choice, consistency, caching, failure modes, and a back-of-the-envelope estimate.
- Include at least one deliberately ambiguous situational scenario with incomplete requirements, where the candidate must ask clarifying questions, state assumptions and defend tradeoffs.
- Every DSA question must name a constraint that rules out the brute force (input size, memory limit, streaming input, or concurrency).
- Ask for the complexity of the proposed solution as part of the question.`,
};

/** Composition rules for the question set at this company's bar. */
export const getTierQuestionRules = (company) =>
  TIER_QUESTION_RULES[getCompanyTier(company).level] || TIER_QUESTION_RULES[2];
