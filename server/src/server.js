import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config.js";
import userRoutes from "./routes/userRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import { protect } from "./middleware/authMiddleware.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { interviewChat } from "./controllers/interviewController.js";

connectDB();

const app = express();

const configuredOrigins = process.env.FRONTEND_URLS
  ? process.env.FRONTEND_URLS.split(",").map((origin) => origin.trim()).filter(Boolean)
  : [];

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://ai-interview-bot.vercel.app",
  ...configuredOrigins,
];

const isAllowedOrigin = (origin = "") =>
  allowedOrigins.includes(origin) || /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin);

app.use(helmet());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || isAllowedOrigin(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed"), false);
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many auth requests. Please try again later.",
  },
});

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many AI requests. Please try again later.",
  },
});

app.use(globalLimiter);

app.use("/api/user/login", authLimiter);
app.use("/api/user/register", authLimiter);

app.use("/api/user", userRoutes);
app.use("/api/interview", aiLimiter, interviewRoutes);
app.use("/api/resume", aiLimiter, resumeRoutes);
app.post("/api/chat", protect, aiLimiter, interviewChat);

app.get("/", (req, res) => {
  res.send("AI Interview Bot Backend is running successfully!");
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
