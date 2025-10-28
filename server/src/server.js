import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import mongoose from "mongoose"; // ✅ Added for the DB test route
import { connectDB } from "./config.js";

// ✅ Import routes
import userRoutes from "./routes/userRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js"; // ✅ Resume parsing route

dotenv.config();

// ✅ Connect to MongoDB (Local MongoDB via Compass)
connectDB();

const app = express();
app.use(express.json());

// ✅ Enable CORS for your frontend (Vite usually runs on port 5173)
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// ✅ Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ Chat Endpoint (for general chatbot communication)
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

// ✅ Mount all route modules
app.use("/api/user", userRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/resume", resumeRoutes); // ✅ Resume route for PDF parsing + AI insight

// 🧪 TEMP: Test MongoDB connection (You can remove this later)
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

// ✅ Default route
app.get("/", (req, res) => {
  res.send("✅ AI Interview Bot Backend is running...");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
