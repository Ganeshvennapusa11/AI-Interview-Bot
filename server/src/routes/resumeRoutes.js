import express from "express";
import {
  uploadResume,
  resumeUploadMiddleware,
} from "../controllers/resumeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/upload", protect, resumeUploadMiddleware, uploadResume);

export default router;
