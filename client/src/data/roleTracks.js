const roleTracks = [
  {
    id: "SDE",
    title: "Software Development Engineer",
    category: "Core SWE",
    desc: "Strong prep for coding rounds, core CS fundamentals, and implementation-heavy technical interviews.",
    exp: "0-3 Years",
    qna: "24 Q&A",
    date: "25 Apr 2026",
    skills: "DSA, OOP, DBMS, OS, Networking, Java, C++, Python",
    accent: "from-cyan-100 via-sky-50 to-white",
    icon: "Code2",
    roadmap: {
      tagline:
        "A deep roadmap for candidates targeting coding-heavy product-company roles with strong algorithmic and core CS expectations.",
      fit:
        "Best for freshers and early-career engineers preparing for companies that care about problem solving, clean implementation, and the ability to reason through tradeoffs under pressure.",
      northStar:
        "Become the candidate who can solve medium-level coding questions consistently, explain the why behind every data-structure choice, and connect classroom fundamentals to real implementation decisions.",
      coreAreas: [
        {
          title: "Problem Solving Engine",
          items: [
            "Arrays, strings, hashing, sorting, binary search, sliding window, two pointers.",
            "Stacks, queues, linked lists, recursion, backtracking, heaps, greedy patterns.",
            "Trees, BST, graphs, shortest paths, union-find, dynamic programming fundamentals.",
            "Write clean dry-run explanations, complexity analysis, and edge-case reasoning.",
          ],
        },
        {
          title: "Core CS Depth",
          items: [
            "Operating systems: processes, threads, scheduling, deadlocks, memory, virtual memory, synchronization.",
            "DBMS: normalization, joins, indexing, transactions, isolation, SQL reasoning.",
            "OOP and design: abstraction, inheritance, polymorphism, SOLID basics, class modeling.",
            "Computer networks: HTTP/HTTPS, DNS, TCP/UDP, latency, proxies, connection lifecycle.",
          ],
        },
        {
          title: "Implementation Quality",
          items: [
            "Code with readable naming, small helpers, consistent structure, and minimal bug surface.",
            "Practice explaining failed approaches before arriving at the final one.",
            "Learn to optimize from brute force to acceptable complexity with confidence.",
          ],
        },
      ],
      interviewLoops: [
        "Online assessment: timed DSA with speed, correctness, and edge-case handling.",
        "Technical round 1: coding plus complexity discussion and alternative approaches.",
        "Technical round 2: CS fundamentals, project deep-dive, and debugging thought process.",
        "Hiring manager / behavioral: ownership, learning ability, conflict handling, and teamwork clarity.",
      ],
      projectRequirements: [
        "At least 2 projects where you can explain architecture, core modules, tradeoffs, and actual implementation choices.",
        "One project should show backend logic, API integration, persistence, or system-level thinking.",
        "Be able to explain bugs you faced, how you debugged them, and what you would improve next.",
      ],
      monthPlan: [
        {
          week: "Week 1",
          focus: "Foundation reset",
          outcomes: [
            "Solve 12-15 easy-to-medium questions from arrays, strings, hashing, and recursion.",
            "Revise OS, DBMS, OOP, and networking using concise handwritten notes.",
            "Prepare project summaries with stack, problem statement, architecture, and impact.",
          ],
          drills: [
            "1 timed question daily.",
            "1 CS subject revision block daily.",
            "1 project explanation rehearsal every two days.",
          ],
        },
        {
          week: "Week 2",
          focus: "Pattern mastery",
          outcomes: [
            "Cover linked lists, trees, heaps, stacks, queues, and graph basics.",
            "Practice SQL joins, normalization, indexing, and transaction scenarios.",
            "Start mock whiteboard-style explanations out loud instead of only coding silently.",
          ],
          drills: [
            "2 medium coding problems daily.",
            "3 SQL prompts across the week.",
            "2 mock explanations for OS or DBMS topics.",
          ],
        },
        {
          week: "Week 3",
          focus: "Interview realism",
          outcomes: [
            "Attempt timed mock rounds mixing DSA and CS fundamentals.",
            "Prepare concise answers for resume bullets, internships, and leadership examples.",
            "Improve speed on graph, DP, and binary-search-on-answer style questions.",
          ],
          drills: [
            "3 full mock sessions in the week.",
            "Post-mock error log after every session.",
            "One debugging or optimization exercise daily.",
          ],
        },
        {
          week: "Week 4",
          focus: "Final polish",
          outcomes: [
            "Stabilize your strongest patterns and do not chase too many new topics.",
            "Refine project storytelling and behavioral examples using STAR.",
            "Revisit your weak concepts from the mock error log.",
          ],
          drills: [
            "Alternate between a full mock and a revision day.",
            "Review 20-25 high-yield concepts.",
            "Do one final resume walkthrough with a friend or mirror practice.",
          ],
        },
      ],
      checkpoints: [
        "Can solve medium problems without jumping to hints too quickly.",
        "Can explain time and space complexity naturally.",
        "Can connect OS/DBMS/networking answers to practical system behavior.",
        "Can defend project architecture decisions instead of listing tools only.",
      ],
      commonMistakes: [
        "Memorizing solutions without recognizing the underlying pattern.",
        "Writing code fast but failing to test edge cases.",
        "Treating OS, DBMS, and networking as theory instead of interview conversation topics.",
        "Listing projects on the resume but not being able to explain design tradeoffs.",
      ],
      resources: [
        "LeetCode pattern sheets for daily coding consistency.",
        "Short handwritten CS notes rather than long passive reading sessions.",
        "Two mock interviews per week during the last two weeks of prep.",
      ],
      finalSprint: [
        "Revise 30 favorite coding patterns.",
        "Prepare 5 strong project and behavioral stories.",
        "Practice writing compilable code with clean variable names and quick dry runs.",
      ],
    },
  },
  {
    id: "SWE",
    title: "Software Engineer",
    category: "Core SWE",
    desc: "General software engineering track for product companies, service firms, and platform teams.",
    exp: "1-4 Years",
    qna: "20 Q&A",
    date: "25 Apr 2026",
    skills: "Problem Solving, APIs, Testing, Architecture, Debugging",
    accent: "from-emerald-100 via-teal-50 to-white",
    icon: "Cpu",
    roadmap: {
      tagline:
        "A balanced roadmap for engineers who need coding ability, delivery thinking, debugging depth, and strong system judgment.",
      fit:
        "Best for candidates targeting broad software engineer roles where companies expect practical engineering maturity beyond pure coding rounds.",
      northStar:
        "Show that you can design, build, test, debug, and improve real software rather than only solve interview puzzles.",
      coreAreas: [
        {
          title: "Engineering Fundamentals",
          items: [
            "Strong command of language features, data structures, APIs, async behavior, and debugging workflows.",
            "Testing fundamentals: unit, integration, mocking boundaries, regression prevention.",
            "Error handling, logging, retries, resilience, and observability basics.",
          ],
        },
        {
          title: "Architecture and Delivery",
          items: [
            "Service boundaries, API contracts, database choices, caching, and scaling basics.",
            "Tradeoffs between developer speed, maintainability, reliability, and performance.",
            "Release flow understanding: branching, CI/CD, rollback thinking, and issue triage.",
          ],
        },
        {
          title: "Interview Communication",
          items: [
            "Explain architecture clearly using modules, data flow, bottlenecks, and risk areas.",
            "Use examples from incidents, bugs, or refactors to demonstrate ownership.",
            "Answer with enough detail to prove depth, but not so much that you lose structure.",
          ],
        },
      ],
      interviewLoops: [
        "Coding or debugging round focused on practical implementation.",
        "Project or architecture discussion with tradeoff-heavy follow-ups.",
        "Behavioral round around ownership, collaboration, prioritization, and quality.",
      ],
      projectRequirements: [
        "One project that shows full feature delivery from requirement to deployment.",
        "One story around debugging or performance improvement with measurable impact.",
        "Evidence of testing, CI/CD, version control hygiene, or production-minded thinking.",
      ],
      monthPlan: [
        {
          week: "Week 1",
          focus: "Inventory your engineering gaps",
          outcomes: [
            "List what you can build confidently and where you feel shaky.",
            "Revise language internals, API design basics, and testing strategy.",
            "Document 3 projects with architecture and risk points.",
          ],
          drills: [
            "1 coding problem daily.",
            "1 debugging exercise daily.",
            "1 project summary rewrite every two days.",
          ],
        },
        {
          week: "Week 2",
          focus: "Execution depth",
          outcomes: [
            "Practice API design, schema reasoning, caching choices, and error handling.",
            "Review testing examples from your own code or side projects.",
            "Prepare strong answers for conflict, ownership, deadlines, and ambiguity.",
          ],
          drills: [
            "2 architecture prompts per week.",
            "3 testing-focused explanations across the week.",
            "2 behavioral mock sets.",
          ],
        },
        {
          week: "Week 3",
          focus: "Pressure handling",
          outcomes: [
            "Run mixed mocks that switch between coding, debugging, and system reasoning.",
            "Practice clarifying vague requirements before jumping into solutions.",
            "Tighten your delivery stories using actual metrics where possible.",
          ],
          drills: [
            "3 mixed mocks.",
            "Daily 20-minute bug reading and root-cause explanation.",
            "1 incident-style answer rehearsal each day.",
          ],
        },
        {
          week: "Week 4",
          focus: "Polish and consistency",
          outcomes: [
            "Refine clarity, pacing, and confidence in spoken explanations.",
            "Reduce weak spots in observability, testing, and architecture tradeoffs.",
            "Enter interviews with a compact revision sheet instead of scattered notes.",
          ],
          drills: [
            "Alternate revision and mocks.",
            "Re-answer previously weak questions from memory.",
            "Practice concise 90-second project explanations.",
          ],
        },
      ],
      checkpoints: [
        "Can explain one project end to end without reading notes.",
        "Can describe what you log, test, cache, and monitor in a real service.",
        "Can discuss failures and tradeoffs honestly without sounding defensive.",
      ],
      commonMistakes: [
        "Speaking about tools without explaining why they were chosen.",
        "Ignoring testing and reliability in project discussions.",
        "Using vague words like scalable or optimized without proof.",
      ],
      resources: [
        "Architecture interview prompts.",
        "Debugging case studies from your own projects.",
        "Behavioral STAR bank with ownership and ambiguity examples.",
      ],
      finalSprint: [
        "Prepare one clean story each for bug fixing, feature delivery, and teamwork conflict.",
        "Review practical tradeoffs across APIs, databases, and testing layers.",
      ],
    },
  },
  {
    id: "SRE",
    title: "Site Reliability Engineer",
    category: "Infrastructure",
    desc: "Focused rounds for observability, production reliability, incident handling, and infrastructure operations.",
    exp: "2-5 Years",
    qna: "18 Q&A",
    date: "25 Apr 2026",
    skills: "Linux, Kubernetes, SLO/SLI, Terraform, Monitoring, Incident Response",
    accent: "from-orange-100 via-amber-50 to-white",
    icon: "ServerCog",
    roadmap: {
      tagline:
        "A production-first roadmap for candidates who need to demonstrate operational calm, systems depth, and reliability engineering instincts.",
      fit:
        "Best for infrastructure, reliability, production operations, and hybrid devops-plus-systems roles.",
      northStar:
        "Be the engineer who can prevent incidents where possible, respond well when they happen, and improve the system after the fact.",
      coreAreas: [
        {
          title: "Systems and Networking",
          items: [
            "Linux process model, memory, filesystems, permissions, logs, networking tools, and shell literacy.",
            "DNS, load balancers, TLS, TCP, HTTP, latency, retries, and connection failure modes.",
            "Container and Kubernetes basics including scheduling, services, probes, scaling, and config management.",
          ],
        },
        {
          title: "Reliability Discipline",
          items: [
            "SLIs, SLOs, error budgets, on-call hygiene, alert fatigue, and observability practices.",
            "Incident lifecycle: detection, triage, mitigation, communication, postmortem, and prevention.",
            "Capacity planning, redundancy, rollout safety, and rollback design.",
          ],
        },
        {
          title: "Automation and IaC",
          items: [
            "Terraform, pipelines, scripts, golden paths, internal tooling, and operational runbooks.",
            "Automate repeated pain, reduce manual changes, and document recovery paths clearly.",
          ],
        },
      ],
      interviewLoops: [
        "Linux and networking troubleshooting round.",
        "Production incident scenario or outage simulation.",
        "Kubernetes / cloud / IaC deep-dive.",
        "Behavioral round on ownership during incidents and cross-team coordination.",
      ],
      projectRequirements: [
        "A clear example of monitoring, alerting, automation, or reliability improvement.",
        "At least one story involving failure analysis, on-call learning, or operational hardening.",
        "Comfort discussing metrics, dashboards, alert thresholds, and remediation steps.",
      ],
      monthPlan: [
        {
          week: "Week 1",
          focus: "Linux and networking reset",
          outcomes: [
            "Revise common Linux commands, process tools, logs, networking diagnostics, and shell scripting.",
            "Review DNS, TCP, TLS, HTTP, proxies, and load balancing.",
            "Build a mini runbook for common production issues.",
          ],
          drills: [
            "Daily troubleshooting prompt.",
            "Daily command-line revision.",
            "Two networking scenario write-ups.",
          ],
        },
        {
          week: "Week 2",
          focus: "Observability and incident handling",
          outcomes: [
            "Practice SLI/SLO definitions, alert design, noise reduction, and dashboard reasoning.",
            "Walk through incident timelines with detection, mitigation, and communication phases.",
            "Revise rollout safety, canaries, feature flags, and rollback plans.",
          ],
          drills: [
            "Three incident-response drills.",
            "Two dashboard interpretation exercises.",
            "One postmortem write-up.",
          ],
        },
        {
          week: "Week 3",
          focus: "Cloud and Kubernetes depth",
          outcomes: [
            "Revisit pods, deployments, services, ingress, autoscaling, config, and secrets.",
            "Understand cloud primitives enough to reason about tradeoffs and failure boundaries.",
            "Tighten Terraform and automation examples from past work.",
          ],
          drills: [
            "Three K8s explanation mocks.",
            "Two IaC design discussions.",
            "One resilience architecture prompt daily.",
          ],
        },
        {
          week: "Week 4",
          focus: "High-pressure simulation",
          outcomes: [
            "Do timed outage simulations and explain the first 15 minutes of response clearly.",
            "Practice incident communication and prioritization under uncertainty.",
            "Prepare stories about preventive work, not just firefighting.",
          ],
          drills: [
            "Three outage mocks.",
            "Daily root-cause summary in plain language.",
            "Final revision of metrics and incident vocabulary.",
          ],
        },
      ],
      checkpoints: [
        "Can troubleshoot a latency spike methodically.",
        "Can explain meaningful alert design without alert spam.",
        "Can describe how automation reduced operational risk.",
      ],
      commonMistakes: [
        "Talking about Kubernetes resources without understanding failure symptoms.",
        "Confusing observability tooling with actual reliability outcomes.",
        "Skipping communication and prioritization when describing incidents.",
      ],
      resources: [
        "Linux troubleshooting sheets.",
        "SRE workbook-style incident prompts.",
        "Your own postmortem and alert examples.",
      ],
      finalSprint: [
        "Memorize a clear incident response structure.",
        "Prepare 3 stories on automation, reliability improvement, and outage handling.",
      ],
    },
  },
  {
    id: "AIML",
    title: "AI / ML Engineer",
    category: "Applied AI",
    desc: "Modern track for model pipelines, LLM systems, prompt workflows, evaluation, and deployment decisions.",
    exp: "1-4 Years",
    qna: "22 Q&A",
    date: "25 Apr 2026",
    skills: "Python, PyTorch, Transformers, MLOps, Vector DBs, Prompt Engineering",
    accent: "from-fuchsia-100 via-rose-50 to-white",
    icon: "BrainCircuit",
    roadmap: {
      tagline:
        "A practical roadmap for candidates who need to bridge ML theory, applied systems, evaluation, and deployment maturity.",
      fit:
        "Best for applied ML, LLM engineering, intelligent product roles, and early MLOps-oriented interview tracks.",
      northStar:
        "Show that you can turn a model idea into a working, measured, and reliable product workflow.",
      coreAreas: [
        {
          title: "ML and LLM Fundamentals",
          items: [
            "Model training basics, bias-variance tradeoff, overfitting, regularization, evaluation metrics.",
            "Transformers, embeddings, tokenization, retrieval basics, prompt design, and model limitations.",
            "Clear understanding of when to fine-tune, when to use retrieval, and when simpler rules are enough.",
          ],
        },
        {
          title: "Applied System Design",
          items: [
            "Pipelines for ingestion, preprocessing, embedding, retrieval, inference, caching, and evaluation.",
            "Latency, cost, hallucination control, prompt robustness, and feedback loops.",
            "Observability for prompts, model outputs, drift, and failure modes.",
          ],
        },
        {
          title: "MLOps and Product Thinking",
          items: [
            "Versioning datasets, prompts, models, and evaluation sets.",
            "Experiment tracking, A/B reasoning, safety, fallback logic, and user trust.",
            "Ability to explain tradeoffs between quality, speed, cost, and maintainability.",
          ],
        },
      ],
      interviewLoops: [
        "ML fundamentals or Python round.",
        "Project deep-dive with architecture and evaluation follow-ups.",
        "LLM / retrieval / prompt design scenario round.",
        "Behavioral round on iteration, ambiguity, and stakeholder communication.",
      ],
      projectRequirements: [
        "At least one project with measurable evaluation rather than only demo screenshots.",
        "Ability to explain data flow, prompt or model choices, failure cases, and improvements.",
        "A strong story on why the chosen AI approach was better than simpler alternatives.",
      ],
      monthPlan: [
        {
          week: "Week 1",
          focus: "Fundamentals and resume audit",
          outcomes: [
            "Revise ML basics, metrics, training terminology, and Python implementation comfort.",
            "Document every AI/ML project with task, data, architecture, evaluation, and business impact.",
            "Prepare one explanation for each major model or framework used.",
          ],
          drills: [
            "Daily concept recap.",
            "Three code walkthroughs from your own projects.",
            "Two metric-selection exercises.",
          ],
        },
        {
          week: "Week 2",
          focus: "LLM and retrieval depth",
          outcomes: [
            "Practice prompt design tradeoffs, embedding choices, chunking, retrieval flow, and evaluation methods.",
            "Study latency, token cost, caching, hallucinations, and fallback design.",
            "Explain vector databases and retrieval pipelines in plain engineering terms.",
          ],
          drills: [
            "Three architecture prompts.",
            "One eval strategy discussion daily.",
            "Two failure-case retrospectives.",
          ],
        },
        {
          week: "Week 3",
          focus: "Applied deployment thinking",
          outcomes: [
            "Prepare answers on serving, monitoring, drift, offline vs online evaluation, and rollout risk.",
            "Rehearse tradeoff questions around fine-tuning versus prompting versus retrieval.",
            "Strengthen product judgment and stakeholder communication stories.",
          ],
          drills: [
            "Three project-deep mocks.",
            "Two system prompts on latency and reliability.",
            "Daily 10-minute tradeoff explanation.",
          ],
        },
        {
          week: "Week 4",
          focus: "Final confidence layer",
          outcomes: [
            "Consolidate your best AI stories with evidence, numbers, and lessons learned.",
            "Practice answering limitations openly without underselling your work.",
            "Tighten your explanation structure for model pipelines and evaluation loops.",
          ],
          drills: [
            "Alternate mocks and revision.",
            "Re-answer every weak AI question from your notes.",
            "Do one plain-English explanation drill daily.",
          ],
        },
      ],
      checkpoints: [
        "Can explain why a chosen model or pipeline was appropriate.",
        "Can discuss evaluation beyond accuracy alone.",
        "Can describe failure modes and mitigations credibly.",
      ],
      commonMistakes: [
        "Using AI buzzwords without system-level understanding.",
        "Describing model performance without mentioning evaluation setup.",
        "Ignoring cost, latency, or safety considerations in product-facing AI work.",
      ],
      resources: [
        "Your own experiment notes and ablation comparisons.",
        "Short ML metric revision sheets.",
        "Project-deep mock interviews focused on architecture and evaluation.",
      ],
      finalSprint: [
        "Prepare one strong story each on model choice, eval design, and failure mitigation.",
        "Revise embeddings, retrieval, prompts, and deployment tradeoffs.",
      ],
    },
  },
  {
    id: "BKE",
    title: "Backend Engineer",
    category: "Backend",
    desc: "Backend interview prep around APIs, data modeling, auth, caching, and scalable service design.",
    exp: "1-4 Years",
    qna: "19 Q&A",
    date: "25 Apr 2026",
    skills: "Node.js, Express, MongoDB, PostgreSQL, Redis, REST APIs",
    accent: "from-yellow-100 via-orange-50 to-white",
    icon: "Database",
    roadmap: {
      tagline:
        "A backend-focused roadmap for engineers who need to prove API craftsmanship, data reasoning, and production-minded service design.",
      fit:
        "Best for service, API, data, and reliability-heavy backend roles in startups and product companies.",
      northStar:
        "Prove that you can design backend systems that are correct, secure, observable, and maintainable under real usage.",
      coreAreas: [
        {
          title: "API and Service Design",
          items: [
            "REST principles, route design, validation, pagination, versioning, and idempotency.",
            "Authentication, authorization, session or token reasoning, and failure-safe design.",
            "Error handling, logging, retry semantics, and resilience boundaries.",
          ],
        },
        {
          title: "Data Layer Thinking",
          items: [
            "Schema design, relationships, indexing, query tuning, normalization versus denormalization.",
            "Transactions, consistency, caching, concurrency, and background jobs.",
            "Differences between SQL and NoSQL choices based on access patterns.",
          ],
        },
        {
          title: "Scale and Production Awareness",
          items: [
            "Load handling, bottlenecks, caching strategy, queues, rate limiting, and observability.",
            "Deployment basics, CI/CD awareness, secrets management, and monitoring signals.",
          ],
        },
      ],
      interviewLoops: [
        "Language/framework round on Node, Express, or equivalent backend stack.",
        "API or database design round.",
        "Project round focusing on architecture, auth, caching, and performance.",
      ],
      projectRequirements: [
        "At least one API-heavy project with data persistence and auth.",
        "One concrete scaling or optimization example, even if small in scope.",
        "Ability to justify database and caching choices with real tradeoffs.",
      ],
      monthPlan: [
        {
          week: "Week 1",
          focus: "Backend baseline",
          outcomes: [
            "Revise HTTP, REST, middleware flow, auth basics, and error handling.",
            "Map your projects to architecture diagrams with request flow and data flow.",
            "Refresh SQL queries, joins, indexing, and schema decisions.",
          ],
          drills: [
            "Daily API design mini-prompt.",
            "Three DB reasoning prompts.",
            "Two auth explanation mocks.",
          ],
        },
        {
          week: "Week 2",
          focus: "Data and performance",
          outcomes: [
            "Practice indexing, caching, query optimization, and rate limiting scenarios.",
            "Prepare stories around latency, bottlenecks, and production bugs.",
            "Revise Redis, queues, and asynchronous work patterns if present in your stack.",
          ],
          drills: [
            "Two optimization prompts.",
            "Three SQL practice sessions.",
            "One bug deep-dive per day.",
          ],
        },
        {
          week: "Week 3",
          focus: "Project-deep interviews",
          outcomes: [
            "Run mocks centered on architecture, auth, and data consistency.",
            "Practice defending tradeoffs between simplicity and scalability.",
            "Tighten your answers about failure handling and monitoring.",
          ],
          drills: [
            "Three project-deep mocks.",
            "Daily verbal architecture explanation.",
            "Two observability scenarios.",
          ],
        },
        {
          week: "Week 4",
          focus: "Production polish",
          outcomes: [
            "Consolidate strong answers for API design, schema design, and scale tradeoffs.",
            "Review security basics, race conditions, and retry pitfalls.",
            "Enter interviews with concise architecture talk tracks.",
          ],
          drills: [
            "Alternate revision and live mocks.",
            "Re-answer failed prompts from memory.",
            "Final quick sheet on backend failure modes.",
          ],
        },
      ],
      checkpoints: [
        "Can explain an API lifecycle from request to persistence to response.",
        "Can justify an indexing or caching choice clearly.",
        "Can discuss backend security and error handling as first-class concerns.",
      ],
      commonMistakes: [
        "Treating REST as just routes without thinking about contracts or failure behavior.",
        "Listing databases used without understanding query patterns or indexing.",
        "Skipping observability and reliability when describing backend projects.",
      ],
      resources: [
        "API design exercises.",
        "Schema and indexing cheat sheets.",
        "Your own project logs, bugs, and architecture sketches.",
      ],
      finalSprint: [
        "Prepare one crisp example each for auth, caching, scaling, and debugging.",
        "Rehearse DB and API tradeoff answers out loud.",
      ],
    },
  },
  {
    id: "PLT",
    title: "Platform Engineer",
    category: "Platform",
    desc: "Developer-platform and cloud systems interviews with CI/CD, tooling, automation, and internal infra.",
    exp: "2-5 Years",
    qna: "17 Q&A",
    date: "25 Apr 2026",
    skills: "CI/CD, Docker, Kubernetes, AWS, IaC, Internal Tooling",
    accent: "from-lime-100 via-emerald-50 to-white",
    icon: "Workflow",
    roadmap: {
      tagline:
        "A roadmap for engineers who build the paved road for other developers: tooling, deployment workflows, cloud foundations, and automation.",
      fit:
        "Best for internal platform, developer experience, release engineering, and cloud-infrastructure support roles.",
      northStar:
        "Demonstrate that you improve developer velocity without sacrificing reliability, security, or operational clarity.",
      coreAreas: [
        {
          title: "Developer Platform Thinking",
          items: [
            "CI/CD pipelines, template services, internal tooling, and reusable delivery workflows.",
            "Golden paths, self-service enablement, platform adoption, and developer pain reduction.",
            "How platform teams balance standardization with team autonomy.",
          ],
        },
        {
          title: "Cloud and Container Foundations",
          items: [
            "Containers, orchestration basics, infrastructure as code, secrets, networking, and environments.",
            "Deployment strategies, rollback plans, config management, and release risk controls.",
          ],
        },
        {
          title: "Operational Enablement",
          items: [
            "Metrics for platform success: build time, deployment frequency, recovery time, and developer happiness.",
            "Documentation, onboarding, governance, and support models.",
          ],
        },
      ],
      interviewLoops: [
        "Pipeline and automation round.",
        "Cloud/IaC or Kubernetes round.",
        "Developer experience and stakeholder alignment discussion.",
      ],
      projectRequirements: [
        "A strong example of automation that reduced friction or errors.",
        "At least one narrative around CI/CD, release flow, or internal tooling design.",
        "Evidence that you thought about adoption, not just implementation.",
      ],
      monthPlan: [
        {
          week: "Week 1",
          focus: "Cloud and deployment baseline",
          outcomes: [
            "Refresh containers, build pipelines, deployment stages, and rollback patterns.",
            "Map one internal tooling or automation project end to end.",
            "Review networking and secrets basics in platform contexts.",
          ],
          drills: [
            "One pipeline explanation daily.",
            "Two cloud tradeoff prompts.",
            "One internal tool architecture summary every two days.",
          ],
        },
        {
          week: "Week 2",
          focus: "Developer productivity depth",
          outcomes: [
            "Practice talking about platform adoption, platform UX, and reducing repeated toil.",
            "Revisit metrics that matter for platform outcomes.",
            "Prepare stakeholder stories involving product teams or service owners.",
          ],
          drills: [
            "Three platform tradeoff discussions.",
            "Two developer journey mapping exercises.",
            "Two behavioral stories on cross-team alignment.",
          ],
        },
        {
          week: "Week 3",
          focus: "Systems and governance",
          outcomes: [
            "Revise security, policy, templates, guardrails, and reliability mechanisms.",
            "Explain how you keep flexibility without total chaos.",
            "Practice balancing speed with compliance and standardization.",
          ],
          drills: [
            "Three governance scenario prompts.",
            "Daily cloud architecture explanation.",
            "One adoption-risk discussion daily.",
          ],
        },
        {
          week: "Week 4",
          focus: "Polished platform storytelling",
          outcomes: [
            "Refine stories around migration, adoption, rollout, and developer enablement.",
            "Prepare clear before-and-after metrics where possible.",
            "Consolidate a simple platform philosophy you can articulate consistently.",
          ],
          drills: [
            "Three final mocks.",
            "Review weak answers from prior rounds.",
            "Daily 5-minute platform pitch rehearsal.",
          ],
        },
      ],
      checkpoints: [
        "Can explain how a platform initiative reduced toil or improved reliability.",
        "Can discuss tradeoffs between central control and team autonomy.",
        "Can describe release pipelines clearly from commit to production.",
      ],
      commonMistakes: [
        "Focusing only on tools instead of developer outcomes.",
        "Ignoring adoption, documentation, and platform usability.",
        "Talking about cloud services without explaining how they support delivery workflows.",
      ],
      resources: [
        "Internal tooling architecture notes.",
        "Pipeline diagrams and rollout docs.",
        "Developer experience case studies from your own work.",
      ],
      finalSprint: [
        "Prepare one memorable story each on automation, platform adoption, and release safety.",
        "Revise cloud and container fundamentals through a platform lens.",
      ],
    },
  },
  {
    id: "SEC",
    title: "Security Engineer",
    category: "Security",
    desc: "Security-focused interviews for appsec, cloud posture, IAM, secure design, and incident readiness.",
    exp: "2-5 Years",
    qna: "16 Q&A",
    date: "25 Apr 2026",
    skills: "OWASP, IAM, Threat Modeling, Cloud Security, AppSec, SIEM",
    accent: "from-rose-100 via-red-50 to-white",
    icon: "ShieldCheck",
    roadmap: {
      tagline:
        "A security roadmap for candidates who need to show not just awareness of threats, but practical prevention, detection, and response maturity.",
      fit:
        "Best for appsec, product security, cloud security, blue-team, and secure engineering interview tracks.",
      northStar:
        "Show that you can identify realistic risk, prioritize it sensibly, and improve system safety without slowing everything down blindly.",
      coreAreas: [
        {
          title: "Secure Design Fundamentals",
          items: [
            "Authentication, authorization, secrets handling, secure defaults, least privilege, and input validation.",
            "Threat modeling basics, trust boundaries, abuse cases, and design review thinking.",
            "OWASP-style vulnerabilities with practical mitigation logic.",
          ],
        },
        {
          title: "Cloud and Platform Security",
          items: [
            "IAM policies, network boundaries, encryption, logging, posture management, and misconfiguration risks.",
            "CI/CD and secrets scanning, dependency hygiene, and secure release practices.",
          ],
        },
        {
          title: "Detection and Response",
          items: [
            "Security monitoring signals, triage process, incident communication, and post-incident hardening.",
            "Ability to prioritize high-signal findings instead of creating noise.",
          ],
        },
      ],
      interviewLoops: [
        "AppSec or secure coding round.",
        "Threat modeling or architecture review round.",
        "Cloud security or IAM deep-dive.",
        "Behavioral round on risk communication and stakeholder persuasion.",
      ],
      projectRequirements: [
        "At least one story about preventing or detecting a meaningful security issue.",
        "A clear example of balancing security with developer experience or product constraints.",
        "Comfort explaining risk severity and remediation priority.",
      ],
      monthPlan: [
        {
          week: "Week 1",
          focus: "Security fundamentals refresh",
          outcomes: [
            "Revise common vulnerability classes, auth flows, session handling, and secure validation.",
            "Create a short threat-model template you can use in interviews.",
            "Map your project experience to concrete security controls.",
          ],
          drills: [
            "Daily vulnerability explanation.",
            "Two threat-model walk-throughs.",
            "Two secure design discussions.",
          ],
        },
        {
          week: "Week 2",
          focus: "Cloud and IAM depth",
          outcomes: [
            "Review permissions, keys, secrets, logs, network boundaries, and misconfiguration patterns.",
            "Practice explaining the blast radius of common cloud mistakes.",
            "Rehearse least-privilege improvements from real or hypothetical systems.",
          ],
          drills: [
            "Three IAM scenario prompts.",
            "Two cloud-risk breakdowns.",
            "Daily one mitigation design.",
          ],
        },
        {
          week: "Week 3",
          focus: "Detection and incident thinking",
          outcomes: [
            "Understand alert triage, meaningful signal selection, and response flow.",
            "Prepare one incident story or simulated response structure.",
            "Practice communicating risk to engineering and management audiences.",
          ],
          drills: [
            "Three detection strategy prompts.",
            "Two incident simulations.",
            "Two stakeholder communication mocks.",
          ],
        },
        {
          week: "Week 4",
          focus: "Security judgment polish",
          outcomes: [
            "Refine prioritization language: severity, exploitability, impact, and remediation cost.",
            "Avoid sounding alarmist by grounding advice in tradeoffs.",
            "Consolidate strong stories around prevention, review, and enablement.",
          ],
          drills: [
            "Three final mocks.",
            "Daily risk-priority explanation.",
            "Review secure design patterns one last time.",
          ],
        },
      ],
      checkpoints: [
        "Can explain a threat model with clear trust boundaries.",
        "Can justify why one finding matters more than another.",
        "Can describe security as an enabler, not just a blocker.",
      ],
      commonMistakes: [
        "Reciting OWASP terms without practical exploit or mitigation understanding.",
        "Treating all findings as equally urgent.",
        "Ignoring developer workflow and usability in security recommendations.",
      ],
      resources: [
        "Threat-model templates.",
        "Secure design review notes.",
        "Your own remediation or hardening stories.",
      ],
      finalSprint: [
        "Prepare one story each for appsec, cloud risk, and stakeholder influence.",
        "Revise auth, IAM, and input-validation patterns thoroughly.",
      ],
    },
  },
  {
    id: "FSD",
    title: "Full Stack Engineer",
    category: "Full Stack",
    desc: "End-to-end track for frontend, backend, integration, and product delivery conversations.",
    exp: "1-4 Years",
    qna: "21 Q&A",
    date: "25 Apr 2026",
    skills: "React, Node.js, SQL, Auth, State Management, Deployment",
    accent: "from-indigo-100 via-blue-50 to-white",
    icon: "Cpu",
    roadmap: {
      tagline:
        "A full-stack roadmap for candidates who need to move smoothly between UI, API, data, and deployment conversations.",
      fit:
        "Best for startup, product, and feature-owner roles where interviewers expect breadth plus enough depth to build end-to-end features confidently.",
      northStar:
        "Show that you can own a feature from user interaction to backend persistence to deployment, while still thinking about quality and tradeoffs.",
      coreAreas: [
        {
          title: "Frontend Delivery",
          items: [
            "Component architecture, state management, forms, validation, performance, and accessibility.",
            "API integration, loading states, error handling, and responsive UI behavior.",
            "Testing and maintainable UI structure rather than ad-hoc screens.",
          ],
        },
        {
          title: "Backend and Data Flow",
          items: [
            "REST APIs, auth, input validation, persistence, schema design, and service organization.",
            "Understanding how frontend needs influence API contracts and caching.",
            "Debugging across the full request path rather than just one layer.",
          ],
        },
        {
          title: "End-to-End Product Ownership",
          items: [
            "Deployment, environment config, monitoring basics, and release confidence.",
            "Ability to reason about user experience, developer experience, and implementation tradeoffs together.",
          ],
        },
      ],
      interviewLoops: [
        "Frontend or React-focused round.",
        "Backend/API/data round.",
        "Project round centered on full feature delivery and architecture choices.",
        "Behavioral round around ownership and prioritization.",
      ],
      projectRequirements: [
        "At least one complete full-stack project with real CRUD or workflow depth.",
        "A strong explanation of how frontend and backend contracts were designed together.",
        "A clear debugging story that crossed multiple layers of the stack.",
      ],
      monthPlan: [
        {
          week: "Week 1",
          focus: "Breadth reset",
          outcomes: [
            "Audit your frontend, backend, and database confidence separately.",
            "Revise React fundamentals, API flow, auth basics, and schema reasoning.",
            "Prepare one end-to-end project story with user flow and architecture.",
          ],
          drills: [
            "Daily front-or-back revision block.",
            "Two UI state management prompts.",
            "Two API and DB explanations.",
          ],
        },
        {
          week: "Week 2",
          focus: "Cross-layer integration",
          outcomes: [
            "Practice how the UI triggers API workflows, validations, and persistence.",
            "Review loading, retries, optimistic updates, and error boundaries.",
            "Explain how auth and permissions appear in both frontend and backend layers.",
          ],
          drills: [
            "Daily end-to-end feature walkthrough.",
            "Three integration bug scenarios.",
            "Two auth flow diagrams.",
          ],
        },
        {
          week: "Week 3",
          focus: "Project depth and debugging",
          outcomes: [
            "Run project-deep mocks that force you to switch between layers.",
            "Prepare performance and maintainability improvement stories.",
            "Strengthen deployment and environment understanding.",
          ],
          drills: [
            "Three full-stack mocks.",
            "Daily bug root-cause discussion.",
            "Two deployment or release prompts.",
          ],
        },
        {
          week: "Week 4",
          focus: "Confident ownership",
          outcomes: [
            "Consolidate your strongest full-stack feature examples.",
            "Practice concise answers that stay structured despite the role breadth.",
            "Review weak spots in frontend performance, backend reliability, or DB reasoning.",
          ],
          drills: [
            "Alternate revision and mixed mocks.",
            "Repeat failed questions from previous sessions.",
            "One complete feature walkthrough daily.",
          ],
        },
      ],
      checkpoints: [
        "Can explain the full lifecycle of a feature from UI event to persisted data.",
        "Can reason about tradeoffs across frontend, backend, and deployment layers.",
        "Can discuss debugging across integration boundaries calmly.",
      ],
      commonMistakes: [
        "Being too shallow in both frontend and backend instead of strong in one and credible in the other.",
        "Ignoring API contracts and data shape decisions.",
        "Describing projects as screens and endpoints instead of user flows and system behavior.",
      ],
      resources: [
        "End-to-end project diagrams.",
        "API contract and schema notes.",
        "Front-to-back debugging stories from your own builds.",
      ],
      finalSprint: [
        "Prepare one memorable story each for UI complexity, backend design, and end-to-end debugging.",
        "Revise React, auth, API design, and deployment basics together, not in isolation.",
      ],
    },
  },
];

const roleTrackMap = Object.fromEntries(
  roleTracks.map((track) => [track.id, track]),
);

export { roleTracks, roleTrackMap };
