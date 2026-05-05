import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Briefcase,
  Gauge,
  MessageSquareText,
  SendHorizonal,
  SlidersHorizontal,
  Target,
  User2,
} from "lucide-react";
import { sendChatMessage } from "../services/api";

const MotionDiv = motion.div;

const promptChips = [
  "Give me likely interview questions for this role.",
  "Review my resume fit for this target role.",
  "Ask me a project-deep follow-up question.",
  "Challenge me with harder interview questions.",
];

const roundOptions = [
  { value: "technical_1_dsa", label: "Technical DSA" },
  { value: "technical_2_fundamentals", label: "Technical Fundamentals" },
  { value: "technical_2_projects", label: "Technical Projects" },
  { value: "managerial", label: "Managerial" },
  { value: "hr", label: "HR" },
  { value: "full_mock", label: "Full Mock" },
];

const difficultyOptions = ["easy", "medium", "hard"];

const questionStyleOptions = [
  { value: "standard", label: "Standard" },
  { value: "resume_heavy", label: "Resume Heavy" },
  { value: "project_deep", label: "Project Deep" },
  { value: "fundamentals_deep", label: "Fundamentals Deep" },
  { value: "behavioral_sharp", label: "Behavioral Sharp" },
];

export default function ChatBot() {
  const [context, setContext] = useState(() => {
    try {
      return {
        role: "",
        roundType: "technical_1_dsa",
        difficulty: "medium",
        questionStyle: "project_deep",
        ...JSON.parse(localStorage.getItem("interviewContext") || "{}"),
      };
    } catch {
      return {
        role: "",
        roundType: "technical_1_dsa",
        difficulty: "medium",
        questionStyle: "project_deep",
      };
    }
  });

  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Set your role, round, difficulty, and question style on the left, then ask for coaching, follow-ups, or role-specific prep.",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    localStorage.setItem("interviewContext", JSON.stringify(context));
  }, [context]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    const userMsg = {
      from: "user",
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const data = await sendChatMessage(text, context);

      const botReply = {
        from: "bot",
        text: data.reply || "No response from AI.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: error.message || "Error contacting AI server.",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.12),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.14),_transparent_28%),linear-gradient(180deg,_#f7fbfc_0%,_#eef7f7_100%)] p-6">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[340px_1fr]">
        <aside className="rounded-[1.75rem] border border-slate-200 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
              <Bot size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Interview Coach
              </h2>
              <p className="text-sm text-slate-500">
                Editable prep context
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                <Briefcase size={15} />
                Target Role
              </label>
              <input
                type="text"
                value={context.role || ""}
                onChange={(event) =>
                  setContext((prev) => ({ ...prev, role: event.target.value }))
                }
                placeholder="e.g. Frontend Engineer"
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none focus:ring-2 focus:ring-emerald-300"
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                <Target size={15} />
                Round
              </label>
              <select
                value={context.roundType || "technical_1_dsa"}
                onChange={(event) =>
                  setContext((prev) => ({
                    ...prev,
                    roundType: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none focus:ring-2 focus:ring-emerald-300"
              >
                {roundOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                <Gauge size={15} />
                Difficulty
              </label>
              <select
                value={context.difficulty || "medium"}
                onChange={(event) =>
                  setContext((prev) => ({
                    ...prev,
                    difficulty: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none focus:ring-2 focus:ring-emerald-300"
              >
                {difficultyOptions.map((option) => (
                  <option key={option} value={option}>
                    {option[0].toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                <SlidersHorizontal size={15} />
                Question Style
              </label>
              <select
                value={context.questionStyle || "project_deep"}
                onChange={(event) =>
                  setContext((prev) => ({
                    ...prev,
                    questionStyle: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none focus:ring-2 focus:ring-emerald-300"
              >
                {questionStyleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </aside>

        <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white/85 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <div className="border-b border-slate-200 px-6 py-5">
            <h1 className="text-2xl font-semibold text-slate-900">
              Interview Support Chat
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Resume-aware answers, role guidance, and round-specific coaching.
            </p>
          </div>

          <div className="border-b border-slate-200 px-6 py-4">
            <div className="flex flex-wrap gap-2">
              {promptChips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => setInput(chip)}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[58vh] space-y-4 overflow-y-auto bg-[linear-gradient(180deg,_rgba(248,250,252,0.7)_0%,_rgba(255,255,255,0.95)_100%)] px-6 py-5">
            <AnimatePresence>
              {messages.map((msg, index) => (
                <MotionDiv
                  key={`${msg.time}-${index}`}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex ${
                    msg.from === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[78%] rounded-3xl px-4 py-3 shadow-sm ${
                      msg.from === "user"
                        ? "rounded-br-md bg-slate-900 text-white"
                        : "rounded-bl-md border border-emerald-100 bg-emerald-50 text-slate-800"
                    }`}
                  >
                    <div className="mb-1 flex items-center gap-2 text-xs opacity-80">
                      {msg.from === "user" ? (
                        <User2 size={13} />
                      ) : (
                        <Bot size={13} />
                      )}
                      <span>{msg.from === "user" ? "You" : "Coach"}</span>
                    </div>
                    <p className="whitespace-pre-wrap leading-7">{msg.text}</p>
                    <p className="mt-2 text-[11px] opacity-60">{msg.time}</p>
                  </div>
                </MotionDiv>
              ))}
            </AnimatePresence>

            {isTyping && (
              <div className="text-sm italic text-slate-500">
                Coach is thinking...
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 p-4">
            <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-400">
              <MessageSquareText size={14} />
              Live context: {context.role || "No role"} | {context.roundType} |{" "}
              {context.difficulty} | {context.questionStyle}
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                placeholder="Ask about resume fit, likely questions, weak answers..."
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    sendMessage();
                  }
                }}
                className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-emerald-300"
              />
              <button
                onClick={sendMessage}
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 font-medium text-white transition hover:bg-emerald-700"
              >
                <SendHorizonal size={16} />
                Send
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
