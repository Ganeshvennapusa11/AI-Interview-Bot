import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Code2,
  Cpu,
  Database,
  Flag,
  Map,
  ServerCog,
  ShieldCheck,
  Target,
  Workflow,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { roleTrackMap, roleTracks } from "../data/roleTracks.js";

const iconMap = {
  BrainCircuit,
  Code2,
  Cpu,
  Database,
  ServerCog,
  ShieldCheck,
  Workflow,
};

const MotionSection = motion.section;

function getTrackFromParams(roleId) {
  if (!roleId) {
    return roleTracks[0];
  }

  return roleTrackMap[roleId.toUpperCase()] || roleTracks[0];
}

function SectionCard({ title, items, tone = "slate" }) {
  const toneMap = {
    amber:
      "border-amber-200 bg-amber-50/80 text-amber-900",
    cyan:
      "border-cyan-200 bg-cyan-50/80 text-cyan-900",
    emerald:
      "border-emerald-200 bg-emerald-50/80 text-emerald-900",
    rose:
      "border-rose-200 bg-rose-50/80 text-rose-900",
    slate:
      "border-slate-200 bg-white/90 text-slate-900",
  };

  return (
    <div
      className={`rounded-[1.75rem] border p-6 shadow-sm ${toneMap[tone] || toneMap.slate}`}
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-3 text-sm leading-7">
            <CheckCircle2 className="mt-1 shrink-0" size={16} />
            <p>{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PreparationRoadmap() {
  const navigate = useNavigate();
  const { roleId } = useParams();

  const activeTrack = useMemo(() => getTrackFromParams(roleId), [roleId]);
  const ActiveIcon = iconMap[activeTrack.icon] || Cpu;

  return (
    <div className="min-h-screen text-slate-800">
      <div className="mx-auto max-w-7xl space-y-8">
        <MotionSection
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/85 shadow-[0_18px_60px_rgba(148,163,184,0.14)] backdrop-blur-xl"
        >
          <div className="grid gap-8 p-8 md:p-10 xl:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                <Map size={15} />
                Detailed preparation roadmap
              </div>

              <div className="mt-6 flex items-start gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-[1.4rem] border border-slate-200 bg-slate-950 text-white shadow-sm">
                  <ActiveIcon size={28} />
                </div>

                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">
                    {activeTrack.id} | {activeTrack.category}
                  </p>
                  <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
                    {activeTrack.title} Roadmap
                  </h1>
                  <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
                    {activeTrack.roadmap.tagline}
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/90 p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Best Fit
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-700">
                    {activeTrack.roadmap.fit}
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/90 p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    North Star
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-700">
                    {activeTrack.roadmap.northStar}
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/90 p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Interview Focus
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-700">
                    {activeTrack.skills}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(180deg,#f8fbff_0%,#eef6ff_100%)] p-6">
              <div className="flex items-center gap-3">
                <BadgeCheck className="text-cyan-600" size={22} />
                <h2 className="text-xl font-semibold text-slate-950">
                  Role Switcher
                </h2>
              </div>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Jump between tracks and compare what changes in depth, interview style, and final preparation priorities.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {roleTracks.map((track) => {
                  const Icon = iconMap[track.icon] || Cpu;
                  const isActive = track.id === activeTrack.id;

                  return (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => navigate(`/roadmap/${track.id}`)}
                      className={`rounded-[1.5rem] border px-4 py-4 text-left transition ${
                        isActive
                          ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                          : "border-slate-200 bg-white/90 text-slate-700 hover:border-cyan-200 hover:bg-cyan-50/60"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                              isActive
                                ? "bg-white/10"
                                : "bg-slate-100 text-slate-800"
                            }`}
                          >
                            <Icon size={18} />
                          </div>
                          <div>
                            <p className="font-semibold">{track.id}</p>
                            <p
                              className={`text-xs ${
                                isActive ? "text-slate-300" : "text-slate-500"
                              }`}
                            >
                              {track.title}
                            </p>
                          </div>
                        </div>
                        <ChevronRight size={18} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </MotionSection>

        <section className="grid gap-6 xl:grid-cols-3">
          {activeTrack.roadmap.coreAreas.map((section, index) => {
            const tones = ["cyan", "emerald", "amber"];

            return (
              <SectionCard
                key={section.title}
                title={section.title}
                items={section.items}
                tone={tones[index] || "slate"}
              />
            );
          })}
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-7 shadow-sm">
            <div className="flex items-center gap-3">
              <Target className="text-indigo-600" size={21} />
              <h2 className="text-2xl font-semibold text-slate-950">
                Interview Loop Breakdown
              </h2>
            </div>

            <div className="mt-6 space-y-4">
              {activeTrack.roadmap.interviewLoops.map((loop, index) => (
                <div
                  key={loop}
                  className="flex items-start gap-4 rounded-[1.4rem] border border-slate-200 bg-slate-50/80 px-5 py-4"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-7 text-slate-700">{loop}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-7 shadow-sm">
            <div className="flex items-center gap-3">
              <BookOpen className="text-violet-600" size={21} />
              <h2 className="text-2xl font-semibold text-slate-950">
                Project Expectations
              </h2>
            </div>

            <div className="mt-6 space-y-4">
              {activeTrack.roadmap.projectRequirements.map((item) => (
                <div
                  key={item}
                  className="rounded-[1.4rem] border border-violet-100 bg-violet-50/70 px-5 py-4 text-sm leading-7 text-slate-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white/90 p-7 shadow-sm">
          <div className="flex items-center gap-3">
            <Flag className="text-emerald-600" size={21} />
            <h2 className="text-2xl font-semibold text-slate-950">
              Four-Week Preparation Plan
            </h2>
          </div>

          <div className="mt-7 grid gap-5 xl:grid-cols-2">
            {activeTrack.roadmap.monthPlan.map((phase) => (
              <div
                key={phase.week}
                className="rounded-[1.7rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      {phase.week}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-950">
                      {phase.focus}
                    </h3>
                  </div>
                  <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
                    Execution block
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-sm font-semibold text-slate-700">
                    Outcomes
                  </p>
                  <div className="mt-3 space-y-3">
                    {phase.outcomes.map((outcome) => (
                      <div
                        key={outcome}
                        className="flex items-start gap-3 text-sm leading-7 text-slate-700"
                      >
                        <ArrowRight className="mt-1 shrink-0 text-cyan-600" size={16} />
                        <p>{outcome}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 rounded-[1.3rem] border border-slate-200 bg-slate-50/80 p-4">
                  <p className="text-sm font-semibold text-slate-700">
                    Weekly drills
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {phase.drills.map((drill) => (
                      <span
                        key={drill}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600"
                      >
                        {drill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <SectionCard
            title="Readiness Checkpoints"
            items={activeTrack.roadmap.checkpoints}
            tone="emerald"
          />
          <SectionCard
            title="Common Mistakes"
            items={activeTrack.roadmap.commonMistakes}
            tone="rose"
          />
          <SectionCard
            title="Last-Week Sprint"
            items={activeTrack.roadmap.finalSprint}
            tone="amber"
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-7 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-950">
              High-Value Resources
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {activeTrack.roadmap.resources.map((resource) => (
                <div
                  key={resource}
                  className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5 text-sm leading-7 text-slate-700"
                >
                  {resource}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-slate-900 p-7 text-white shadow-sm">
            <h2 className="text-2xl font-semibold">
              Recommended Next Step
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Use this roadmap as your preparation backbone, then move into the resume screener and interview session so the questions stay role-specific instead of generic.
            </p>

            <div className="mt-6 space-y-3 text-sm text-slate-200">
              <p>1. Review this role roadmap from top to bottom.</p>
              <p>2. Upload your resume and compare its strengths against the roadmap expectations.</p>
              <p>3. Start an interview round with `Project Deep` if you want sharper questions.</p>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() =>
                  navigate("/uploadresume", {
                    state: {
                      role: {
                        id: activeTrack.id,
                        title: activeTrack.title,
                        desc: activeTrack.desc,
                        exp: activeTrack.exp,
                        qna: activeTrack.qna,
                        date: activeTrack.date,
                        skills: activeTrack.skills,
                        accent: activeTrack.accent,
                        category: activeTrack.category,
                      },
                    },
                  })
                }
                className="rounded-2xl bg-white px-5 py-3 font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Use This Role
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="rounded-2xl border border-white/20 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
