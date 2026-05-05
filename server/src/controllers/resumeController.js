import fs from "fs/promises";
import path from "path";
import multer from "multer";
import { extractResumeInsights } from "../services/openaiService.js";
import { parseResume } from "../utils/parseResume.js";
import User from "../models/User.js";

const allowedExtensions = [".pdf", ".docx", ".txt"];
const allowedMimeTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const isValidExtension = allowedExtensions.includes(ext);
    const isValidMimeType = allowedMimeTypes.includes(file.mimetype);

    if (!isValidExtension || !isValidMimeType) {
      return cb(new Error("Unsupported file format. Please upload PDF, DOCX, or TXT."));
    }

    cb(null, true);
  },
});

export const uploadResume = async (req, res) => {
  let filePath = "";

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No resume file uploaded" });
    }

    filePath = req.file.path;

    const role = req.body.role?.trim() || "General Software Engineer";
    const resumeText = await parseResume(filePath, req.file.originalname);
    const insights = await extractResumeInsights(resumeText, role);

    const responseInsights = {
      ...insights,
      resumeText,
    };

    if (req.user?._id) {
      await User.findByIdAndUpdate(req.user._id, {
        $push: {
          analysisHistory: {
            role,
            matchScore: insights.matchScore ?? 0,
            opinion: insights.opinion || "",
            missingKeywords: insights.missingKeywords || [],
            suggestions: insights.suggestions || [],
            createdAt: new Date(),
          },
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Resume uploaded and analyzed successfully",
      insights: responseInsights,
    });
  } catch (error) {
    console.error("Resume Upload Error:", error);
    return res.status(500).json({
      error: error.message || "Failed to process resume",
    });
  } finally {
    if (filePath) {
      try {
        await fs.unlink(filePath);
      } catch (error) {
        console.error("Failed to clean up uploaded file:", error.message);
      }
    }
  }
};

export const resumeUploadMiddleware = upload.single("resume");
