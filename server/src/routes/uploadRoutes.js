import express from "express";
import multer from "multer";
import { uploadResume } from "../controllers/uploadController.js";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.post("/upload", upload.single("resume"), uploadResume);

export default router;
