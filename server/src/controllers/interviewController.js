import {
  evaluateAIAnswer,
  generateAIQuestions,
  generateInterviewChatReply,
} from "../services/openaiService.js";
import { gradeAnswerWithoutAI } from "../services/baselineGrader.js";
import { isValidPersona, DEFAULT_PERSONA_ID } from "../services/personas.js";
import { resolveDifficulty } from "../services/companyTiers.js";

const allowedRounds = [
  "technical_1_dsa",
  "technical_2_fundamentals",
  "technical_2_projects",
  "hr",
  "managerial",
  "full_mock",
];

const allowedDifficulties = ["easy", "medium", "hard"];
const allowedQuestionStyles = [
  "standard",
  "resume_heavy",
  "project_deep",
  "fundamentals_deep",
  "behavioral_sharp",
];

const roundAliases = {
  technical: "technical_1_dsa",
  hr: "hr",
  managerial: "managerial",
  full_mock: "full_mock",
};

const normalizeRoundType = (value = "") =>
  roundAliases[String(value).trim().toLowerCase()] || String(value).trim();

export const generateInterview = async (req, res) => {
  try {
    const {
      role,
      roundType,
      round,
      experienceLevel = "Fresher",
      companyType = "General",
      jobDescription = "",
      resumeText = "",
      parsedResume = {},
      questionCount = 5,
      difficulty = "medium",
      questionStyle = "standard",
      persona = DEFAULT_PERSONA_ID,
      adaptiveContext = {},
    } = req.body;

    const selectedRound = normalizeRoundType(roundType || round);

    if (!role || !selectedRound) {
      return res.status(400).json({ error: "Role and roundType are required" });
    }

    if (!allowedRounds.includes(selectedRound)) {
      return res.status(400).json({ error: "Invalid round type" });
    }

    if (!allowedDifficulties.includes(String(difficulty).toLowerCase())) {
      return res.status(400).json({ error: "Invalid difficulty level" });
    }

    if (!allowedQuestionStyles.includes(String(questionStyle).toLowerCase())) {
      return res.status(400).json({ error: "Invalid question style" });
    }

    if (!isValidPersona(persona)) {
      return res.status(400).json({ error: "Unknown interviewer persona" });
    }

    const normalizedQuestionCount = Math.min(Math.max(Number(questionCount) || 5, 1), 10);

    // The company tier sets the bar, so the requested difficulty is clamped into
    // that tier's band rather than used as given.
    const { difficulty: appliedDifficulty, tier } = resolveDifficulty(companyType, difficulty);

    const questions = await generateAIQuestions({
      role,
      roundType: selectedRound,
      experienceLevel,
      companyType,
      jobDescription,
      resumeText,
      parsedResume,
      questionCount: normalizedQuestionCount,
      difficulty: appliedDifficulty,
      questionStyle: String(questionStyle).toLowerCase(),
      persona,
      adaptiveContext,
    });

    return res.json({
      success: true,
      questions,
      meta: {
        difficulty: appliedDifficulty,
        requestedDifficulty: String(difficulty).toLowerCase(),
        companyTier: {
          level: tier.level,
          label: tier.label,
          blurb: tier.blurb,
          systemDesign: tier.systemDesign,
        },
      },
    });
  } catch (error) {
    console.error("Generate Interview Error:", error);

    if (error.isModelError) {
      return res.status(503).json({ error: error.message });
    }

    return res.status(500).json({ error: "Failed to generate interview" });
  }
};

/** Render the deterministic grader's output in the same shape as the AI's. */
const baselineAsEvaluation = (baseline) => ({
  feedback:
    baseline.notes.length > 0
      ? `Scored ${baseline.score}/10 by the deterministic grader. ${baseline.notes[0]}`
      : `Scored ${baseline.score}/10 by the deterministic grader.`,
  score: {
    overall: baseline.score,
    clarity: baseline.breakdown.readability,
    depth: baseline.breakdown.structure,
    correctness: baseline.breakdown.coverage,
  },
  strengths: baseline.signals.markersPresent.map((marker) => `Covered the "${marker}" part of the answer`),
  improvements: baseline.notes,
  idealAnswerPoints: [],
  followUpQuestion: "",
});

export const evaluateAnswer = async (req, res) => {
  const {
    question,
    answer,
    roundType = "technical_1_dsa",
    role = "Software Engineer",
  } = req.body;

  if (!question || !answer) {
    return res.status(400).json({ error: "Question and answer are required" });
  }

  const selectedRound = normalizeRoundType(roundType);

  // The baseline always runs: it is the control condition for the AI grader,
  // and the safety net if the provider is down.
  const baseline = gradeAnswerWithoutAI({
    question,
    answer,
    role,
    roundType: selectedRound,
  });

  try {
    const feedback = await evaluateAIAnswer({
      question,
      answer,
      roundType: selectedRound,
    });

    const aiScore = Number(feedback?.score?.overall);
    const agreement = Number.isFinite(aiScore)
      ? {
          aiScore,
          baselineScore: baseline.score,
          delta: Math.round(Math.abs(aiScore - baseline.score) * 10) / 10,
          verdict:
            Math.abs(aiScore - baseline.score) <= 1
              ? "agree"
              : Math.abs(aiScore - baseline.score) <= 2.5
                ? "close"
                : "diverge",
        }
      : null;

    return res.json({
      success: true,
      gradedBy: "ai",
      feedback: feedback.feedback || "Evaluation completed.",
      evaluation: feedback,
      baseline,
      agreement,
    });
  } catch (error) {
    console.error("Evaluate Error:", error);

    // An AI outage degrades the grade, it does not break the interview.
    const fallback = baselineAsEvaluation(baseline);

    return res.json({
      success: true,
      gradedBy: "baseline",
      degraded: true,
      degradedReason: error.isModelError
        ? "The AI grader is unavailable, so this answer was scored by the deterministic grader."
        : "The AI grader failed, so this answer was scored by the deterministic grader.",
      feedback: fallback.feedback,
      evaluation: fallback,
      baseline,
      agreement: null,
    });
  }
};

export const interviewChat = async (req, res) => {
  try {
    const { message, context = {} } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    const reply = await generateInterviewChatReply({
      message: message.trim(),
      context,
    });

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Interview chat error:", error);

    if (error.isModelError) {
      return res.status(503).json({ error: error.message });
    }

    return res.status(500).json({ error: "Failed to get AI response" });
  }
};
