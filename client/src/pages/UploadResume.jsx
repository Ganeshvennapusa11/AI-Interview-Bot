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
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { jsPDF } from "jspdf";
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

  const handleDownloadReport = () => {
    if (!analysis) return;

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <MotionDiv
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 relative"
      >
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-gray-500 hover:text-blue-500 transition"
        >
          <ArrowLeft size={22} />
        </button>

        <h1 className="text-3xl font-bold text-gray-800 text-center mb-4">
          Upload Your Resume
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Role Selected:{" "}
          <span className="font-semibold text-blue-600">{selectedRole}</span>
        </p>

        {!analysis ? (
          <form onSubmit={handleUpload}>
            <label
              htmlFor="resume"
              className="border-2 border-dashed border-blue-400 rounded-xl py-10 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition"
            >
              <FileText size={40} className="text-blue-500 mb-3" />
              <p className="text-gray-700 mb-2">
                {file ? file.name : "Click or drag file to upload"}
              </p>
              <p className="text-sm text-gray-500">(PDF or DOCX format)</p>
              <input
                type="file"
                id="resume"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            <MotionButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={!file || loading}
              className={`mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white shadow-md transition ${
                file && !loading
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" /> Analyzing...
                </>
              ) : (
                <>
                  <Upload size={18} /> Upload & Analyze
                </>
              )}
            </MotionButton>

            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
          </form>
        ) : (
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold text-blue-600 mb-3">
              Resume Match: {analysis.matchScore}%
            </h2>

            {analysis.opinion && (
              <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h3 className="font-semibold text-blue-800 mb-1">AI Opinion:</h3>
                <p className="text-gray-700 italic">"{analysis.opinion}"</p>
              </div>
            )}

            {analysis.scoreBreakdown?.heuristic && (
              <div className="mb-4 rounded-lg border border-emerald-100 bg-emerald-50 p-4">
                <h3 className="mb-3 font-semibold text-emerald-800">
                  Screening Breakdown
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg bg-white/80 px-3 py-3">
                    <p className="text-xs uppercase tracking-wide text-emerald-600">
                      Keyword Coverage
                    </p>
                    <p className="mt-1 text-lg font-semibold text-slate-800">
                      {analysis.scoreBreakdown.heuristic.keywordCoverage}%
                    </p>
                  </div>
                  <div className="rounded-lg bg-white/80 px-3 py-3">
                    <p className="text-xs uppercase tracking-wide text-emerald-600">
                      Skill Signals
                    </p>
                    <p className="mt-1 text-lg font-semibold text-slate-800">
                      {analysis.scoreBreakdown.heuristic.skillDepth}
                    </p>
                  </div>
                  <div className="rounded-lg bg-white/80 px-3 py-3">
                    <p className="text-xs uppercase tracking-wide text-emerald-600">
                      Project Depth
                    </p>
                    <p className="mt-1 text-lg font-semibold text-slate-800">
                      {analysis.scoreBreakdown.heuristic.projectDepth}
                    </p>
                  </div>
                  <div className="rounded-lg bg-white/80 px-3 py-3">
                    <p className="text-xs uppercase tracking-wide text-emerald-600">
                      Internship Signals
                    </p>
                    <p className="mt-1 text-lg font-semibold text-slate-800">
                      {analysis.scoreBreakdown.heuristic.internshipDepth}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {analysis.strengths?.length > 0 && (
              <div className="mb-4">
                <h3 className="mb-2 font-semibold text-emerald-700">
                  Strengths Detected:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.strengths.map((strength, i) => (
                    <span
                      key={`${strength}-${i}`}
                      className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-sm text-emerald-700"
                    >
                      {strength}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {analysis.matchedKeywords?.length > 0 && (
              <div className="mb-4">
                <h3 className="mb-2 font-semibold text-cyan-700">
                  Matched Keywords:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.matchedKeywords.map((kw, i) => (
                    <span
                      key={`${kw}-${i}`}
                      className="rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-sm text-cyan-700"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {analysis.missingKeywords?.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-red-600 mb-2">
                  Missing Keywords:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingKeywords.map((kw, i) => (
                    <span
                      key={`${kw}-${i}`}
                      className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm border border-red-100"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <h3 className="font-semibold text-gray-800 mb-2">
              Suggestions for Improvement:
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              {analysis.suggestions?.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                Interview Style
              </label>
              <select
                value={questionStyle}
                onChange={(event) => setQuestionStyle(event.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="standard">Standard</option>
                <option value="resume_heavy">Resume Heavy</option>
                <option value="project_deep">Project Deep</option>
                <option value="fundamentals_deep">Fundamentals Deep</option>
                <option value="behavioral_sharp">Behavioral Sharp</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-3 mt-6 justify-between">
              <MotionButton
                whileHover={{ scale: 1.05 }}
                onClick={handleDownloadReport}
                className="flex items-center gap-2 px-6 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600"
              >
                <Download size={18} /> Download Report
              </MotionButton>

              <MotionButton
                whileHover={{ scale: 1.05 }}
                onClick={handleChangeResume}
                className="flex items-center gap-2 px-6 py-2 rounded-xl bg-yellow-500 text-white hover:bg-yellow-600"
              >
                <RotateCcw size={18} /> Change Resume
              </MotionButton>
            </div>

            <div className="flex justify-center mt-6 gap-3 flex-wrap">
              <MotionButton
                whileHover={{ scale: 1.05 }}
                onClick={() => startInterview("technical")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600"
              >
                <Brain size={18} /> Technical
              </MotionButton>
              <MotionButton
                whileHover={{ scale: 1.05 }}
                onClick={() => startInterview("managerial")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600"
              >
                <Briefcase size={18} /> Managerial
              </MotionButton>
              <MotionButton
                whileHover={{ scale: 1.05 }}
                onClick={() => startInterview("hr")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-500 text-white hover:bg-pink-600"
              >
                <Heart size={18} /> HR
              </MotionButton>
            </div>
          </MotionDiv>
        )}
      </MotionDiv>
    </div>
  );
}
