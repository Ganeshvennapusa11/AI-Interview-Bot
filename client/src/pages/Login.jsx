import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import ParticlesBackground from "../components/ParticlesBackground.jsx";
import { loginUser, wakeBackend } from "../services/api";

const MotionDiv = motion.div;


export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWakingServer, setIsWakingServer] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      navigate("/dashboard");
    }
  }, [navigate]);

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

  const validateForm = () => {
    const nextErrors = {};

    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!password.trim()) {
      nextErrors.password = "Password is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const data = await loginUser({ email, password });
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Unable to log in.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.16),_transparent_28%),linear-gradient(180deg,_#f8fcfb_0%,_#eef8f6_52%,_#f8fcfb_100%)]">
      <ParticlesBackground count={55} linkOpacity={0.18} />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <MotionDiv
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/80 shadow-[0_25px_80px_rgba(148,163,184,0.18)] backdrop-blur-xl md:grid-cols-2"
        >
          <div className="p-6 sm:p-8 md:p-10 border-r border-slate-200/80">
            <div className="mx-auto w-full max-w-md">
              <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Log in to continue your interview preparation journey.
              </p>
              {isWakingServer && (
                <p className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  Warming up the server. First request can take a little longer.
                </p>
              )}

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors((prev) => ({ ...prev, email: "" }));
                      }}
                      className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-rose-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrors((prev) => ({ ...prev, password: "" }));
                      }}
                      className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-11 pr-12 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-rose-500">{errors.password}</p>
                  )}
                  <div className="mt-3 text-right">
                    <Link
                      to="/forgot-password"
                      className="text-sm font-semibold text-emerald-700 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                {error && (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Logging In...
                    </>
                  ) : (
                    "Log In"
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="p-6 sm:p-8 md:p-10">
            <div className="mx-auto w-full max-w-md flex flex-col justify-center h-full">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm text-emerald-700 shadow-sm w-fit mb-6">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Interview Companion
              </div>

              <h3 className="text-3xl font-bold text-slate-900">
                Pick up where you left off
              </h3>
              <p className="mt-3 text-base leading-7 text-slate-600">
                Your resume analysis, interview rounds, and preparation roadmap
                are waiting in your dashboard.
              </p>

              <ul className="mt-8 space-y-4 text-sm text-slate-600">
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  Role-aware mock rounds built from your own resume
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  Structured feedback on clarity, depth, and evidence
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  A preparation roadmap that targets your weak areas
                </li>
              </ul>

              <p className="mt-6 text-center text-sm text-slate-500">
                Don&apos;t have an account?{" "}
                <Link
                  to="/signup"
                  className="font-semibold text-emerald-700 hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </MotionDiv>
      </div>
    </div>
  );
}
