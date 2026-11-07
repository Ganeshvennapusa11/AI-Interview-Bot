import React, { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  X,
  Loader2,
  WandSparkles,
  Check,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import ParticlesBackground from "../components/ParticlesBackground.jsx";
import { registerUser, wakeBackend } from "../services/api";

const MotionDiv = motion.div;
const MotionButton = motion.button;

// Crop to a square and downscale, so the avatar is a few KB rather than a few MB.
const readAvatarDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("Could not read that image."));
    reader.onload = () => {
      const image = new Image();

      image.onerror = () => reject(new Error("Could not read that image."));
      image.onload = () => {
        const size = 256;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;

        const context = canvas.getContext("2d");
        const side = Math.min(image.width, image.height);

        context.drawImage(
          image,
          (image.width - side) / 2,
          (image.height - side) / 2,
          side,
          side,
          0,
          0,
          size,
          size
        );

        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };

      image.src = reader.result;
    };

    reader.readAsDataURL(file);
  });

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [profileFile, setProfileFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWakingServer, setIsWakingServer] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    setIsWakingServer(true);
    wakeBackend()
      .catch(() => {})
      .finally(() => {
        if (isMounted) {
          setIsWakingServer(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!profileFile) {
      setProfilePreview(null);
      return;
    }

    const url = URL.createObjectURL(profileFile);
    setProfilePreview(url);

    return () => URL.revokeObjectURL(url);
  }, [profileFile]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, profile: "Please upload an image file." }));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        profile: "Image must be smaller than 2MB.",
      }));
      return;
    }

    setErrors((prev) => ({ ...prev, profile: "" }));
    setProfileFile(file);
  };

  const removeProfile = () => {
    setProfileFile(null);
    setProfilePreview(null);
  };

  const generateStrongPassword = () => {
    const chars =
      "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";
    let generated = "";

    for (let i = 0; i < 14; i += 1) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    setPassword(generated);
    setConfirm(generated);
    setErrors((prev) => ({ ...prev, password: "", confirm: "" }));
  };

  const passwordChecks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };

  const validate = () => {
    const nextErrors = {};

    if (!username.trim()) nextErrors.username = "Username is required.";
    if (!email.trim()) nextErrors.email = "Email is required.";
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      nextErrors.email = "Email is invalid.";
    }

    if (!password) {
      nextErrors.password = "Password is required.";
    } else if (
      !passwordChecks.length ||
      !passwordChecks.upper ||
      !passwordChecks.lower ||
      !passwordChecks.number ||
      !passwordChecks.symbol
    ) {
      nextErrors.password =
        "Use at least 8 characters with uppercase, lowercase, number, and symbol.";
    }

    if (!confirm) {
      nextErrors.confirm = "Confirm your password.";
    } else if (password !== confirm) {
      nextErrors.confirm = "Passwords do not match.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitError("");
    setIsSubmitting(true);

    try {
      let avatar = "";

      if (profileFile) {
        try {
          avatar = await readAvatarDataUrl(profileFile);
        } catch {
          avatar = "";
        }
      }

      const data = await registerUser({
        name: username.trim(),
        email: email.trim(),
        password,
        ...(avatar ? { avatar } : {}),
      });

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      setSubmitError(err.message || "Unable to create account.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-10 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.16),_transparent_28%),linear-gradient(180deg,_#f8fcfb_0%,_#eef8f6_52%,_#f8fcfb_100%)]">
      <ParticlesBackground className="absolute inset-0 z-0" count={70} linkOpacity={0.22} />

      <header className="absolute top-0 left-0 w-full flex justify-between items-center px-6 py-4 z-10">
        <h1 className="text-slate-900 font-bold text-2xl tracking-tight">
          Interview Companion
        </h1>
        <button
          onClick={() => navigate("/")}
          className="text-slate-500 hover:text-slate-900 transition"
        >
          <X size={28} />
        </button>
      </header>

      <div className="relative z-10 w-full max-w-6xl bg-white/80 shadow-[0_25px_80px_rgba(148,163,184,0.18)] rounded-[2rem] border border-slate-200/80 mt-16 grid grid-cols-1 md:grid-cols-2 overflow-hidden backdrop-blur-xl">
        <MotionDiv
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="p-8 md:p-10"
        >
          <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
            Create Account
          </h2>
          <p className="text-slate-600 mb-6">
            Start your journey with Interview Companion
          </p>
          {isWakingServer && (
            <p className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              Warming up the server. First request can take a little longer.
            </p>
          )}

          <form className="grid grid-cols-1 gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col items-center mb-2">
              {profilePreview ? (
                <MotionDiv
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="relative"
                >
                  <img
                    src={profilePreview}
                    alt="Profile Preview"
                    className="w-24 h-24 rounded-full object-cover border-4 border-emerald-400 shadow-md"
                  />
                  <button
                    type="button"
                    onClick={removeProfile}
                    className="absolute -top-2 -right-2 bg-rose-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center hover:bg-rose-700"
                  >
                    x
                  </button>
                </MotionDiv>
              ) : (
                <label className="w-24 h-24 rounded-full flex items-center justify-center bg-white cursor-pointer border-2 border-dashed border-slate-300 hover:border-emerald-400 transition shadow-sm">
                  <span className="text-slate-600 text-sm text-center">
                    Upload
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
              {errors.profile && (
                <p className="text-sm text-rose-500 mt-2">{errors.profile}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Username
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                autoComplete="username"
                placeholder="johndoe"
                className="w-full px-5 py-3 rounded-2xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 outline-none"
              />
              {errors.username && (
                <p className="text-sm text-rose-500 mt-1">{errors.username}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="john@example.com"
                className="w-full px-5 py-3 rounded-2xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 outline-none"
              />
              {errors.email && (
                <p className="text-sm text-rose-500 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={generateStrongPassword}
                  className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700 hover:text-emerald-800"
                >
                  <WandSparkles size={14} />
                  Suggest strong password
                </button>
              </div>

              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Create a strong password"
                  className="w-full px-5 py-3 rounded-2xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 outline-none pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                {[
                  { label: "8+ characters", ok: passwordChecks.length },
                  { label: "Uppercase letter", ok: passwordChecks.upper },
                  { label: "Lowercase letter", ok: passwordChecks.lower },
                  {
                    label: "Number and symbol",
                    ok: passwordChecks.number && passwordChecks.symbol,
                  },
                ].map((rule) => (
                  <div
                    key={rule.label}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2 ${
                      rule.ok
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <Check size={14} />
                    <span>{rule.label}</span>
                  </div>
                ))}
              </div>

              {errors.password && (
                <p className="text-sm text-rose-500 mt-2">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Re-enter password"
                  className="w-full px-5 py-3 rounded-2xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 outline-none pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600"
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirm && (
                <p className="text-sm text-rose-500 mt-1">{errors.confirm}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-slate-900 text-white rounded-2xl font-semibold text-lg shadow-sm hover:bg-slate-800 transition disabled:opacity-70"
            >
              {isSubmitting ? "Creating Account..." : "Sign Up"}
            </button>

            {submitError && (
              <p className="text-sm text-rose-500">{submitError}</p>
            )}
          </form>

          <p className="text-center text-sm text-slate-600 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-emerald-700 font-semibold hover:underline"
            >
              Log In
            </Link>
          </p>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-center justify-center gap-4 border-l border-slate-200/80 bg-white/40 p-8 md:p-10"
        >
          <div className="max-w-sm text-center">
            <h3 className="text-2xl font-bold text-slate-900">
              Continue with social sign in
            </h3>
            <p className="mt-3 text-slate-500 leading-7">
              Use your preferred provider to continue quickly.
            </p>
          </div>

          {/* <div className="w-full max-w-xs space-y-3 mt-6">
            {[
              {
                name: "Google",
                icon: "https://www.svgrepo.com/show/355037/google.svg",
              },
              {
                name: "Facebook",
                icon: "https://www.svgrepo.com/show/475647/facebook-color.svg",
              },
              {
                name: "Apple",
                icon: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
              },
            ].map((provider, index) => (
              <MotionButton
                key={provider.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                type="button"
                onClick={() => handleSocialLogin(provider.name)}
                disabled={socialLoading !== ""}
                className="w-full flex items-center justify-center gap-3 border border-slate-300 rounded-2xl py-3 bg-white hover:bg-slate-50 transition disabled:opacity-70"
              >
                {socialLoading === provider.name ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <img
                    src={provider.icon}
                    alt={provider.name}
                    className="w-5 h-5"
                  />
                )}
                <span className="text-slate-800 font-medium">
                  Continue with {provider.name}
                </span>
              </MotionButton>
            ))}
          </div> */}
                    {/* <div className="w-full max-w-xs space-y-3 mt-6">
              <MotionButton
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                type="button"
                onClick={() => handleSocialLogin()}
                disabled={socialLoading !== ""}
                className="w-full flex items-center justify-center gap-3 border border-slate-300 rounded-2xl py-3 bg-white hover:bg-slate-50 transition disabled:opacity-70"
              >
                {socialLoading === "Google" ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <img
                    src="https://www.svgrepo.com/show/355037/google.svg"
                    alt="Google"
                    className="w-5 h-5"
                  />
                )}
                <span className="text-slate-800 font-medium">
                  Continue with Google
                </span>
              </MotionButton>
          </div> */}

        </MotionDiv>
      </div>
    </div>
  );
}
