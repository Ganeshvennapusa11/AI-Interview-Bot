import { createChatCompletion } from "./groqService.js";
import { safeParseJSON } from "./jsonUtils.js";
import {
  containsNormalizedTerm,
  getKeywordAliases,
  getRoleExpectedKeywords,
  normalizeToken,
} from "./textAnalysis.js";
import { getPersona, getStrictnessGuidance } from "./personas.js";
import { getTierGuidance, getTierQuestionRules } from "./companyTiers.js";

function getRoundStrategy(roundType) {
  const map = {
    technical_1_dsa:
      "Focus on coding and DSA problems: arrays, strings, trees, graphs, recursion, sorting, two-pointers, and problem-solving.",
    technical_2_fundamentals:
      "Focus on computer science fundamentals: OOP, DBMS, SQL, indexing, OS, networking, APIs, and backend/frontend concepts relevant to the role.",
    technical_2_projects:
      "Ask resume-based project and implementation questions about architecture, tradeoffs, debugging, scaling, deployment, and ownership.",
    hr: "Ask HR and communication questions: motivation, strengths, weaknesses, conflict handling, goals, and collaboration.",
    managerial:
      "Ask managerial and leadership questions: prioritization, ownership, stakeholder handling, mentoring, and cross-team coordination.",
    full_mock:
      "Create a balanced mock interview across DSA, fundamentals, project depth, HR, and communication.",
  };

  return map[roundType] || "Run a balanced interview round.";
}

function getQuestionStyleGuidance(questionStyle) {
  const map = {
    standard:
      "Ask balanced interview questions with a mix of role-specific fundamentals, practical scenarios, and some resume awareness.",
    resume_heavy:
      "Make the questions strongly resume-aware. Prefer questions explicitly tied to the candidate's listed skills, projects, internships, and implementation experience.",
    project_deep:
      "Focus heavily on project depth. Ask about architecture, tradeoffs, technical choices, debugging, bottlenecks, scaling, testing, deployment, failure handling, ownership, and measurable outcomes.",
    fundamentals_deep:
      "Focus on role-relevant technical fundamentals, but keep them practical and contextual rather than textbook-style.",
    behavioral_sharp:
      "Ask sharper behavioral and ownership questions with specific scenarios, decision-making, conflict resolution, prioritization, and impact.",
  };

  return map[questionStyle] || map.standard;
}

function getCompanyInterviewGuidance(companyType = "General") {
  const normalizedCompany = normalizeToken(companyType);
  const map = [
    {
      matchers: ["google"],
      guidance:
        "Use a Google-style bar: structured problem solving, scalable systems thinking, clarity under ambiguity, tradeoffs, clean fundamentals, and data-driven decisions.",
    },
    {
      matchers: ["amazon"],
      guidance:
        "Use an Amazon-style bar: ownership, customer obsession, dive deep, bias for action, measurable impact, operational excellence, and STAR-format behavioral probing.",
    },
    {
      matchers: ["tcs"],
      guidance:
        "Use a TCS-style bar: fundamentals, communication, project explanation, role readiness, service delivery mindset, adaptability, and practical coding/database concepts.",
    },
    {
      matchers: ["infosys"],
      guidance:
        "Use an Infosys-style bar: fundamentals, training readiness, problem solving, communication, project clarity, OOP/DBMS/SDLC basics, and learnability.",
    },
  ];

  const matched = map.find((item) =>
    item.matchers.some((matcher) => normalizedCompany.includes(matcher))
  );

  return (
    matched?.guidance ||
    "Use a general product/company interview style with realistic follow-ups, practical constraints, and role-specific evaluation."
  );
}

function normalizeQuestions(items = []) {
  return items
    .map((item) => {
      if (typeof item === "string") {
        return {
          question: item.trim(),
          category: "General",
          difficulty: "Medium",
          hint: "",
        };
      }

      return {
        question: String(item?.question || "").trim(),
        category: String(item?.category || "General").trim(),
        difficulty: String(item?.difficulty || "Medium").trim(),
        hint: String(item?.hint || "").trim(),
      };
    })
    .filter((item) => item.question);
}





