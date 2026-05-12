import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Loader2,
  Upload,
  Download,
  ArrowLeft,
  Brain,
  Briefcase,
  Heart,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  ClipboardList,
  Search,
  Rocket,
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { uploadResume } from "../services/api";

const MotionDiv = motion.div;
const MotionButton = motion.button;

const roundTypeMap = {
  technical: "technical_1_dsa",
  managerial: "managerial",
  hr: "hr",
};

export default function UploadResume() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { title: roleTitle } = useParams();
  const selectedRole =
    typeof state?.role === "string"
      ? state.role
      : state?.role?.title || roleTitle || "General Software Engineer";

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");
  const [questionStyle, setQuestionStyle] = useState("project_deep");

  const handleFileChange = (e) => {
    setFile(e.target.files[0] || null);
    setError("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("role", selectedRole);

      const data = await uploadResume(formData);
      setAnalysis(data.insights);
    } catch (err) {
      console.error("Error analyzing resume:", err);
      setError(err.message || "Failed to process resume.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    if (!analysis) return;

    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    const marginLeft = 20;
    const pageHeight = doc.internal.pageSize.getHeight();
    const maxWidth = 170;
    let y = 20;

    const ensureSpace = (neededHeight = 12) => {
      if (y + neededHeight > pageHeight - 20) {
        doc.addPage();
        y = 20;
      }
    };

    const addSectionTitle = (title) => {
      ensureSpace(12);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(25, 55, 109);
      doc.text(title, marginLeft, y);
      y += 8;
    };

    const addWrappedParagraph = (text, options = {}) => {
      const {
        font = "helvetica",
        style = "normal",
        size = 12,
        color = [55, 65, 81],
        gap = 7,
      } = options;

      doc.setFont(font, style);
      doc.setFontSize(size);
      doc.setTextColor(...color);
      const lines = doc.splitTextToSize(text, maxWidth);
      ensureSpace(lines.length * gap + 4);
      doc.text(lines, marginLeft, y);
      y += lines.length * gap + 3;
    };

    const addBulletList = (items = []) => {
      items.forEach((item, index) => {
        addWrappedParagraph(`${index + 1}. ${item}`);
      });
    };

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(33, 150, 243);
    doc.text("Interview Companion", marginLeft, y);
    y += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text(`Resume Analysis Report - Role: ${selectedRole}`, marginLeft, y);
    y += 10;

    doc.setDrawColor(33, 150, 243);
    doc.line(marginLeft, y, 190, y);
    y += 10;

    addSectionTitle("Screening Summary");
    addWrappedParagraph(`Match Score: ${analysis.matchScore}%`, {
      style: "bold",
      size: 15,
      color: [34, 197, 94],
    });

    if (analysis.opinion) {
      addWrappedParagraph(`AI Opinion: ${analysis.opinion}`, {
        color: [17, 24, 39],
      });
    }

    addSectionTitle("Detailed Breakdown");
    if (analysis.scoreBreakdown?.heuristic) {
      addWrappedParagraph(
        `Keyword Coverage: ${analysis.scoreBreakdown.heuristic.keywordCoverage}%`
      );
      addWrappedParagraph(
        `Skill Signals: ${analysis.scoreBreakdown.heuristic.skillDepth}`
      );
      addWrappedParagraph(
        `Project Depth: ${analysis.scoreBreakdown.heuristic.projectDepth}`
      );
      addWrappedParagraph(
        `Internship Signals: ${analysis.scoreBreakdown.heuristic.internshipDepth}`
      );
      addWrappedParagraph(
        `Education Signals: ${analysis.scoreBreakdown.heuristic.educationSignals}`
      );
    }

    if (analysis.strengths?.length > 0) {
      addSectionTitle("Strengths Detected");
      addBulletList(analysis.strengths);
    }

    if (analysis.matchedKeywords?.length > 0) {
      addSectionTitle("Matched Keywords");
      addWrappedParagraph(analysis.matchedKeywords.join(", "));
    }

    if (analysis.missingKeywords?.length > 0) {
      addSectionTitle("Missing or Weak-Signal Keywords");
      addWrappedParagraph(analysis.missingKeywords.join(", "));
    }

    if (analysis.suggestions?.length > 0) {
      addSectionTitle("Suggestions for Improvement");
      addBulletList(analysis.suggestions);
    }

    addSectionTitle("Next Best Actions");
    addBulletList([
      "Revise the resume summary to align more clearly with the selected role.",
      "Highlight stronger technical depth in projects with implementation details and measurable outcomes.",
      "Add or sharpen missing core skill keywords only where you genuinely have evidence.",
      "Use the interview rounds in Interview Companion to practice questions based on this screening result.",
    ]);

    doc.save(`Resume_Analysis_${selectedRole}.pdf`);
  };

  const startInterview = (round) => {
    const roundType = roundTypeMap[round] || round;
    const context = {
      role: roleTitle,
      roleLabel: selectedRole,
      roundType,
      difficulty: "medium",
      questionStyle,
      parsedResume: analysis?.parsedResume || {},
    };

    localStorage.setItem("interviewContext", JSON.stringify(context));

    navigate("/interview-session", {
      state: {
        role: selectedRole,
        round,
        roundType,
        questionStyle,
        resumeText: analysis?.resumeText || "",
        parsedResume: analysis?.parsedResume || {},
      },
    });
  };

  const handleChangeResume = () => {
    setFile(null);
    setAnalysis(null);
    setError("");
  };

  const heuristic = analysis?.scoreBreakdown?.heuristic || {};
  const matchScore = Number(analysis?.matchScore || 0);
  const scoreTone =
    matchScore >= 75
      ? "from-emerald-500 to-teal-500"
      : matchScore >= 55
        ? "from-amber-500 to-orange-500"
        : "from-rose-500 to-pink-500";

  return (
    <div className="min-h-screen bg-[#f6f8fc] p-4 text-slate-900 md:p-6">
      <MotionDiv
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-7xl"
      >
        <header className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm hover:text-slate-950"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Resume Intelligence
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                Role Readiness Scan
              </h1>
            </div>
          </div>

          <div className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 shadow-sm">
            {selectedRole}
          </div>
        </header>

        {!analysis ? (
          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <form
              onSubmit={handleUpload}
              className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm md:p-7"
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-950">
                    Upload workspace
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                    Drop your resume here and the scanner will map it against the
                    selected role, then turn the gaps into interview practice.
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                  PDF / DOCX / TXT
                </span>
              </div>

              <label
                htmlFor="resume"
                className={`group flex min-h-[22rem] cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed p-8 text-center transition ${
                  file
                    ? "border-emerald-300 bg-emerald-50"
                    : "border-slate-300 bg-slate-50 hover:border-slate-950 hover:bg-white"
                }`}
              >
                <div
                  className={`mb-5 flex h-20 w-20 items-center justify-center rounded-3xl shadow-sm ${
                    file
                      ? "bg-emerald-600 text-white"
                      : "bg-white text-slate-950 group-hover:bg-slate-950 group-hover:text-white"
                  }`}
                >
                  {file ? <CheckCircle2 size={34} /> : <FileText size={34} />}
                </div>
                <p className="text-xl font-bold text-slate-950">
                  {file ? file.name : "Click to choose or drag resume here"}
                </p>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Use a clean resume file. The analyzer looks for projects,
                  skills, impact signals, and missing role keywords.
                </p>
                <input
                  type="file"
                  id="resume"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <MotionButton
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={!file || loading}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-2xl px-6 py-4 font-bold text-white shadow-sm transition ${
                    file && !loading
                      ? "bg-slate-950 hover:bg-slate-800"
                      : "bg-slate-300 cursor-not-allowed"
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" /> Analyzing resume
                    </>
                  ) : (
                    <>
                      <Upload size={18} /> Analyze resume
                    </>
                  )}
                </MotionButton>
              </div>

              {error && (
                <div className="mt-4 flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                  <AlertTriangle size={17} />
                  {error}
                </div>
              )}
            </form>

            <aside className="grid gap-4">
              {[
                {
                  icon: Search,
                  title: "Keyword coverage",
                  copy: "Checks role-critical terms and weak signals.",
                },
                {
                  icon: TrendingUp,
                  title: "Project depth",
                  copy: "Looks for architecture, decisions, impact, and ownership.",
                },
                {
                  icon: ClipboardList,
                  title: "Interview handoff",
                  copy: "Turns resume gaps into targeted mock interview rounds.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                      <Icon size={22} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-950">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {item.copy}
                    </p>
                  </div>
                );
              })}
            </aside>
          </div>
        ) : (
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]"
          >
            <aside className="space-y-5">
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      Match score
                    </p>
                    <h2 className="mt-1 text-4xl font-bold text-slate-950">
                      {matchScore}%
                    </h2>
                  </div>
                  <div
                    className={`flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br ${scoreTone} p-1 shadow-sm`}
                  >
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-xl font-bold text-slate-950">
                      {matchScore}
                    </div>
                  </div>
                </div>
                {analysis.opinion && (
                  <p className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                    {analysis.opinion}
                  </p>
                )}
              </div>

              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
                <label className="mb-2 block text-sm font-bold text-slate-900">
                  Interview style
                </label>
                <select
                  value={questionStyle}
                  onChange={(event) => setQuestionStyle(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium outline-none focus:border-slate-950"
                >
                  <option value="standard">Standard</option>
                  <option value="resume_heavy">Resume Heavy</option>
                  <option value="project_deep">Project Deep</option>
                  <option value="fundamentals_deep">Fundamentals Deep</option>
                  <option value="behavioral_sharp">Behavioral Sharp</option>
                </select>
              </div>

              <div className="grid gap-3">
                <MotionButton
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDownloadReport}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 font-bold text-white hover:bg-slate-800"
                >
                  <Download size={18} /> Download report
                </MotionButton>
                <MotionButton
                  whileTap={{ scale: 0.98 }}
                  onClick={handleChangeResume}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 font-bold text-slate-700 hover:bg-slate-50"
                >
                  <RotateCcw size={18} /> Change resume
                </MotionButton>
              </div>
            </aside>

            <div className="space-y-5">
              <div className="grid gap-4 md:grid-cols-4">
                {[
                  ["Keyword Coverage", `${heuristic.keywordCoverage || 0}%`],
                  ["Skill Signals", heuristic.skillDepth || 0],
                  ["Project Depth", heuristic.projectDepth || 0],
                  ["Internships", heuristic.internshipDepth || 0],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-[1.35rem] border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                      {label}
                    </p>
                    <p className="mt-3 text-2xl font-bold text-slate-950">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                <section className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="mb-3 flex items-center gap-2 font-bold text-emerald-900">
                    <CheckCircle2 size={18} /> Strengths detected
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.strengths?.map((strength, i) => (
                      <span
                        key={`${strength}-${i}`}
                        className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-emerald-700"
                      >
                        {strength}
                      </span>
                    ))}
                  </div>
                </section>

                <section className="rounded-[1.5rem] border border-rose-200 bg-rose-50 p-5">
                  <h3 className="mb-3 flex items-center gap-2 font-bold text-rose-900">
                    <AlertTriangle size={18} /> Missing keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingKeywords?.map((kw, i) => (
                      <span
                        key={`${kw}-${i}`}
                        className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-rose-700"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </section>
              </div>

              <section className="rounded-[1.5rem] border border-cyan-200 bg-cyan-50 p-5">
                <h3 className="mb-3 font-bold text-cyan-900">
                  Matched keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.matchedKeywords?.map((kw, i) => (
                    <span
                      key={`${kw}-${i}`}
                      className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-cyan-700"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </section>

              <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-3 flex items-center gap-2 font-bold text-slate-950">
                  <Rocket size={18} /> Suggested improvements
                </h3>
                <div className="grid gap-3 md:grid-cols-2">
                  {analysis.suggestions?.map((s, i) => (
                    <div
                      key={`${s}-${i}`}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700"
                    >
                      {s}
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-4 font-bold text-slate-950">
                  Start targeted practice
                </h3>
                <div className="grid gap-3 md:grid-cols-3">
                  <MotionButton
                    whileTap={{ scale: 0.98 }}
                    onClick={() => startInterview("technical")}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-4 font-bold text-white hover:bg-blue-700"
                  >
                    <Brain size={18} /> Technical
                  </MotionButton>
                  <MotionButton
                    whileTap={{ scale: 0.98 }}
                    onClick={() => startInterview("managerial")}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-4 font-bold text-white hover:bg-indigo-700"
                  >
                    <Briefcase size={18} /> Managerial
                  </MotionButton>
                  <MotionButton
                    whileTap={{ scale: 0.98 }}
                    onClick={() => startInterview("hr")}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-pink-600 px-4 py-4 font-bold text-white hover:bg-pink-700"
                  >
                    <Heart size={18} /> HR
                  </MotionButton>
                </div>
              </section>
            </div>
          </MotionDiv>
        )}
      </MotionDiv>
    </div>
  );
}
