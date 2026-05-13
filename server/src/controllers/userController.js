import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { verifyFirebaseToken } from "../services/firebaseAdmin.js";
import { sendAccountCreatedEmail } from "../services/emailService.js";

const isValidEmail = (email = "") => /^\S+@\S+\.\S+$/.test(email);
const isStrongPassword = (password = "") =>
  password.length >= 8 &&
  /[A-Z]/.test(password) &&
  /[a-z]/.test(password) &&
  /[0-9]/.test(password) &&
  /[^A-Za-z0-9]/.test(password);

const serializeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  about: user.about || "",
  avatar: user.avatar || "",
  analysisHistory: user.analysisHistory || [],
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const registerUser = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password || "";

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const newUser = await User.create({
      name,
      email,
      password,
    });

    sendAccountCreatedEmail({ to: email, name }).catch((error) => {
      console.error("Account email failed:", error.message);
    });

    return res.status(201).json({
      message: "User registered successfully",
      token: generateToken(newUser._id),
      user: serializeUser(newUser),
    });
  } catch (error) {
    console.error("Register error:", error);

    if (error.code === 11000) {
      return res.status(409).json({ message: "User already exists" });
    }

    return res.status(500).json({ message: "Server error during registration" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password || "";

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.json({
      message: "Login successful",
      token: generateToken(user._id),
      user: serializeUser(user),
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error during login" });
  }
};

export const firebaseLogin = async (req, res) => {
  try {
    const idToken = req.body.idToken;

    if (!idToken) {
      return res.status(400).json({ message: "Firebase ID token is required" });
    }

    const decoded = await verifyFirebaseToken(idToken);
    const email = decoded.email?.toLowerCase();

    if (!email) {
      return res.status(400).json({ message: "Firebase account email is missing" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: decoded.name || email.split("@")[0],
        email,
        password: `FirebaseAuth!${decoded.uid}`,
        avatar: decoded.picture || "",
      });

      sendAccountCreatedEmail({ to: email, name: user.name }).catch((error) => {
        console.error("Account email failed:", error.message);
      });
    } else if (!user.avatar && decoded.picture) {
      user.avatar = decoded.picture;
      await user.save();
    }

    return res.json({
      message: "Firebase login successful",
      token: generateToken(user._id),
      user: serializeUser(user),
    });
  } catch (error) {
    console.error("Firebase login error:", error);
    return res.status(401).json({ message: "Firebase authentication failed" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      message: "Profile fetched successfully",
      user: serializeUser(user),
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return res.status(500).json({ message: "Server error while fetching profile" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const about = typeof req.body.about === "string" ? req.body.about.trim() : user.about;
    const avatar = typeof req.body.avatar === "string" ? req.body.avatar.trim() : user.avatar;

    if (name) {
      user.name = name;
    }

    user.about = about;
    user.avatar = avatar;

    await user.save();

    return res.json({
      message: "Profile updated successfully",
      user: serializeUser(user),
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({ message: "Server error while updating profile" });
  }
};
