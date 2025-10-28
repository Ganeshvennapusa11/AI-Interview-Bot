// src/services/openaiService.js
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

let openai;
try {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("❌ Missing OPENAI_API_KEY in .env");
  }
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  console.log("✅ OpenAI client initialized successfully");
} catch (err) {
  console.error("❌ Failed to initialize OpenAI client:", err.message);
}

/**
 * Generate interview questions dynamically using resume + role context
 */
export async function generateAIQuestions({
  jobDescription,
  resumeText,
  round,
  difficulty,
  companyType,
}) {
  if (!openai) throw new Error("OpenAI not initialized");

  try {
    const roundType =
      round === 1
        ? "Technical Round 1"
        : round === 2
        ? "Technical / Managerial Round"
        : "HR Round";

    const prompt = `
You are an expert interviewer for ${companyType} companies.
Generate 7 ${difficulty}-level questions for the ${roundType}.
The questions should be tailored based on the candidate's resume and job description.

Provide the response strictly in JSON format:
{
  "round": "${roundType}",
  "difficulty": "${difficulty}",
  "questions": [
    "Question 1...",
    "Question 2...",
    ...
  ]
}

--- Resume ---
${resumeText}

--- Job Description ---
${jobDescription}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    const content = completion.choices[0].message.content.trim();

    // Parse JSON safely
    try {
      const parsed = JSON.parse(content);
      return parsed;
    } catch {
      console.warn("⚠️ Fallback: JSON parse failed, returning text instead");
      return { questions: content.split("\n").filter((q) => q.trim() !== "") };
    }
  } catch (err) {
    console.error("❌ Error generating AI questions:", err);
    throw new Error("Failed to generate interview questions");
  }
}

/**
 * Extract structured data from resume text
 */
export async function extractResumeInsights(resumeText) {
  if (!openai) throw new Error("OpenAI not initialized");

  try {
    const prompt = `
You are an AI HR assistant. From the resume text below, extract:
1. Candidate summary (2–3 lines)
2. Top 5 skills
3. Years of experience
4. Notable projects or achievements
5. Education background
6. Certifications (if any)

Return a clean JSON object with keys:
{
  "summary": "",
  "skills": [],
  "experience": "",
  "projects": [],
  "education": "",
  "certifications": ""
}

Resume text:
${resumeText}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
    });

    const text = completion.choices[0].message.content.trim();

    // Safe JSON parsing
    try {
      return JSON.parse(text);
    } catch {
      console.warn("⚠️ Could not parse JSON properly, returning fallback object.");
      return {
        summary: "",
        skills: [],
        experience: "",
        projects: [],
        education: "",
        certifications: "",
      };
    }
  } catch (err) {
    console.error("❌ Error extracting resume insights:", err);
    return {
      summary: "",
      skills: [],
      experience: "",
      projects: [],
      education: "",
      certifications: "",
    };
  }
}
