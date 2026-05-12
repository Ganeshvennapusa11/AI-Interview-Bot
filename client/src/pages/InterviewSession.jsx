import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  Building2,
  Camera,
  CameraOff,
  Clock3,
  Download,
  FileText,
  Gauge,
  Loader2,
  Mic,
  MicOff,
  Pause,
  Play,
  Radio,
  RefreshCcw,
  RotateCcw,
  Sparkles,
  Square,
  Target,
  TimerReset,
  Video,
  Volume2,
  VolumeX,
  Wifi,
  Zap,
} from "lucide-react";
import {
  evaluateInterviewAnswer,
  generateInterviewQuestions,
} from "../services/api";

const MotionDiv = motion.div;

const roundLabelMap = {
  technical_1_dsa: "Technical",
  technical_2_fundamentals: "Technical",
  technical_2_projects: "Technical",
  technical: "Technical",
  managerial: "Managerial",
  hr: "HR",
  full_mock: "Full Mock",
};

const roundTypeMap = {
  technical: "technical_1_dsa",
  managerial: "managerial",
  hr: "hr",
  full_mock: "full_mock",
};

const interviewModes = [
  { id: "text", label: "Text-only", icon: FileText },
  { id: "voice", label: "Voice-only", icon: Mic },
  { id: "video", label: "Video mock", icon: Video },
  { id: "rapid", label: "Rapid-fire", icon: Zap },
];

const companies = ["General", "Google", "Amazon", "TCS", "Infosys"];
const fillerWords = ["um", "uh", "like", "actually", "basically", "literally", "you know"];

const SpeechRecognitionAPI =
  typeof window !== "undefined"
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const remainingSeconds = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
};

const clampScore = (value) => Math.max(0, Math.min(100, Math.round(value)));

const scoreTone = (score) => {
  if (score >= 75) return "text-emerald-700 bg-emerald-50";
  if (score >= 50) return "text-amber-700 bg-amber-50";
  return "text-rose-700 bg-rose-50";
};

const countFillerWords = (text = "") => {
  const normalized = text.toLowerCase();
  return fillerWords.reduce((count, word) => {
    const matches = normalized.match(new RegExp(`\\b${word}\\b`, "g"));
    return count + (matches?.length || 0);
  }, 0);
};

const getStarChecklist = (answer = "") => ({
  situation: /situation|context|background|when|during|in my|at/i.test(answer),
  task: /task|goal|responsible|needed|objective|challenge/i.test(answer),
  action: /action|i built|i implemented|i designed|i led|i fixed|i optimized|we used/i.test(answer),
  result: /result|impact|improved|reduced|increased|saved|users|latency|score|percent|%/i.test(answer),
});

const getProjectChecklist = (answer = "") => ({
  architecture: /architecture|design|flow|system|frontend|backend|database|api/i.test(answer),
  tradeoffs: /tradeoff|chose|because|alternative|constraint|decision/i.test(answer),
  scalability: /scale|performance|latency|cache|index|optimize|load|throughput/i.test(answer),
  evidence: /metric|users|ms|percent|%|deployed|production|tested|measured/i.test(answer),
});

