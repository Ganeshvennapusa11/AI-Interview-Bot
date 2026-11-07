import express from "express";
import { generateInterview, evaluateAnswer } from "../controllers/interviewController.js";
import { createCodingChallenge, reviewCode } from "../controllers/codingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected: only authenticated users can generate or evaluate questions
router.post("/generate", protect, generateInterview);
router.post("/evaluate", protect, evaluateAnswer);

// Live coding round: the browser runs the tests, the server writes the problem
// and reviews the approach.
router.post("/coding/generate", protect, createCodingChallenge);
router.post("/coding/review", protect, reviewCode);
export default router;
