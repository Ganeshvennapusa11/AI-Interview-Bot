/**
 * Text helpers shared by the AI grader and the non-AI baseline grader.
 */

export function normalizeToken(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9+#./\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function containsNormalizedTerm(text = "", term = "") {
  const normalizedText = ` ${normalizeToken(text)} `;
  const normalizedTerm = ` ${normalizeToken(term)} `;
  return normalizedText.includes(normalizedTerm);
}

export function getKeywordAliases(keyword = "") {
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

export function getRoleExpectedKeywords(role = "") {
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
