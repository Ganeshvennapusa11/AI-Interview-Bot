import express from "express";
import { generateInterview, evaluateAnswer } from "../controllers/interviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// router.post("/generate", generateInterview);
// router.post("/evaluate", evaluateAnswer);
// ✅ Protected: only authenticated users can generate or evaluate questions
router.post("/generate", protect, generateInterview);
router.post("/evaluate", protect, evaluateAnswer);
export default router;
