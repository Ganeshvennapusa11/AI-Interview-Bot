import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  evaluateInterviewAnswer,
  generateInterviewQuestions,
} from "../services/api";

const MotionDiv = motion.div;

const roundLabelMap = {
  technical_1_dsa: "technical",
  technical_2_fundamentals: "technical",
  technical_2_projects: "technical",
  technical: "technical",
  managerial: "managerial",
  hr: "hr",
  full_mock: "full mock",
};

const roundTypeMap = {
  technical: "technical_1_dsa",
  managerial: "managerial",
  hr: "hr",
  full_mock: "full_mock",
};

export default function InterviewSession() {
  const { state } = useLocation();
  const { roundType } = useParams();
  const navigate = useNavigate();

  const role =
    typeof state?.role === "string"
      ? state.role
      : state?.role?.title || "Unknown Role";
  const activeRoundType =
    state?.roundType ||
    roundTypeMap[state?.round] ||
    roundTypeMap[roundType] ||
    roundType ||
    "technical_1_dsa";
  const roundLabel =
    roundLabelMap[activeRoundType] || roundLabelMap[roundType] || "technical";

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    async function loadQuestions() {
      setIsLoading(true);

      try {
        const data = await generateInterviewQuestions({
          role,
          roundType: activeRoundType,
          questionStyle: state?.questionStyle || "standard",
          resumeText: state?.resumeText || "",
          parsedResume: state?.parsedResume || {},
        });

        setQuestions(data.questions || []);
      } catch (error) {
        console.error("Failed to load questions:", error);
        setQuestions([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadQuestions();
  }, [
    activeRoundType,
    role,
    state?.parsedResume,
    state?.questionStyle,
    state?.resumeText,
  ]);

  const submitAnswer = async () => {
    if (!answer.trim() || !questions[currentIndex]) return;

    setIsSubmitting(true);
    setShowFeedback(false);

    try {
      const data = await evaluateInterviewAnswer({
        question: questions[currentIndex]?.question,
        answer,
        roundType: activeRoundType,
      });

      setFeedback({
        feedback: data.feedback || "Evaluation completed.",
        evaluation: data.evaluation || null,
      });
      setShowFeedback(true);
    } catch (error) {
      console.error("Failed to submit answer:", error);
      setFeedback({
        feedback: "Failed to get feedback. Please try again.",
        evaluation: null,
      });
      setShowFeedback(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setAnswer("");
      setFeedback(null);
      setShowFeedback(false);
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    navigate("/dashboard");
  };

  const progress =
    questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  const getRoundColor = () => {
    switch (roundLabel.toLowerCase()) {
      case "technical":
        return "from-blue-500 to-purple-600";
      case "managerial":
        return "from-purple-500 to-pink-600";
      case "hr":
        return "from-pink-500 to-rose-600";
      default:
        return "from-indigo-500 to-purple-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-8 sm:px-6 lg:px-8">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-purple-500/20 blur-3xl" />
        <div
          className="absolute bottom-1/4 right-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-500/20 blur-3xl"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
        <MotionDiv
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => navigate("/dashboard")}
              className="group flex items-center gap-2 text-white/70 transition-colors hover:text-white"
            >
              <span className="text-xl transition-transform group-hover:-translate-x-1">
                &larr;
              </span>
              <span>Back to Dashboard</span>
            </button>

            <div className="flex items-center gap-3">
              <span
                className={`rounded-full bg-gradient-to-r px-4 py-2 text-sm font-semibold text-white shadow-lg ${getRoundColor()}`}
              >
                {roundLabel.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
            <h1 className="mb-2 text-3xl font-bold text-white sm:text-4xl">
              {role}
            </h1>
            <p className="text-lg text-white/70">
              {questions.length > 0
                ? `Question ${currentIndex + 1} of ${questions.length}`
                : "Loading interview..."}
            </p>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className={`h-full bg-gradient-to-r shadow-lg ${getRoundColor()}`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </MotionDiv>

        {isLoading ? (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-white/20 bg-white/10 p-12 text-center shadow-2xl backdrop-blur-xl"
          >
            <div className="mb-4 inline-block h-16 w-16 animate-spin rounded-full border-4 border-white/20 border-t-white" />
            <p className="text-lg text-white/70">
              Loading your interview questions...
            </p>
          </MotionDiv>
        ) : questions.length > 0 ? (
          <AnimatePresence mode="wait">
            <MotionDiv
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-xl font-bold text-white shadow-lg">
                      {currentIndex + 1}
                    </div>
                    <div className="flex gap-2">
                      <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-purple-300">
                        {questions[currentIndex]?.category}
                      </span>
                      <span
                        className={`rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wider ${
                          questions[currentIndex]?.difficulty?.toLowerCase() ===
                          "hard"
                            ? "text-rose-400"
                            : questions[currentIndex]?.difficulty?.toLowerCase() ===
                                "medium"
                              ? "text-amber-400"
                              : "text-emerald-400"
                        }`}
                      >
                        {questions[currentIndex]?.difficulty}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold leading-relaxed text-white">
                      {questions[currentIndex]?.question}
                    </h2>
                    {questions[currentIndex]?.hint && (
                      <p className="mt-4 text-sm italic text-white/40">
                        Hint: {questions[currentIndex].hint}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
                <label className="mb-4 block text-lg font-semibold text-white">
                  Your Answer
                </label>
                <textarea
                  value={answer}
                  onChange={(event) => setAnswer(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && event.ctrlKey) {
                      submitAnswer();
                    }
                  }}
                  placeholder="Type your answer here... (Ctrl+Enter to submit)"
                  className="h-48 w-full resize-none rounded-xl border border-white/20 bg-white/5 p-4 text-white placeholder-white/40 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={isSubmitting}
                />
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-sm text-white/50">
                    {answer.length} characters
                  </p>
                  <p className="text-sm text-white/50">
                    Tip: Press Ctrl+Enter to submit
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={submitAnswer}
                  disabled={!answer.trim() || isSubmitting}
                  className={`flex-1 rounded-xl px-8 py-4 font-semibold text-white shadow-lg transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 sm:flex-none ${
                    !answer.trim() || isSubmitting
                      ? "bg-gray-600"
                      : `bg-gradient-to-r hover:scale-105 hover:shadow-2xl ${getRoundColor()}`
                  }`}
                >
                  {isSubmitting ? "Evaluating..." : "Submit Answer"}
                </button>

                <button
                  onClick={nextQuestion}
                  className="flex-1 rounded-xl border border-white/20 bg-white/10 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-white/20 active:scale-95 sm:flex-none"
                >
                  {currentIndex < questions.length - 1
                    ? "Skip"
                    : "Finish Interview"}
                </button>
              </div>

              <AnimatePresence>
                {showFeedback && feedback?.feedback && (
                  <MotionDiv
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-2xl border border-emerald-400/30 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 p-8 shadow-2xl backdrop-blur-xl"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-2xl text-white shadow-lg">
                        *
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-3 text-xl font-bold text-emerald-100">
                          AI Feedback
                        </h3>
                        <div className="whitespace-pre-wrap leading-relaxed text-white/90">
                          {feedback.feedback}
                        </div>

                        {feedback.evaluation?.strengths?.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm font-semibold text-emerald-100">
                              Strengths
                            </p>
                            <ul className="mt-2 list-disc pl-5 text-white/85">
                              {feedback.evaluation.strengths.map(
                                (item, index) => (
                                  <li key={`${item}-${index}`}>{item}</li>
                                )
                              )}
                            </ul>
                          </div>
                        )}

                        {feedback.evaluation?.improvements?.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm font-semibold text-emerald-100">
                              Improvements
                            </p>
                            <ul className="mt-2 list-disc pl-5 text-white/85">
                              {feedback.evaluation.improvements.map(
                                (item, index) => (
                                  <li key={`${item}-${index}`}>{item}</li>
                                )
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </MotionDiv>
                )}
              </AnimatePresence>
            </MotionDiv>
          </AnimatePresence>
        ) : (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-white/20 bg-white/10 p-12 text-center shadow-2xl backdrop-blur-xl"
          >
            <p className="text-lg text-white/70">
              No questions available. Please try again.
            </p>
          </MotionDiv>
        )}
      </div>
    </div>
  );
}
