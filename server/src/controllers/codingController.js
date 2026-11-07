import {
  generateCodingChallenge,
  getFallbackChallenge,
  reviewCodeSubmission,
} from "../services/codingService.js";
import { isValidPersona, DEFAULT_PERSONA_ID } from "../services/personas.js";
import { getCompanyTier } from "../services/companyTiers.js";

const allowedDifficulties = ["easy", "medium", "hard"];

export const createCodingChallenge = async (req, res) => {
  try {
    const {
      role = "Software Engineer",
      difficulty = "medium",
      companyType = "General",
      persona = DEFAULT_PERSONA_ID,
      parsedResume = {},
      askedTitles = [],
    } = req.body;

    // A level 3 company asks a hard problem regardless of what the UI requested.
    const tier = getCompanyTier(companyType);
    const normalizedDifficulty = tier.codingDifficulty || String(difficulty).toLowerCase();

    if (!allowedDifficulties.includes(normalizedDifficulty)) {
      return res.status(400).json({ error: "Invalid difficulty level" });
    }

    const challenge = await generateCodingChallenge({
      role,
      companyType,
      difficulty: normalizedDifficulty,
      personaId: isValidPersona(persona) ? persona : DEFAULT_PERSONA_ID,
      parsedResume,
      askedTitles: Array.isArray(askedTitles) ? askedTitles.slice(0, 5) : [],
    });

    return res.json({
      success: true,
      challenge,
      meta: {
        difficulty: normalizedDifficulty,
        companyTier: { level: tier.level, label: tier.label },
      },
    });
  } catch (error) {
    console.error("Coding challenge error:", error);

    // The round still has to start. Every difficulty has a built-in problem with
    // known-good tests, so an AI outage costs variety, not the interview.
    return res.json({
      success: true,
      degraded: true,
      degradedReason: error.isModelError
        ? "The AI could not write a new problem, so this is a built-in one."
        : "Problem generation failed, so this is a built-in problem.",
      // The tier decides the fallback too, otherwise a level 3 company would get
      // the medium built-in problem.
      challenge: getFallbackChallenge(
        getCompanyTier(req.body?.companyType || "General").codingDifficulty
      ),
    });
  }
};

export const reviewCode = async (req, res) => {
  try {
    const {
      challenge,
      code,
      language = "javascript",
      executed = true,
      testSummary = null,
      complexity = null,
      role = "Software Engineer",
      persona = DEFAULT_PERSONA_ID,
    } = req.body;

    if (!challenge?.title || !String(code || "").trim()) {
      return res.status(400).json({ error: "Challenge and code are required" });
    }

    const review = await reviewCodeSubmission({
      challenge,
      code,
      language,
      executed: Boolean(executed),
      testSummary: testSummary || {},
      complexity,
      role,
      personaId: isValidPersona(persona) ? persona : DEFAULT_PERSONA_ID,
    });

    return res.json({ success: true, review });
  } catch (error) {
    console.error("Code review error:", error);

    // Tests already ran in the browser, so a failed review still leaves a grade
    // for the languages that execute. For C++ and Java there is nothing to fall
    // back on, and saying so is better than inventing a score.
    const { passed = 0, total = 0 } = req.body?.testSummary || {};
    const wasExecuted = req.body?.executed !== false && total > 0;
    const passRate = wasExecuted && total > 0 ? passed / total : 0;

    return res.json({
      success: true,
      degraded: true,
      degradedReason: error.isModelError
        ? "The AI reviewer is unavailable."
        : "The AI reviewer failed.",
      review: {
        feedback: wasExecuted
          ? `Passed ${passed} of ${total} tests. The AI review could not be generated, so only the measured results are shown.`
          : "The AI review could not be generated, and this language is not executed in the browser, so there is no grade for this submission.",
        score: wasExecuted
          ? {
              overall: Math.round(passRate * 10),
              correctness: Math.round(passRate * 10),
              complexity: 0,
              readability: 0,
              edgeCases: Math.round(passRate * 10),
            }
          : { overall: 0, correctness: 0, complexity: 0, readability: 0, edgeCases: 0 },
        complexityAssessment: "",
        strengths: [],
        improvements: [],
        idealApproach: [],
        followUpQuestion: "",
      },
    });
  }
};
