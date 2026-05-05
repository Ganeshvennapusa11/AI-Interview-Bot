import {
  evaluateAIAnswer,
  generateAIQuestions,
  generateInterviewChatReply,
} from "../services/openaiService.js";

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

    const normalizedQuestionCount = Math.min(Math.max(Number(questionCount) || 5, 1), 10);

    const questions = await generateAIQuestions({
      role,
      roundType: selectedRound,
      experienceLevel,
      companyType,
      jobDescription,
      resumeText,
      parsedResume,
      questionCount: normalizedQuestionCount,
      difficulty: String(difficulty).toLowerCase(),
      questionStyle: String(questionStyle).toLowerCase(),
    });

    return res.json({
      success: true,
      questions,
    });
  } catch (error) {
    console.error("Generate Interview Error:", error);
    return res.status(500).json({ error: "Failed to generate interview" });
  }
};

export const evaluateAnswer = async (req, res) => {
  try {
    const { question, answer, roundType = "technical_1_dsa" } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ error: "Question and answer are required" });
    }

    const selectedRound = normalizeRoundType(roundType);
    const feedback = await evaluateAIAnswer({
      question,
      answer,
      roundType: selectedRound,
    });

    return res.json({
      success: true,
      feedback: feedback.feedback || "Evaluation completed.",
      evaluation: feedback,
    });
  } catch (error) {
    console.error("Evaluate Error:", error);
    return res.status(500).json({ error: "Evaluation failed" });
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
    return res.status(500).json({ error: "Failed to get AI response" });
  }
};
