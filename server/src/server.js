import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import mongoose from "mongoose";
import { connectDB } from "./config.js";

// ✅ Import routes
import userRoutes from "./routes/userRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";

dotenv.config();

// ✅ Connect to MongoDB (Atlas or local depending on .env)
connectDB();

const app = express();
app.use(express.json());

// ✅ CORS configuration
const allowedOrigins = [
  "http://localhost:5173", // for local development (Vite)
  "https://ai-interview-bot.vercel.app", // your Vercel frontend (update when deployed)
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS policy violation"), false);
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a friendly and helpful AI assistant." },
        { role: "user", content: message },
      ],
    });

    const reply =
      completion.choices[0]?.message?.content || "Sorry, I couldn’t process that.";
    res.json({ reply });
  } catch (error) {
    console.error("Chat API Error:", error);
    res.status(500).json({ error: "Failed to get AI response" });
  }
});

// ✅ Mount all routes
app.use("/api/user", userRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/resume", resumeRoutes);

// 🧪 MongoDB test route (optional)
app.post("/api/testdb", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });

    const result = await mongoose.connection.collection("test").insertOne({ name });
    res.json({ success: true, insertedId: result.insertedId });
  } catch (err) {
    console.error("DB Test Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Default root route
app.get("/", (req, res) => {
  res.send("✅ AI Interview Bot Backend is running successfully on Render!");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
