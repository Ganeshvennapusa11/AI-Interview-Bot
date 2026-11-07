import mongoose from "mongoose";

const REQUIRED_ENV_VARS = ["MONGO_URI", "JWT_SECRET", "GROQ_API_KEY"];

export const validateEnv = () => {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
};

export const connectDB = async () => {
  validateEnv();

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    throw new Error(
      `MongoDB connection failed: ${error.message}. ` +
        "Check MONGO_URI and that your IP is allowed in Atlas Network Access."
    );
  }
};

export const isDBReady = () => mongoose.connection.readyState === 1;
