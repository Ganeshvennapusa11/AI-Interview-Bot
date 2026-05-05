import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Edit3,
  FileText,
  Loader2,
  Mail,
  Sparkles,
  Target,
  TrendingUp,
  Upload,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchProfile, updateProfile } from "../services/api";

const MotionDiv = motion.div;
const MotionButton = motion.button;

const getInitials = (name = "User") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "U";

const formatDate = (value) => {
  if (!value) return "Unknown date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [about, setAbout] = useState("");
  const [avatar, setAvatar] = useState("");
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await fetchProfile();
        const user = data.user;
        const history = [...(user.analysisHistory || [])].sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );

        setProfile(user);
        setAbout(user.about || "");
        setAvatar(user.avatar || "");
        setAnalysisHistory(history);
      } catch (err) {
        console.error("Profile error:", err);
        setError(err.message || "Unable to load your profile.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const handleSave = async () => {
    try {
      const data = await updateProfile({
        name: profile.name,
        avatar,
        about,
      });

      const updatedUser = data.user;
      const history = [...(updatedUser.analysisHistory || [])].sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );

      setProfile(updatedUser);
      setAbout(updatedUser.about || "");
      setAvatar(updatedUser.avatar || "");
      setAnalysisHistory(history);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setEditing(false);
      setError("");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message || "Unable to update profile.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={34} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center text-rose-600">
        {error || "Profile unavailable."}
      </div>
    );
  }

  const completedAnalyses = analysisHistory.length;
  const averageScore =
    completedAnalyses > 0
      ? Math.round(
          analysisHistory.reduce(
            (total, item) => total + Number(item.matchScore || 0),
            0
          ) / completedAnalyses
        )
      : 0;
  const strongestRole =
    analysisHistory.length > 0
      ? [...analysisHistory].sort(
          (a, b) => Number(b.matchScore || 0) - Number(a.matchScore || 0)
        )[0]
      : null;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.14),_transparent_22%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.12),_transparent_24%),linear-gradient(180deg,_#f8fcfb_0%,_#eef8f6_100%)] p-6">
      <div className="mx-auto max-w-6xl">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]"
        >
          <section className="rounded-[2rem] border border-slate-200 bg-white/88 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur-xl">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-5">
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Avatar"
                    className="h-24 w-24 rounded-full border-4 border-emerald-400 object-cover shadow-sm"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-4xl font-bold text-white shadow-sm">
                    {getInitials(profile.name)}
                  </div>
                )}

                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    <Sparkles size={14} />
                    Candidate Profile
                  </div>
                  <h1 className="mt-3 flex items-center gap-2 text-4xl font-bold tracking-tight text-slate-950">
                    <User className="text-emerald-600" size={28} />
                    {profile.name || "User"}
                  </h1>
                  <p className="mt-2 flex items-center gap-2 text-lg text-slate-600">
                    <Mail className="text-emerald-500" size={18} />
                    {profile.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:min-w-[260px]">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                    Analyses
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-950">
                    {completedAnalyses}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                    Avg Score
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-950">
                    {averageScore}%
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                {error}
              </div>
            )}

            <div className="mt-8 rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="flex items-center gap-2 text-2xl font-semibold text-slate-900">
                  <Edit3 className="text-emerald-500" size={22} />
                  About Me
                </h2>

                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="rounded-xl bg-slate-100 px-4 py-2 font-medium text-emerald-700 transition hover:bg-emerald-50"
                  >
                    Edit
                  </button>
                ) : null}
              </div>

              {editing ? (
                <div className="mt-5 space-y-4">
                  <input
                    value={profile.name}
                    onChange={(event) =>
                      setProfile((prev) => ({
                        ...prev,
                        name: event.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:ring-2 focus:ring-emerald-300"
                    placeholder="Your name"
                  />
                  <input
                    value={avatar}
                    onChange={(event) => setAvatar(event.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:ring-2 focus:ring-emerald-300"
                    placeholder="Avatar URL"
                  />
                  <textarea
                    value={about}
                    onChange={(event) => setAbout(event.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:ring-2 focus:ring-emerald-300"
                    rows={5}
                    placeholder="Write a short introduction about your background, strengths, and target roles."
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleSave}
                      className="rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false);
                        setAbout(profile.about || "");
                        setAvatar(profile.avatar || "");
                      }}
                      className="rounded-2xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-5">
                  <p className="max-w-3xl whitespace-pre-line text-base leading-8 text-slate-700">
                    {about ||
                      "Add a short profile summary so your preparation feels more intentional and personalized."}
                  </p>
                </div>
              )}
            </div>
          </section>

          <section className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white/88 p-7 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur-xl">
              <h2 className="text-2xl font-semibold text-slate-900">
                Progress Snapshot
              </h2>

              <div className="mt-6 grid gap-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="text-emerald-500" size={20} />
                    <div>
                      <p className="font-semibold text-slate-900">
                        Average resume match
                      </p>
                      <p className="text-sm text-slate-500">
                        Based on your recorded resume analyses
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-4xl font-bold text-slate-950">
                    {averageScore}%
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Target className="text-cyan-600" size={20} />
                    <div>
                      <p className="font-semibold text-slate-900">
                        Strongest role fit
                      </p>
                      <p className="text-sm text-slate-500">
                        Highest resume match from your history
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-xl font-bold text-slate-950">
                    {strongestRole?.role || "No data yet"}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {strongestRole
                      ? `${strongestRole.matchScore}% match`
                      : "Upload a resume to unlock this insight"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white/88 p-7 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur-xl">
              <h2 className="text-2xl font-semibold text-slate-900">
                Quick Actions
              </h2>

              <div className="mt-5 space-y-3">
                <MotionButton
                  whileHover={{ x: 4 }}
                  onClick={() => navigate("/dashboard")}
                  className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-left transition hover:border-emerald-200 hover:bg-emerald-50/60"
                >
                  <div className="flex items-center gap-3">
                    <Upload className="text-emerald-600" size={20} />
                    <div>
                      <p className="font-semibold text-slate-900">
                        Start a new resume analysis
                      </p>
                      <p className="text-sm text-slate-500">
                        Jump back to the dashboard and pick a role
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="text-slate-400" size={18} />
                </MotionButton>

                <MotionButton
                  whileHover={{ x: 4 }}
                  onClick={() => navigate("/chat")}
                  className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-left transition hover:border-cyan-200 hover:bg-cyan-50/60"
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="text-cyan-600" size={20} />
                    <div>
                      <p className="font-semibold text-slate-900">
                        Ask the interview coach
                      </p>
                      <p className="text-sm text-slate-500">
                        Get role-specific prep help and feedback
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="text-slate-400" size={18} />
                </MotionButton>
              </div>
            </div>
          </section>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mt-6 rounded-[2rem] border border-slate-200 bg-white/88 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur-xl"
        >
          <div className="flex items-center justify-between gap-4">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-slate-900">
              <FileText className="text-emerald-500" size={22} />
              Resume Analysis History
            </h2>
            <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-500">
              {completedAnalyses} saved analyses
            </div>
          </div>

          {analysisHistory.length === 0 ? (
            <div className="mt-6 rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
              <p className="text-lg font-medium text-slate-700">
                No resume analyses yet
              </p>
              <p className="mt-2 text-slate-500">
                Upload a resume from the dashboard to start building your prep history.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-4">
              {analysisHistory.map((item, index) => (
                <div
                  key={`${item.role}-${item.createdAt || index}`}
                  className="rounded-[1.5rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#fbfdff_100%)] p-5 transition hover:shadow-sm"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-xl font-semibold text-slate-900">
                        {item.role}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Reviewed on {formatDate(item.createdAt)}
                      </p>
                    </div>

                    <div
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                        Number(item.matchScore || 0) >= 80
                          ? "bg-emerald-50 text-emerald-700"
                          : Number(item.matchScore || 0) >= 60
                            ? "bg-amber-50 text-amber-700"
                            : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      <CheckCircle2 size={16} />
                      Match Score {item.matchScore || 0}%
                    </div>
                  </div>

                  {item.opinion && (
                    <p className="mt-4 text-base leading-7 text-slate-700">
                      {item.opinion}
                    </p>
                  )}

                  {item.suggestions?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.suggestions.slice(0, 3).map((suggestion, idx) => (
                        <span
                          key={`${suggestion}-${idx}`}
                          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-600"
                        >
                          {suggestion}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </MotionDiv>
      </div>
    </div>
  );
}
