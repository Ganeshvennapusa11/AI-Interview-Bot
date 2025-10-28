import { generateAIQuestions } from "../services/openaiService.js";

export const generateInterview = async (req, res, next) => {
  try {
    const { jobDescription, resumeText, round, difficulty, companyType } = req.body;

    if (!jobDescription && !resumeText)
      return res.status(400).json({ error: "Missing job description or resume" });

    const questions = await generateAIQuestions({
      jobDescription,
      resumeText,
      round,
      difficulty,
      companyType,
    });

    res.status(200).json({ success: true, questions });
  } catch (err) {
    console.error("❌ Error in generating questions:", err);
    next(err);
  }
};