export default function InterviewSession() {
  const { state } = useLocation();
  const { roundType } = useParams();
  const navigate = useNavigate();
  const recognitionRef = useRef(null);
  const answerAtListenStartRef = useRef("");
  const lastSpeechAtRef = useRef(Date.now());
  const videoRef = useRef(null);
  const cameraStreamRef = useRef(null);
  const recorderRef = useRef(null);
  const recordingStreamRef = useRef(null);
  const recordingChunksRef = useRef([]);

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
    roundLabelMap[activeRoundType] || roundLabelMap[roundType] || "Technical";

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [sessionAnswers, setSessionAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdapting, setIsAdapting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showTranscript, setShowTranscript] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState("");
  const [recordingKind, setRecordingKind] = useState("audio");
  const [mediaError, setMediaError] = useState("");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [mode, setMode] = useState("text");
  const [companyType, setCompanyType] = useState(state?.companyType || "General");
  const [adaptiveEnabled, setAdaptiveEnabled] = useState(true);
  const [longPauseCount, setLongPauseCount] = useState(0);

  const currentQuestion = questions[currentIndex];
  const progress =
    questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;
  const answerWords = useMemo(
    () => answer.trim().split(/\s+/).filter(Boolean).length,
    [answer]
  );
  const fillerCount = useMemo(() => countFillerWords(answer), [answer]);
  const candidateInitials = useMemo(
    () =>
      role
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") || "AI",
    [role]
  );

  const rubric = useMemo(() => {
    const backendScore = feedback?.evaluation?.score || {};
    const correctnessValue = backendScore.correctness ?? backendScore.relevance;
    const clarity = clampScore(
      backendScore.clarity !== undefined
        ? Number(backendScore.clarity) * 10
        : 45 + Math.min(answerWords, 100) * 0.25 - fillerCount * 4 - longPauseCount * 3
    );
    const depth = clampScore(
      backendScore.depth !== undefined
        ? Number(backendScore.depth) * 10
        : Math.min(90, answerWords * 0.9)
    );
    const correctness = clampScore(
      correctnessValue !== undefined
        ? Number(correctnessValue) * 10
        : feedback
          ? Number(feedback.evaluation?.score?.overall || 5) * 10
          : 50
    );
    const confidence = clampScore(82 - fillerCount * 6 - longPauseCount * 8);
    const conciseness = clampScore(
      answerWords === 0 ? 0 : answerWords < 45 ? 48 : answerWords <= 160 ? 88 : 70
    );

    return { clarity, depth, correctness, confidence, conciseness };
  }, [answerWords, feedback, fillerCount, longPauseCount]);

  const averageScore = useMemo(() => {
    const values = Object.values(rubric);
    return clampScore(values.reduce((sum, score) => sum + score, 0) / values.length);
  }, [rubric]);

  const behavioralRound =
    activeRoundType.includes("hr") ||
    activeRoundType.includes("managerial") ||
    /tell me|conflict|lead|team|challenge|failure/i.test(currentQuestion?.question || "");
  const projectRound =
    activeRoundType.includes("project") ||
    state?.questionStyle === "project_deep" ||
    /project|implementation|architecture|scalability|performance/i.test(
      currentQuestion?.question || ""
    );
  const starChecklist = useMemo(() => getStarChecklist(answer), [answer]);
  const projectChecklist = useMemo(() => getProjectChecklist(answer), [answer]);
  const detectorWarnings = useMemo(() => {
    const warnings = [];
    if (behavioralRound) {
      Object.entries(starChecklist).forEach(([key, ok]) => {
        if (!ok) warnings.push(`STAR missing: ${key}`);
      });
    }
    if (projectRound) {
      Object.entries(projectChecklist).forEach(([key, ok]) => {
        if (!ok) warnings.push(`Project depth missing: ${key}`);
      });
    }
    if (fillerCount >= 4) warnings.push(`${fillerCount} filler words detected`);
    if (longPauseCount > 0) warnings.push(`${longPauseCount} long pause${longPauseCount > 1 ? "s" : ""}`);
    return warnings.slice(0, 6);
  }, [
    behavioralRound,
    fillerCount,
    longPauseCount,
    projectChecklist,
    projectRound,
    starChecklist,
  ]);

  const answerSignals = [
    {
      label: "Structure",
      value: rubric.clarity >= 70 ? "Clear" : "Needs setup",
      ready: rubric.clarity >= 70,
    },
    {
      label: "Depth",
      value: answerWords >= 80 ? "Detailed" : `${answerWords}/80 words`,
      ready: answerWords >= 80,
    },
    {
      label: "Evidence",
      value: projectChecklist.evidence || starChecklist.result ? "Specific" : "Add proof",
      ready: projectChecklist.evidence || starChecklist.result,
    },
  ];

  useEffect(() => {
    async function loadQuestions() {
      setIsLoading(true);

      try {
        const data = await generateInterviewQuestions({
          role,
          roundType: activeRoundType,
          questionStyle: state?.questionStyle || "standard",
          companyType,
          questionCount: mode === "rapid" ? 8 : 5,
          difficulty: "easy",
          resumeText: state?.resumeText || "",
          parsedResume: state?.parsedResume || {},
        });

        setQuestions(data.questions || []);
        setCurrentIndex(0);
        setSessionAnswers([]);
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
    companyType,
    mode,
    role,
    state?.parsedResume,
    state?.questionStyle,
    state?.resumeText,
  ]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setElapsedSeconds((seconds) => seconds + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (mode === "video" && !cameraEnabled) {
      toggleCamera();
    }
    if (mode !== "video" && cameraEnabled) {
      toggleCamera();
    }
    if (mode === "voice" || mode === "rapid") {
      setShowTranscript(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  useEffect(() => {
    if (!isListening) return undefined;

    const pauseTimer = window.setInterval(() => {
      if (Date.now() - lastSpeechAtRef.current > 4500) {
        setLongPauseCount((count) => count + 1);
        lastSpeechAtRef.current = Date.now();
      }
    }, 1200);

    return () => window.clearInterval(pauseTimer);
  }, [isListening]);

  useEffect(() => {
    if (!videoRef.current || !cameraStreamRef.current) return;

    videoRef.current.srcObject = cameraStreamRef.current;
    videoRef.current.play().catch(() => {
      setMediaError("Camera started, but the preview could not autoplay.");
    });
  }, [cameraEnabled]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      window.speechSynthesis?.cancel();
      cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
      recordingStreamRef.current?.getTracks().forEach((track) => track.stop());
      if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    };
  }, [recordedUrl]);

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const startListening = () => {
    setMediaError("");

    if (!SpeechRecognitionAPI) {
      setMediaError("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    answerAtListenStartRef.current = answer.trim();
    lastSpeechAtRef.current = Date.now();

    recognition.onresult = (event) => {
      let transcript = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        transcript += event.results[index][0].transcript;
      }

      if (transcript.trim()) {
        const now = Date.now();
        if (now - lastSpeechAtRef.current > 4500) {
          setLongPauseCount((count) => count + 1);
        }
        lastSpeechAtRef.current = now;
      }

      const baseAnswer = answerAtListenStartRef.current;
      setAnswer(`${baseAnswer}${baseAnswer ? " " : ""}${transcript}`.trimStart());
    };

    recognition.onerror = (event) => {
      setMediaError(event.error || "Speech recognition failed.");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const speakQuestion = () => {
    if (!currentQuestion?.question || !window.speechSynthesis) {
      setMediaError("Speech playback is not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentQuestion.question);
    utterance.rate = mode === "rapid" ? 1.06 : 0.92;
    utterance.pitch = 1;
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    setIsPaused(false);
  };

  const toggleSpeechPause = () => {
    if (!window.speechSynthesis || !isSpeaking) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      return;
    }

    window.speechSynthesis.pause();
    setIsPaused(true);
  };

  const restartSpeech = () => {
    window.speechSynthesis?.cancel();
    speakQuestion();
  };

  const stopSpeech = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const toggleCamera = async () => {
    setMediaError("");

    if (cameraEnabled) {
      cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setCameraEnabled(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      cameraStreamRef.current = stream;
      setCameraEnabled(true);
    } catch (error) {
      setMediaError(error.message || "Camera access was blocked.");
    }
  };

  const startRecording = async () => {
    setMediaError("");
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setMediaError("Recording is not supported in this browser.");
      return;
    }

    try {
      if (recordedUrl) {
        URL.revokeObjectURL(recordedUrl);
        setRecordedUrl("");
      }

      const wantsVideo = mode === "video";
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: wantsVideo,
      });
      recordingStreamRef.current = stream;
      recordingChunksRef.current = [];
      setRecordingKind(wantsVideo ? "video" : "audio");

      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) recordingChunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const type = wantsVideo ? "video/webm" : "audio/webm";
        const blob = new Blob(recordingChunksRef.current, { type });
        setRecordedUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
      };
      recorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      setMediaError(error.message || "Recording permission was blocked.");
    }
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
    setIsRecording(false);
  };

  const buildWeakAreas = () => {
    const weakAreas = Object.entries(rubric)
      .filter(([, score]) => score < 70)
      .map(([key]) => key);

    if (behavioralRound) {
      Object.entries(starChecklist).forEach(([key, ok]) => {
        if (!ok) weakAreas.push(`STAR ${key}`);
      });
    }
    if (projectRound) {
      Object.entries(projectChecklist).forEach(([key, ok]) => {
        if (!ok) weakAreas.push(`project ${key}`);
      });
    }
    if (fillerCount >= 4) weakAreas.push("filler words");
    if (longPauseCount > 0) weakAreas.push("long pauses");

    return [...new Set(weakAreas)].slice(0, 8);
  };

  const adaptNextQuestion = async (entry) => {
    if (!adaptiveEnabled || currentIndex >= questions.length - 1) return;

    setIsAdapting(true);
    try {
      const data = await generateInterviewQuestions({
        role,
        roundType: activeRoundType,
        questionStyle: state?.questionStyle || "standard",
        companyType,
        questionCount: 1,
        difficulty: entry.averageScore >= 75 ? "hard" : entry.averageScore < 50 ? "easy" : "medium",
        resumeText: state?.resumeText || "",
        parsedResume: state?.parsedResume || {},
        adaptiveContext: {
          lastScore: entry.averageScore,
          weakAreas: entry.weakAreas,
          strengths: entry.strengths,
          askedQuestions: questions.slice(0, currentIndex + 1).map((item) => item.question),
        },
      });

      const adaptiveQuestion = data.questions?.[0];
      if (!adaptiveQuestion?.question) return;

      setQuestions((prev) => {
        const next = [...prev];
        next[currentIndex + 1] = adaptiveQuestion;
        return next;
      });
    } catch (error) {
      console.error("Failed to adapt next question:", error);
    } finally {
      setIsAdapting(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim() || !currentQuestion) return;

    stopListening();
    setIsSubmitting(true);
    setShowFeedback(false);

    try {
      const data = await evaluateInterviewAnswer({
        question: currentQuestion.question,
        answer,
        roundType: activeRoundType,
      });

      const nextFeedback = {
        feedback: data.feedback || "Evaluation completed.",
        evaluation: data.evaluation || null,
      };
      setFeedback(nextFeedback);
      setShowFeedback(true);

      const strengths = data.evaluation?.strengths || [];
      const weakAreas = buildWeakAreas();
      const entry = {
        question: currentQuestion.question,
        answer,
        feedback: nextFeedback.feedback,
        evaluation: data.evaluation || {},
        rubric,
        averageScore,
        weakAreas,
        strengths,
        fillerCount,
        longPauseCount,
        mode,
        companyType,
      };

      setSessionAnswers((prev) => {
        const filtered = prev.filter((_, index) => index !== currentIndex);
        const next = [...filtered];
        next[currentIndex] = entry;
        return next;
      });

      await adaptNextQuestion(entry);
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
    stopListening();
    stopSpeech();
    if (isRecording) stopRecording();

    if (currentIndex < questions.length - 1) {
      setAnswer("");
      setFeedback(null);
      setShowFeedback(false);
      setLongPauseCount(0);
      setRecordedUrl("");
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    navigate("/dashboard");
  };

  const resetAnswer = () => {
    stopListening();
    if (isRecording) stopRecording();
    setAnswer("");
    setFeedback(null);
    setShowFeedback(false);
    setLongPauseCount(0);
    setRecordedUrl("");
  };

  const downloadReport = async () => {
    const entries = sessionAnswers.filter(Boolean);
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 16;
    const maxWidth = 178;
    let y = 18;

    const ensureSpace = (height = 12) => {
      if (y + height > pageHeight - 16) {
        doc.addPage();
        y = 18;
      }
    };

    const addText = (text, size = 11, style = "normal") => {
      ensureSpace(10);
      doc.setFont("helvetica", style);
      doc.setFontSize(size);
      const lines = doc.splitTextToSize(String(text || ""), maxWidth);
      doc.text(lines, margin, y);
      y += lines.length * 6 + 2;
    };

    const avg =
      entries.length > 0
        ? clampScore(entries.reduce((sum, item) => sum + item.averageScore, 0) / entries.length)
        : averageScore;
    const weakAreas = [
      ...new Set(entries.flatMap((item) => item.weakAreas || [])),
    ].slice(0, 10);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Mock Interview Report", margin, y);
    y += 10;
    addText(`Role: ${role} | Round: ${roundLabel} | Company Mode: ${companyType}`, 11);
    addText(`Average Score: ${avg}/100 | Mode: ${mode}`, 11, "bold");

    addText("Weak Areas", 14, "bold");
    addText(weakAreas.length ? weakAreas.join(", ") : "No major weak areas detected yet.");

    addText("Next Practice Plan", 14, "bold");
    addText(
      [
        "1. Re-answer the lowest-scored question using a clear structure.",
        "2. Add measurable project evidence and tradeoffs.",
        "3. Reduce filler words and long pauses in the next voice/video attempt.",
        "4. Practice one company-style follow-up focused on the weakest area.",
      ].join("\n")
    );

    entries.forEach((entry, index) => {
      addText(`Question ${index + 1}`, 14, "bold");
      addText(entry.question, 11, "bold");
      addText(`Score: ${entry.averageScore}/100`);
      addText(`Feedback: ${entry.feedback}`);
      addText(
        `Best answer rewrite guide: Start with context, state your decision or approach, explain tradeoffs, mention implementation details, add measurable impact, and close with what you learned. Ideal points: ${(entry.evaluation?.idealAnswerPoints || []).join("; ") || "Use specific evidence and role-relevant reasoning."}`
      );
    });

    doc.save(`Mock_Interview_Report_${role.replace(/[^a-z0-9]/gi, "_")}.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <header className="mb-6 border-b border-slate-200 pb-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/dashboard")}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm hover:text-slate-900"
                aria-label="Back to dashboard"
              >
                <ArrowLeft size={18} />
              </button>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm">
                <BrainCircuit size={22} />
              </div>

              <div>
                <h1 className="text-xl font-bold leading-tight text-slate-950">
                  Mock Interview Studio
                </h1>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                  Live practice session
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-700 shadow-sm">
                {role}
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-700 shadow-sm">
                {roundLabel}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 font-mono text-slate-700 shadow-sm">
                <Clock3 size={14} />
                {formatTime(elapsedSeconds)}
              </span>
              <button
                onClick={downloadReport}
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 font-semibold text-white shadow-sm hover:bg-slate-800"
              >
                <Download size={15} />
                Report
              </button>
            </div>
          </div>

          <div className="mt-4">
            <div className="mb-2 flex justify-between text-xs font-medium text-slate-500">
              <span>Round 1 - {currentQuestion?.category || roundLabel}</span>
              <span>
                {questions.length > 0
                  ? `Question ${currentIndex + 1} of ${questions.length}`
                  : "Preparing questions"}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
              <motion.div
                className="h-full rounded-full bg-slate-950"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
          </div>
        </header>

        <section className="mb-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[1.3fr_0.7fr_0.7fr]">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
              Interview mode
            </p>
            <div className="flex flex-wrap gap-2">
              {interviewModes.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setMode(item.id)}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold ${
                      mode === item.id
                        ? "bg-slate-950 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <Icon size={16} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
              <Building2 size={14} />
              Company mode
            </label>
            <select
              value={companyType}
              onChange={(event) => setCompanyType(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-slate-950"
            >
              {companies.map((company) => (
                <option key={company} value={company}>
                  {company}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
              Adaptive flow
            </p>
            <button
              onClick={() => setAdaptiveEnabled((value) => !value)}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold ${
                adaptiveEnabled
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              <Radio size={16} />
              {adaptiveEnabled ? "Adaptive on" : "Adaptive off"}
            </button>
          </div>
        </section>

        {isLoading ? (
          <MotionDiv
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm"
          >
            <Loader2 className="mx-auto mb-4 animate-spin text-slate-950" size={34} />
            <p className="font-medium text-slate-600">
              Loading your interview questions...
            </p>
          </MotionDiv>
        ) : questions.length > 0 ? (
          <div className="grid gap-6 xl:grid-cols-[0.86fr_1.14fr]">
            <MotionDiv
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-5">
                <div>
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-bold text-slate-950">
                        Candidate Studio
                      </h2>
                      <p className="text-sm text-slate-500">
                        Camera, audio, replay, and delivery checks
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${
                        cameraEnabled
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <Wifi size={13} />
                      {cameraEnabled ? "Video live" : "Preview off"}
                    </span>
                  </div>

                  <div className="relative aspect-video overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-inner">
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      className={`h-full w-full object-cover transition-opacity duration-300 ${
                        cameraEnabled ? "opacity-100" : "opacity-0"
                      }`}
                    />

                    {!cameraEnabled && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.2),_transparent_34%),linear-gradient(135deg,_#0f172a,_#111827)] text-white">
                        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 text-2xl font-bold ring-1 ring-white/15">
                          {candidateInitials}
                        </div>
                        <p className="text-sm font-semibold text-white/80">
                          Camera preview is off
                        </p>
                        <p className="mt-1 text-xs text-white/45">
                          Use video mock mode for presence practice
                        </p>
                      </div>
                    )}

                    <div className="absolute left-4 top-4 rounded-full bg-black/45 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                      {cameraEnabled ? "Live preview" : "Standby"}
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {answerSignals.map((signal) => (
                    <div
                      key={signal.label}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                          {signal.label}
                        </span>
                        {signal.ready ? (
                          <BadgeCheck className="text-emerald-600" size={16} />
                        ) : (
                          <Activity className="text-slate-400" size={16} />
                        )}
                      </div>
                      <p
                        className={`text-sm font-bold ${
                          signal.ready ? "text-emerald-700" : "text-slate-700"
                        }`}
                      >
                        {signal.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
                  {Object.entries(rubric).map(([label, score]) => (
                    <div key={label}>
                      <div className="mb-1 flex items-center justify-between text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                        <span>{label}</span>
                        <span className={`rounded-full px-2 py-0.5 ${scoreTone(score)}`}>
                          {score}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-slate-950"
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={speakQuestion}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                  >
                    <Volume2 size={17} />
                    Repeat
                  </button>
                  <button
                    onClick={toggleSpeechPause}
                    disabled={!isSpeaking}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isPaused ? <Play size={17} /> : <Pause size={17} />}
                    {isPaused ? "Resume" : "Pause"}
                  </button>
                  <button
                    onClick={restartSpeech}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                  >
                    <RefreshCcw size={17} />
                    Restart
                  </button>
                  <button
                    onClick={stopSpeech}
                    disabled={!isSpeaking}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <VolumeX size={17} />
                    Stop
                  </button>
                  <button
                    onClick={toggleCamera}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold shadow-sm ${
                      cameraEnabled
                        ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                        : "bg-slate-950 text-white hover:bg-slate-800"
                    }`}
                  >
                    {cameraEnabled ? <CameraOff size={17} /> : <Camera size={17} />}
                    {cameraEnabled ? "Stop video" : "Start video"}
                  </button>
                </div>
              </div>
            </MotionDiv>

            <AnimatePresence mode="wait">
              <MotionDiv
                key={currentIndex}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-900">
                      <Sparkles size={15} />
                      AI Prompt
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                        <Target size={13} />
                        {currentQuestion.difficulty || "Medium"}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                        <FileText size={13} />
                        {currentQuestion.category || roundLabel}
                      </span>
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold leading-snug text-slate-950 md:text-2xl">
                    {currentQuestion.question}
                  </h2>
                  {currentQuestion.hint && (
                    <p className="mt-5 rounded-2xl bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800">
                      Hint: {currentQuestion.hint}
                    </p>
                  )}
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <label className="text-sm font-bold text-slate-900">
                      Your answer
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowTranscript((value) => !value)}
                      className="text-sm font-semibold text-slate-600 hover:text-slate-950"
                    >
                      {showTranscript ? "Hide transcript" : "Show transcript"}
                    </button>
                  </div>

                  {showTranscript && (
                    <textarea
                      value={answer}
                      onChange={(event) => setAnswer(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && event.ctrlKey) {
                          submitAnswer();
                        }
                      }}
                      placeholder={
                        mode === "text"
                          ? "Type your structured answer here..."
                          : "Press the mic and start speaking your answer..."
                      }
                      className="h-48 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900 placeholder-slate-400 outline-none transition focus:border-slate-950 focus:bg-white focus:ring-4 focus:ring-slate-100"
                      disabled={isSubmitting}
                    />
                  )}

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                    <button
                      onClick={isListening ? stopListening : startListening}
                      disabled={isSubmitting || mode === "text"}
                      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold shadow-sm ${
                        isListening
                          ? "bg-rose-600 text-white hover:bg-rose-700"
                          : "bg-slate-950 text-white hover:bg-slate-800"
                      } disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                      {isListening ? <MicOff size={17} /> : <Mic size={17} />}
                      {isListening ? "Stop speaking" : "Start speaking"}
                    </button>

                    <button
                      onClick={isRecording ? stopRecording : startRecording}
                      disabled={mode === "text"}
                      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold shadow-sm ${
                        isRecording
                          ? "bg-rose-600 text-white hover:bg-rose-700"
                          : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                      } disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                      {isRecording ? <Square size={16} /> : <Radio size={16} />}
                      {isRecording ? "Stop recording" : "Record answer"}
                    </button>

                    <button
                      onClick={showFeedback ? nextQuestion : submitAnswer}
                      disabled={!answer.trim() || isSubmitting}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin" size={17} />
                          Evaluating
                        </>
                      ) : isAdapting ? (
                        <>
                          <Loader2 className="animate-spin" size={17} />
                          Adapting
                        </>
                      ) : (
                        <>
                          {showFeedback ? "Next Question" : "Submit & Adapt"}
                          <ArrowRight size={17} />
                        </>
                      )}
                    </button>

                    <button
                      onClick={nextQuestion}
                      className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100"
                    >
                      Skip
                    </button>

                    <button
                      onClick={resetAnswer}
                      className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100"
                    >
                      <RotateCcw size={16} />
                      Reset
                    </button>
                  </div>

                  {recordedUrl && (
                    <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="mb-3 text-sm font-bold text-slate-900">
                        Replay before submitting
                      </p>
                      {recordingKind === "video" ? (
                        <video src={recordedUrl} controls className="w-full rounded-xl" />
                      ) : (
                        <audio src={recordedUrl} controls className="w-full" />
                      )}
                    </div>
                  )}

                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                    <span>{answerWords} words</span>
                    <span>{fillerCount} filler words</span>
                    <span>{longPauseCount} long pauses</span>
                    {isListening && <span>Listening...</span>}
                    {mediaError && <span className="text-rose-600">{mediaError}</span>}
                  </div>
                </section>

                {detectorWarnings.length > 0 && answer.trim() && (
                  <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
                    <div className="mb-3 flex items-center gap-2 text-sm font-bold text-amber-900">
                      <TimerReset size={17} />
                      Live coaching warnings
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {detectorWarnings.map((warning) => (
                        <span
                          key={warning}
                          className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-amber-800"
                        >
                          {warning}
                        </span>
                      ))}
                    </div>
                  </section>
                )}

                <AnimatePresence>
                  {showFeedback && feedback?.feedback && (
                    <MotionDiv
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -14 }}
                      className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm"
                    >
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <h3 className="text-lg font-bold text-emerald-900">
                          AI Feedback
                        </h3>
                        <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-bold text-emerald-700">
                          <Gauge size={16} />
                          {averageScore}/100
                        </span>
                      </div>
                      <p className="leading-7 text-emerald-950">
                        {feedback.feedback}
                      </p>

                      {feedback.evaluation?.strengths?.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-bold text-emerald-900">
                            Strengths
                          </p>
                          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-emerald-950">
                            {feedback.evaluation.strengths.map((item, index) => (
                              <li key={`${item}-${index}`}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {feedback.evaluation?.improvements?.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-bold text-emerald-900">
                            Improvements
                          </p>
                          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-emerald-950">
                            {feedback.evaluation.improvements.map((item, index) => (
                              <li key={`${item}-${index}`}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </MotionDiv>
                  )}
                </AnimatePresence>
              </MotionDiv>
            </AnimatePresence>
          </div>
        ) : (
          <MotionDiv
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm"
          >
            <p className="font-medium text-slate-600">
              No questions available. Please try again.
            </p>
          </MotionDiv>
        )}
      </div>
    </div>
  );
}
