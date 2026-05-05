import groq from "./groqService.js";

function extractJsonString(raw = "") {
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

function safeParseJSON(raw, fallback = {}) {
  try {
    return JSON.parse(extractJsonString(raw));
  } catch (error) {
    console.error("AI JSON parse failed:", raw?.slice(0, 300));
    return fallback;
  }
}

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

function normalizeToken(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9+#./\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function containsNormalizedTerm(text = "", term = "") {
  const normalizedText = ` ${normalizeToken(text)} `;
  const normalizedTerm = ` ${normalizeToken(term)} `;
  return normalizedText.includes(normalizedTerm);
}

function getKeywordAliases(keyword = "") {
  const aliasMap = {
    "data structures": ["data structures", "dsa", "ds&a", "ds a"],
    algorithms: ["algorithms", "algorithm", "dsa", "ds&a", "ds a"],
    "c++": ["c++", "cpp", "c plus plus"],
    oop: ["oop", "oops", "object oriented programming", "object-oriented programming"],
    dbms: ["dbms", "database management system", "database management systems"],
    apis: ["api", "apis", "rest api", "rest apis", "backend api"],
    "operating systems": ["operating systems", "operating system", "os"],
    networking: ["networking", "computer networks", "cn"],
    "problem solving": ["problem solving", "problem-solving", "competitive programming"],
    "system design": ["system design", "hld", "lld", "design systems"],
    javascript: ["javascript", "js"],
    typescript: ["typescript", "ts"],
    html: ["html", "html5"],
    css: ["css", "css3"],
    tailwind: ["tailwind", "tailwindcss"],
    testing: ["testing", "jest", "unit testing", "integration testing"],
    node: ["node", "nodejs", "node.js"],
    express: ["express", "expressjs", "express.js"],
    rest: ["rest", "rest api", "restful api"],
    mongodb: ["mongodb", "mongo"],
    postgresql: ["postgresql", "postgres", "psql"],
    redis: ["redis", "caching"],
    authentication: ["authentication", "auth", "jwt", "oauth"],
    deployment: ["deployment", "deployed", "hosting", "production release"],
    "machine learning": ["machine learning", "ml"],
    "deep learning": ["deep learning", "dl"],
    pytorch: ["pytorch", "torch"],
    tensorflow: ["tensorflow", "tf"],
    transformers: ["transformers", "huggingface"],
    nlp: ["nlp", "natural language processing"],
    llm: ["llm", "large language model", "large language models"],
    evaluation: ["evaluation", "model evaluation"],
    "data preprocessing": ["data preprocessing", "preprocessing", "data cleaning"],
    "model deployment": ["model deployment", "deploying models", "serving models"],
    "vector database": ["vector database", "vector db", "vectordb"],
    linux: ["linux", "ubuntu", "bash"],
    kubernetes: ["kubernetes", "k8s"],
    docker: ["docker", "containerization", "containers"],
    aws: ["aws", "amazon web services"],
    monitoring: ["monitoring", "grafana", "prometheus"],
    observability: ["observability", "logging", "tracing", "metrics"],
    "incident response": ["incident response", "incident management", "on-call"],
    terraform: ["terraform", "iac", "infrastructure as code"],
    slo: ["slo", "service level objective"],
    sli: ["sli", "service level indicator"],
    "ci/cd": ["ci/cd", "cicd", "continuous integration", "continuous deployment"],
    "internal tooling": ["internal tooling", "developer tooling", "tooling"],
    automation: ["automation", "scripting", "auto-remediation"],
    "developer experience": ["developer experience", "devex"],
    infrastructure: ["infrastructure", "infra", "cloud infrastructure"],
    owasp: ["owasp", "application security"],
    iam: ["iam", "identity and access management"],
    "threat modeling": ["threat modeling", "threat model"],
    appsec: ["appsec", "application security"],
    "cloud security": ["cloud security", "secure cloud"],
    siem: ["siem", "security monitoring"],
    authorization: ["authorization", "access control", "rbac"],
    "network security": ["network security", "firewall", "secure networking"],
    "cloud computing": ["cloud computing", "cloud"],
    "distributed systems": ["distributed systems", "distributed system"],
    "agile methodologies": ["agile methodologies", "agile", "scrum", "kanban"],
  };

  return aliasMap[keyword] || [keyword];
}

function getRoleExpectedKeywords(role = "") {
  const normalizedRole = normalizeToken(role);

  const roleProfiles = [
    {
      matchers: ["software development engineer", "sde", "software engineer", "swe"],
      keywords: [
        "data structures",
        "algorithms",
        "java",
        "c++",
        "python",
        "oop",
        "dbms",
        "sql",
        "operating systems",
        "networking",
        "apis",
        "system design",
        "problem solving",
      ],
    },
    {
      matchers: ["frontend", "front end", "ui engineer"],
      keywords: [
        "react",
        "javascript",
        "typescript",
        "html",
        "css",
        "tailwind",
        "redux",
        "responsive",
        "accessibility",
        "performance",
        "apis",
        "testing",
      ],
    },
    {
      matchers: ["backend"],
      keywords: [
        "node",
        "express",
        "java",
        "spring",
        "python",
        "django",
        "flask",
        "rest",
        "apis",
        "microservices",
        "sql",
        "mongodb",
        "postgresql",
        "redis",
        "authentication",
      ],
    },
    {
      matchers: ["full stack", "fullstack"],
      keywords: [
        "react",
        "javascript",
        "typescript",
        "node",
        "express",
        "sql",
        "mongodb",
        "apis",
        "authentication",
        "deployment",
        "state management",
        "testing",
      ],
    },
    {
      matchers: ["ai / ml", "ai", "ml", "machine learning"],
      keywords: [
        "python",
        "machine learning",
        "deep learning",
        "pytorch",
        "tensorflow",
        "transformers",
        "nlp",
        "llm",
        "evaluation",
        "data preprocessing",
        "model deployment",
        "vector database",
      ],
    },
    {
      matchers: ["site reliability", "sre"],
      keywords: [
        "linux",
        "kubernetes",
        "docker",
        "aws",
        "monitoring",
        "observability",
        "incident response",
        "terraform",
        "slo",
        "sli",
        "ci/cd",
        "networking",
      ],
    },
    {
      matchers: ["platform"],
      keywords: [
        "ci/cd",
        "docker",
        "kubernetes",
        "aws",
        "terraform",
        "internal tooling",
        "automation",
        "developer experience",
        "observability",
        "infrastructure",
      ],
    },
    {
      matchers: ["security"],
      keywords: [
        "owasp",
        "iam",
        "threat modeling",
        "appsec",
        "cloud security",
        "siem",
        "incident response",
        "authentication",
        "authorization",
        "network security",
      ],
    },
  ];

  for (const profile of roleProfiles) {
    if (profile.matchers.some((matcher) => normalizedRole.includes(matcher))) {
      return profile.keywords;
    }
  }

  return [
    "problem solving",
    "api",
    "sql",
    "testing",
    "debugging",
    "deployment",
    "git",
  ];
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

Candidate Skills: ${skills.join(", ") || "Not provided"}
Candidate Projects: ${projects.join(" | ") || "Not provided"}
Candidate Internships: ${internships.join(" | ") || "Not provided"}
Candidate Education: ${education.join(" | ") || "Not provided"}
Resume Snippet: ${resumeSnippet || "Not provided"}
Job Description: ${jdSnippet || "Not provided"}

Rules:
- Tailor the questions to the target role and the candidate context.
- Do not ask bland generic interview questions that could fit any candidate.
- Follow the selected Question Style strictly.
- At least 60% of the questions must explicitly connect to the candidate's resume, projects, skills, internships, or likely day-to-day work for the role.
- If Question Style is "project_deep", at least 80% of the questions should be based on project, implementation, debugging, architecture, scaling, deployment, ownership, or tradeoff discussions.
- If project or internship context exists, prefer asking about architecture, implementation choices, tradeoffs, debugging, scale, testing, deployment, ownership, metrics, bottlenecks, and lessons learned.
- For technical fundamentals, frame questions in the context of the target role instead of textbook wording.
- Avoid repeated templates like "Tell me about yourself", "What are your strengths and weaknesses", or broad filler unless the round is HR and the candidate context is missing.
- Keep questions specific, practical, and interview-quality.
- Make each question meaningfully different from the others.
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

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content: "You are an expert interviewer. Respond with valid JSON only.",
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
    max_tokens: 1800,
  });

  const result = safeParseJSON(completion.choices[0]?.message?.content, {
    questions: [],
  });

  return normalizeQuestions(result.questions);
};

export const evaluateAIAnswer = async ({ question, answer, roundType = "technical_1_dsa" }) => {
  const isBehavioral = roundType.includes("hr") || roundType.includes("managerial");

  const prompt = `
You are a strict but fair interviewer.

Question: ${question}
Candidate Answer: ${answer.trim().slice(0, 1600)}
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
`.trim();

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content: "You are an expert interviewer. Respond with valid JSON only.",
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
    max_tokens: 1100,
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

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content: "You are an expert resume evaluator. Respond with valid JSON only.",
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
    max_tokens: 1200,
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

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content:
          "You are a professional interview coach. Give resume-aware, role-aware, and interview-specific replies.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.5,
    max_tokens: 500,
  });

  return (
    completion.choices[0]?.message?.content?.trim() ||
    "I could not generate a response right now. Please try again."
  );
};
