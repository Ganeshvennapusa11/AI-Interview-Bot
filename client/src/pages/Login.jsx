import React, { useState, useEffect } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import {
  signInWithGoogle,
  signInWithFacebook,
  signInWithApple,
} from "../firebase";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // ✅ Auto-redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = "Email is required.";
    if (email && !/^\S+@\S+\.\S+$/.test(email)) e.email = "Invalid email format.";
    if (!password) e.password = "Password is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      // ✅ Option 1: Simulate successful login
      // (Replace with real API call when ready)
      localStorage.setItem("authToken", "sample_token_123");

      // ✅ Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err.message);
      setErrors({ general: "Login failed. Please try again." });
    }
  };

  const handleSocialLogin = async (type) => {
    try {
      if (type === "Google") await signInWithGoogle();
      if (type === "Facebook") await signInWithFacebook();
      if (type === "Apple") await signInWithApple();

      // ✅ Store token for ProtectedRoute
      localStorage.setItem("authToken", `${type}_login_token`);
      navigate("/dashboard");
    } catch (err) {
      console.error("Social login error:", err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 bg-gradient-to-br from-teal-50 via-white to-cyan-50">
      {/* Background Particles */}
      <Particles
        id="tsparticles"
        className="absolute inset-0 z-0"
        init={async (engine) => await loadFull(engine)}
        options={{
          background: { color: "transparent" },
          fpsLimit: 60,
          particles: {
            color: { value: "#14B8A6" },
            links: { color: "#14B8A6", distance: 120, enable: true, opacity: 0.4 },
            move: { enable: true, speed: 1 },
            number: { value: 60, density: { enable: true, area: 800 } },
            opacity: { value: 0.5 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 3 } },
          },
        }}
      />

      {/* Header */}
      <header className="absolute top-0 left-0 w-full flex justify-between items-center px-6 py-4 z-10">
        <h1 className="text-teal-700 font-bold text-2xl">Interview Companion</h1>
        <button
          onClick={() => navigate("/")}
          className="text-teal-700 hover:text-teal-900 transition"
        >
          <X size={28} />
        </button>
      </header>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-4xl bg-white shadow-2xl rounded-2xl p-10 border border-blue-100 mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Form */}
        <motion.div initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <h2 className="text-3xl font-bold text-teal-700 mb-4 text-center md:text-left">
            Welcome Back
          </h2>

          <form className="grid grid-cols-1 gap-5" onSubmit={handleSubmit}>
            <div>
              <label className="text-gray-700 text-sm font-semibold">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-black rounded-xl bg-white text-black focus:ring-2 focus:ring-teal-400 outline-none"
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div>
              <label className="text-gray-700 text-sm font-semibold">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-black rounded-xl bg-white text-black focus:ring-2 focus:ring-teal-400 outline-none pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            {errors.general && (
              <p className="text-center text-red-500 text-sm">{errors.general}</p>
            )}

            <button
              type="submit"
              className="py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-semibold shadow-md hover:from-teal-400 hover:to-cyan-400 transition"
            >
              Log In
            </button>
          </form>

          <p className="text-center text-sm text-gray-700 mt-4">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-teal-600 font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </motion.div>

        {/* Right: Social Login */}
        <motion.div
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex flex-col items-center justify-center gap-4 border-l border-gray-200 pl-6"
        >
          <h3 className="text-gray-800 font-semibold mb-2">Or continue with</h3>

          {["Google", "Facebook", "Apple"].map((provider) => (
            <button
              key={provider}
              onClick={() => handleSocialLogin(provider)}
              className="w-full flex items-center justify-center gap-3 border-2 border-black rounded-xl py-3 bg-white hover:bg-gray-100 transition transform hover:-translate-y-0.5 shadow-sm"
            >
              <img
                src={
                  provider === "Google"
                    ? "https://www.svgrepo.com/show/355037/google.svg"
                    : provider === "Facebook"
                    ? "https://www.svgrepo.com/show/475647/facebook-color.svg"
                    : "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                }
                alt={provider}
                className="w-5 h-5"
              />
              <span className="font-medium text-gray-900">{provider}</span>
            </button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
