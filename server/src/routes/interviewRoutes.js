import express from "express";
import { generateInterview } from "../controllers/interviewController.js";

const router = express.Router();

// ✅ Correct function name here
router.post("/generate", generateInterview);

export default router;