function computeResumeHeuristic(role, parsedResume = {}, resumeText = "") {
  const expectedKeywords = getRoleExpectedKeywords(role);
  const normalizedResume = normalizeToken(resumeText);
  const resumePool = normalizeToken(
    [
      resumeText,
      ...(parsedResume.skills || []),
      ...(parsedResume.projects || []),
      ...(parsedResume.internships || []),
      ...(parsedResume.education || []),
    ].join(" ")
  );

  const matchedKeywords = expectedKeywords.filter((keyword) => {
    const aliases = getKeywordAliases(keyword);
    return aliases.some(
      (alias) =>
        containsNormalizedTerm(normalizedResume, alias) ||
        containsNormalizedTerm(resumePool, alias)
    );
  });

  const missingKeywords = expectedKeywords.filter(
    (keyword) => !matchedKeywords.includes(keyword)
  );

  const skillCount = Array.isArray(parsedResume.skills)
    ? parsedResume.skills.length
    : 0;
  const projectCount = Array.isArray(parsedResume.projects)
    ? parsedResume.projects.length
    : 0;
  const internshipCount = Array.isArray(parsedResume.internships)
    ? parsedResume.internships.length
    : 0;
  const educationCount = Array.isArray(parsedResume.education)
    ? parsedResume.education.length
    : 0;

  const keywordCoverage =
    expectedKeywords.length > 0
      ? matchedKeywords.length / expectedKeywords.length
      : 0;

  let heuristicScore = 32;
  heuristicScore += keywordCoverage * 38;
  heuristicScore += Math.min(skillCount, 10) * 1.8;
  heuristicScore += Math.min(projectCount, 4) * 5;
  heuristicScore += Math.min(internshipCount, 3) * 4;
  heuristicScore += Math.min(educationCount, 2) * 3;

  if (resumeText.trim().length > 1200) heuristicScore += 4;
  if (resumeText.trim().length > 2200) heuristicScore += 3;

  heuristicScore = Math.max(18, Math.min(94, Math.round(heuristicScore)));

  return {
    heuristicScore,
    matchedKeywords,
    missingKeywords,
    expectedKeywords,
    scoreBreakdown: {
      keywordCoverage: Math.round(keywordCoverage * 100),
      skillDepth: Math.min(skillCount, 10),
      projectDepth: projectCount,
      internshipDepth: internshipCount,
      educationSignals: educationCount,
    },
  };
}

function mergeResumeInsights(aiInsights = {}, role, resumeText = "") {
  const parsedResume = aiInsights.parsedResume || {};
  const heuristic = computeResumeHeuristic(role, parsedResume, resumeText);
  const aiScore = Number(aiInsights.matchScore || 0);

  let matchScore = Math.round(aiScore * 0.4 + heuristic.heuristicScore * 0.6);

  if (heuristic.matchedKeywords.length >= 4 && matchScore < 55) {
    matchScore = 55;
  }

  if (
    heuristic.matchedKeywords.length >= 6 &&
    heuristic.scoreBreakdown.projectDepth >= 1 &&
    matchScore < 65
  ) {
    matchScore = 65;
  }

  matchScore = Math.max(18, Math.min(96, matchScore));

  const mergedMissingKeywords = [
    ...(aiInsights.missingKeywords || []),
    ...heuristic.missingKeywords,
  ]
    .map((item) => String(item).trim())
    .filter(Boolean)
    .filter((item, index, array) => array.indexOf(item) === index)
    .slice(0, 8);

  const strengths = [
    ...(aiInsights.strengths || []),
    ...heuristic.matchedKeywords.slice(0, 5).map(
      (keyword) => `Shows evidence of ${keyword}`
    ),
  ]
    .filter(Boolean)
    .filter((item, index, array) => array.indexOf(item) === index)
    .slice(0, 6);

  return {
    ...aiInsights,
    matchScore,
    parsedResume,
    missingKeywords: mergedMissingKeywords,
    matchedKeywords: heuristic.matchedKeywords.slice(0, 8),
    strengths,
    scoreBreakdown: {
      ...(aiInsights.scoreBreakdown || {}),
      heuristic: heuristic.scoreBreakdown,
    },
  };
}

