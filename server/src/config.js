// // import mongoose from "mongoose";

// // export const connectDB = async () => {
// //   try {
// //     if (!process.env.MONGO_URI) {
// //       throw new Error("MONGO_URI not found in .env file");
// //     }

// //     await mongoose.connect(process.env.MONGO_URI);
// //     console.log("✅ MongoDB Connected Successfully");
// //   } catch (error) {
// //     console.error("❌ MongoDB connection failed:", error.message);
// //     process.exit(1);
// //   }
// // };


// import mongoose from "mongoose";

// const REQUIRED_ENV_VARS = ["MONGO_URI", "JWT_SECRET", "GROQ_API_KEY"];

// export const validateEnv = () => {
//   const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

//   if (missing.length > 0) {
//     throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
//   }
// };

// export const connectDB = async () => {
//   validateEnv();

//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("MongoDB connected successfully");
//   } catch (error) {
//     console.error("MongoDB connection failed:", error.message);
//     process.exit(1);
//   }
// };


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
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};
