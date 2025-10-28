// server/src/controllers/resumeController.js

import fs from "fs";
import path from "path";
import multer from "multer";
import { extractResumeInsights } from "../services/openaiService.js";
import { parseResume } from "../utils/parseResume.js";

// ✅ Setup Multer for file upload
const upload = multer({ dest: "uploads/" });

// ✅ Controller function for uploading + analyzing resume
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No resume file uploaded" });
    }

    const filePath = path.join("uploads", req.file.filename);
    const dataBuffer = fs.readFileSync(filePath);

    // ✅ Use parseResume utility
    const resumeText = await parseResume(dataBuffer);

    // ✅ Get AI-based insights
    const insights = await extractResumeInsights(resumeText);

    // ✅ Clean up uploaded file
    fs.unlinkSync(filePath);

    return res.status(200).json({
      success: true,
      message: "Resume uploaded and analyzed successfully",
      insights,
    });
  } catch (error) {
    console.error("❌ Resume Upload Error:", error);
    res.status(500).json({ error: "Failed to process resume" });
  }
};

// ✅ Export Multer middleware
export const resumeUploadMiddleware = upload.single("resume");