export const generateAIQuestions = async ({
  persona: personaId,
  role,
  roundType,
  experienceLevel = "Fresher",
  companyType = "General",
  jobDescription = "",
  resumeText = "",
  parsedResume = {},
  questionCount = 5,
  difficulty = "medium",
  questionStyle = "standard",
  adaptiveContext = {},
}) => {
  const resumeSnippet = resumeText.trim().slice(0, 1200);
  const jdSnippet = jobDescription.trim().slice(0, 800);

  const skills = Array.isArray(parsedResume.skills) ? parsedResume.skills.slice(0, 12) : [];
  const projects = Array.isArray(parsedResume.projects) ? parsedResume.projects.slice(0, 4) : [];
  const internships = Array.isArray(parsedResume.internships)
    ? parsedResume.internships.slice(0, 3)
    : [];
  const education = Array.isArray(parsedResume.education)
    ? parsedResume.education.slice(0, 3)
    : [];
  const previousWeakAreas = Array.isArray(adaptiveContext.weakAreas)
    ? adaptiveContext.weakAreas.slice(0, 6).join(", ")
    : "";
  const previousStrengths = Array.isArray(adaptiveContext.strengths)
    ? adaptiveContext.strengths.slice(0, 6).join(", ")
    : "";
  const askedQuestions = Array.isArray(adaptiveContext.askedQuestions)
    ? adaptiveContext.askedQuestions.slice(-8).join(" | ")
    : "";
  const lastScore =
    adaptiveContext.lastScore !== undefined
      ? String(adaptiveContext.lastScore)
      : "Not available";

  const prompt = `
You are an expert interviewer.

Generate exactly ${questionCount} interview questions in valid JSON only.

Role: ${role}
Round: ${roundType}
Difficulty: ${difficulty}
Question Style: ${questionStyle}
Experience Level: ${experienceLevel}
Company Type: ${companyType}
Round Strategy: ${getRoundStrategy(roundType)}
Style Guidance: ${getQuestionStyleGuidance(questionStyle)}
Company Guidance: ${getCompanyInterviewGuidance(companyType)}

${getTierGuidance(companyType)}

You are ${getPersona(personaId).label} (${getPersona(personaId).company}).
Interviewer style: ${getPersona(personaId).questionGuidance}
Stay in character. Never mention that you are following a persona.

Candidate Skills: ${skills.join(", ") || "Not provided"}
Candidate Projects: ${projects.join(" | ") || "Not provided"}
Candidate Internships: ${internships.join(" | ") || "Not provided"}
Candidate Education: ${education.join(" | ") || "Not provided"}
Resume Snippet: ${resumeSnippet || "Not provided"}
Job Description: ${jdSnippet || "Not provided"}

Adaptive Context:
- Previous Questions Asked: ${askedQuestions || "None"}
- Last Answer Score: ${lastScore}
- Previous Strengths: ${previousStrengths || "None"}
- Weak Areas To Probe Next: ${previousWeakAreas || "None"}

Tier rules (these override the generic ordering rules below when they conflict):
${getTierQuestionRules(companyType)}

Rules:
- Tailor the questions to the target role and the candidate context.
- Do not ask bland generic interview questions that could fit any candidate.
- Follow the selected Question Style strictly.
- Order the questions from easier to harder. The first 30-40% should be basic, short, confidence-building questions. The middle should be medium practical questions. The last questions may be longer scenario, architecture, coding, debugging, or design questions.
- For basic questions, ask concise fundamentals such as "What is authentication?", "What is indexing in a database?", "What is the purpose of middleware in Express?", or "What is the difference between a list and a dictionary?" depending on the role.
- For medium questions, ask applied prompts that require explanation or code, similar to: "How would you design scalable handling for multiple concurrent conversations with an AI API?" or "Write a Python function to sort transactions by timestamp and group them by payment status."
- Do not make every question long. Mix question length: short basics first, then 1-2 medium multi-part questions, and only one deep scenario when the question count allows it.
- If generating 5 questions, use this sequence: Question 1 basic, Question 2 basic-to-applied, Question 3 medium practical, Question 4 medium scenario/code/design, Question 5 medium-plus follow-up or project-depth question.
- At least 60% of the questions must explicitly connect to the candidate's resume, projects, skills, internships, or likely day-to-day work for the role.
- If Question Style is "project_deep", at least 80% of the questions should be based on project, implementation, debugging, architecture, scaling, deployment, ownership, or tradeoff discussions.
- If project or internship context exists, prefer asking about architecture, implementation choices, tradeoffs, debugging, scale, testing, deployment, ownership, metrics, bottlenecks, and lessons learned.
- For technical fundamentals, frame questions in the context of the target role instead of textbook wording.
- Avoid repeated templates like "Tell me about yourself", "What are your strengths and weaknesses", or broad filler unless the round is HR and the candidate context is missing.
- Keep questions specific, practical, and interview-quality.
- Make each question meaningfully different from the others.
- If Weak Areas To Probe Next exists, make the next questions adapt to those gaps without repeating previous questions.
- If the last score is low, ask a more guided diagnostic question. If it is high, increase depth or ask sharper tradeoff/follow-up questions.
- Match the company guidance without mentioning this instruction.
- When useful, include one short hint that nudges the candidate toward structure, not the full answer.
- Return only JSON in this shape:
{
  "questions": [
    {
      "question": "string",
      "category": "string",
      "difficulty": "Easy|Medium|Hard",
      "hint": "string"
    }
  ]
}
`.trim();

  const completion = await createChatCompletion({
    messages: [
      {
        role: "system",
        content: "You are an expert interviewer. Respond with valid JSON only.",
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
    max_tokens: 2600,
  });

  const result = safeParseJSON(completion.choices[0]?.message?.content, {
    questions: [],
  });

  return normalizeQuestions(result.questions);
};

/**
 * Prompt variants for the answer grader.
 * The evaluation harness (npm run eval) measures these against author-labelled
 * scores, so changing the default should be an evidence-based decision.
 */
export const EVALUATION_VARIANTS = ["v1_plain", "v2_rubric_anchored", "v3_few_shot"];

export const DEFAULT_EVALUATION_VARIANT =
  process.env.EVAL_PROMPT_VARIANT && EVALUATION_VARIANTS.includes(process.env.EVAL_PROMPT_VARIANT)
    ? process.env.EVAL_PROMPT_VARIANT
    : "v1_plain";

const RUBRIC_ANCHORS = `
Score anchors (be literal about these):
- 0-2: no relevant content, or the answer misses what was asked.
- 3-4: names the right topic but stays vague; no mechanism, example or evidence.
- 5-6: correct and on topic with some explanation, but shallow: no numbers, no tradeoffs, thin edge cases.
- 7-8: correct, structured, with a concrete example or measurement and at least one tradeoff acknowledged.
- 9-10: everything in 7-8 plus depth a strong hire would show: precise reasoning, limits of the approach, and what they would do differently.
`.trim();

const FEW_SHOT_EXAMPLES = `
Example A
Question: How would you speed up a slow API endpoint?
Answer: "I would probably add caching or something, maybe look at the database."
Correct evaluation: overall 3. Names plausible directions but no diagnosis, no mechanism, no evidence.

Example B
Question: How would you speed up a slow API endpoint?
Answer: "First I would measure: add timing around the handler and check the DB plan. On our orders endpoint the N+1 query was 80% of the 900ms. I batched the lookups into one query and it dropped to 120ms. I did not cache, because the data changes per request and a stale cache would be worse than 120ms."
Correct evaluation: overall 9. Measures before fixing, quantifies impact, and justifies rejecting an obvious alternative.
`.trim();

export const buildEvaluationPrompt = ({
  question,
  answer,
  roundType = "technical_1_dsa",
  variant = DEFAULT_EVALUATION_VARIANT,
  personaId,
}) => {
  const isBehavioral = roundType.includes("hr") || roundType.includes("managerial");
  const persona = getPersona(personaId);

  const sections = [
    `You are ${persona.label}, a strict but fair interviewer.`,
    persona.evaluationGuidance,
    getStrictnessGuidance(persona),
  ];

  if (variant === "v2_rubric_anchored" || variant === "v3_few_shot") {
    sections.push(RUBRIC_ANCHORS);
  }

  if (variant === "v3_few_shot") {
    sections.push(FEW_SHOT_EXAMPLES);
  }

  sections.push(`
Question: ${question}
Candidate Answer: ${String(answer).trim().slice(0, 1600)}
Round Type: ${roundType}

Return valid JSON only:
{
  "feedback": "2-4 sentence evaluation",
  "score": {
    "overall": 0,
    "clarity": 0,
    "depth": 0,
    "${isBehavioral ? "relevance" : "correctness"}": 0
  },
  "strengths": ["string"],
  "improvements": ["string"],
  "idealAnswerPoints": ["string"],
  "followUpQuestion": "string"
}

All scores are integers from 0 to 10.`);

  return sections.join("\n\n").trim();
};

export const evaluateAIAnswer = async ({
  question,
  answer,
  roundType = "technical_1_dsa",
  variant = DEFAULT_EVALUATION_VARIANT,
  personaId,
}) => {
  const completion = await createChatCompletion({
    messages: [
      {
        role: "system",
        content: "You are an expert interviewer. Respond with valid JSON only.",
      },
      { role: "user", content: buildEvaluationPrompt({ question, answer, roundType, variant, personaId }) },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
    max_tokens: 1500,
  });

  return safeParseJSON(completion.choices[0]?.message?.content, {
    feedback: "Could not evaluate the answer. Please try again.",
    score: {
      overall: 0,
      clarity: 0,
      depth: 0,
      correctness: 0,
    },
    strengths: [],
    improvements: ["Please try submitting your answer again."],
    idealAnswerPoints: [],
    followUpQuestion: "",
  });
};

export const extractResumeInsights = async (resumeText, role) => {
  const prompt = `
You are an expert recruiter.

Analyze this resume for the role: ${role}

Resume:
${resumeText.trim().slice(0, 3000)}

Return valid JSON only:
{
  "matchScore": 0,
  "missingKeywords": ["string"],
  "matchedKeywords": ["string"],
  "opinion": "string",
  "strengths": ["string"],
  "suggestions": ["string"],
  "scoreBreakdown": {
    "roleAlignment": 0,
    "technicalDepth": 0,
    "projectStrength": 0,
    "experienceSignal": 0
  },
  "parsedResume": {
    "skills": ["string"],
    "projects": ["string"],
    "internships": ["string"],
    "education": ["string"]
  }
}

Scoring rules:
- Use a realistic campus-to-early-career screening lens, not an industry-senior bar.
- Do not give extremely low scores unless the resume is genuinely unrelated to the role.
- A decent fresher or student with relevant skills, projects, or internships should usually land in the 55-75 range.
- Strong alignment with multiple relevant projects, clear technical skills, and good role fit should usually land in the 70-88 range.
- Reserve scores below 40 for resumes with very weak alignment or very limited relevant evidence.
`.trim();

  const completion = await createChatCompletion({
    messages: [
      {
        role: "system",
        content: "You are an expert resume evaluator. Respond with valid JSON only.",
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
    max_tokens: 2600,
  });

  const aiInsights = safeParseJSON(completion.choices[0]?.message?.content, {
    matchScore: 0,
    missingKeywords: [],
    matchedKeywords: [],
    opinion: "Could not analyze resume.",
    strengths: [],
    suggestions: [],
    scoreBreakdown: {
      roleAlignment: 0,
      technicalDepth: 0,
      projectStrength: 0,
      experienceSignal: 0,
    },
    parsedResume: {
      skills: [],
      projects: [],
      internships: [],
      education: [],
    },
  });

  return mergeResumeInsights(aiInsights, role, resumeText);
};

export const generateInterviewChatReply = async ({ message, context = {} }) => {
  const prompt = `
You are an interview preparation assistant.

Current Context:
- Role: ${context.role || "Unknown"}
- Round Type: ${context.roundType || "General"}
- Difficulty: ${context.difficulty || "medium"}
- Question Style: ${context.questionStyle || "standard"}
- Experience Level: ${context.experienceLevel || "Fresher"}
- Company Type: ${context.companyType || "General"}
- Resume Skills: ${(context.parsedResume?.skills || []).join(", ") || "Not provided"}
- Resume Projects: ${(context.parsedResume?.projects || []).join(" | ") || "Not provided"}
- Job Description: ${(context.jobDescription || "").slice(0, 500) || "Not provided"}

User Message:
${message}

Rules:
- Stay interview-focused.
- Prefer role-specific and resume-aware guidance.
- Use the selected round, difficulty, and question style when giving advice.
- If question style is project_deep, prefer architecture, debugging, tradeoffs, scaling, testing, deployment, and ownership guidance.
- If role is missing, ask for it briefly and continue being helpful.
- Be concise, practical, and supportive.
`.trim();

  const completion = await createChatCompletion({
    messages: [
      {
        role: "system",
        content:
          "You are a professional interview coach. Give resume-aware, role-aware, and interview-specific replies.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.5,
    max_tokens: 700,
  });

  return (
    completion.choices[0]?.message?.content?.trim() ||
    "I could not generate a response right now. Please try again."
  );
};
