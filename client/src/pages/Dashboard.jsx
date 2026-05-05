import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Code2,
  Cpu,
  Database,
  PlusCircle,
  Search,
  ServerCog,
  ShieldCheck,
  Sparkles,
  Workflow,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { roleTracks } from "../data/roleTracks.js";

const MotionSection = motion.section;
const MotionDiv = motion.div;

const iconMap = {
  BrainCircuit,
  Code2,
  Cpu,
  Database,
  ServerCog,
  ShieldCheck,
  Workflow,
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [roles, setRoles] = useState(roleTracks);

  const [newRole, setNewRole] = useState({
    id: "",
    title: "",
    desc: "",
    exp: "",
    qna: "",
    date: "",
    skills: "",
    accent: "from-cyan-100 via-sky-50 to-white",
    category: "Custom",
  });

  const filters = ["All", ...new Set(roles.map((role) => role.category))];

  const filteredRoles = roles.filter((role) => {
    const query = search.toLowerCase();
    const matchesSearch =
      role.title.toLowerCase().includes(query) ||
      role.skills.toLowerCase().includes(query) ||
      role.category.toLowerCase().includes(query);

    const matchesFilter =
      activeFilter === "All" || role.category === activeFilter;

    return matchesSearch && matchesFilter;
  });

  const handleAddRole = (event) => {
    event.preventDefault();

    if (!newRole.id.trim() || !newRole.title.trim()) {
      return;
    }

    setRoles((prev) => [
      ...prev,
      {
        ...newRole,
        id: newRole.id.trim().toUpperCase(),
        title: newRole.title.trim(),
        desc: newRole.desc.trim() || "Custom technical interview track.",
        exp: newRole.exp.trim() || "Custom",
        qna: newRole.qna.trim() || "10 Q&A",
        date: newRole.date.trim() || "25 Apr 2026",
        skills: newRole.skills.trim() || "Custom skills",
        category: newRole.category.trim() || "Custom",
        icon: "Sparkles",
      },
    ]);

    setShowModal(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);

    setNewRole({
      id: "",
      title: "",
      desc: "",
      exp: "",
      qna: "",
      date: "",
      skills: "",
      accent: "from-cyan-100 via-sky-50 to-white",
      category: "Custom",
    });
  };

  const handleRoleSelect = (role) => {
    const safeRole = {
      id: role.id,
      title: role.title,
      desc: role.desc,
      exp: role.exp,
      qna: role.qna,
      date: role.date,
      skills: role.skills,
      accent: role.accent,
      category: role.category,
    };

    navigate("/uploadresume", {
      state: { role: safeRole },
    });
  };

  const handleRoadmapOpen = (roleId) => {
    navigate(`/roadmap/${roleId}`);
  };

  return (
    <div className="min-h-screen text-slate-800">
      <div className="mx-auto max-w-7xl">
        <MotionSection
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-8 shadow-[0_18px_60px_rgba(148,163,184,0.14)] backdrop-blur-xl md:p-10"
        >
          <div className="grid gap-8 xl:grid-cols-[1.25fr_0.75fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-700">
                <Sparkles size={15} />
                Technical interview workspace
              </div>

              <h1 className="mt-5 max-w-4xl text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
                Choose a sharper role track for current engineering interviews
              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                Explore modern roles like SDE, SWE, SRE, AI/ML Engineer,
                Platform Engineer, Backend Engineer, and Security Engineer.
                Pick a track, upload your resume, and practice in a more focused way.
              </p>

              <div className="mt-8 relative max-w-3xl">
                <input
                  type="text"
                  placeholder="Search roles like SDE, SWE, SRE, AI / ML Engineer..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-slate-800 shadow-sm outline-none focus:ring-2 focus:ring-cyan-300"
                />
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      activeFilter === filter
                        ? "bg-slate-900 text-white"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-cyan-200 hover:text-slate-900"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "Role Tracks", value: roles.length.toString(), note: "modern interview paths" },
                { label: "Round Types", value: "6", note: "technical to HR" },
                { label: "Resume Context", value: "ON", note: "guided by your profile" },
                { label: "Target", value: "2026", note: "current hiring trends" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.6rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-5 shadow-sm"
                >
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="mt-2 text-3xl font-bold text-slate-950">
                    {item.value}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-400">
                    {item.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </MotionSection>

        <section className="mt-10 grid grid-cols-1 gap-8 xl:grid-cols-3">
          {filteredRoles.map((role, index) => {
            const Icon = iconMap[role.icon] || Sparkles;

            return (
              <motion.div
                key={`${role.id}-${index}`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04, duration: 0.3 }}
                whileHover={{ y: -6 }}
              >
                <div
                  className={`group rounded-[2rem] border border-slate-200 bg-gradient-to-br ${role.accent} p-7 shadow-[0_14px_36px_rgba(148,163,184,0.12)] transition`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/80 bg-white/80 shadow-sm">
                        <span className="text-lg font-bold text-slate-950">
                          {role.id}
                        </span>
                      </div>

                      <div>
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                          <Icon size={13} />
                          {role.category}
                        </div>

                        <h2 className="text-[1.9rem] font-bold leading-tight text-slate-950">
                          {role.title}
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {role.skills}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRoleSelect(role)}
                      className="rounded-full border border-white/80 bg-white/75 p-2 text-slate-500 transition group-hover:text-slate-900"
                    >
                      <ArrowRight size={20} />
                    </button>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-3">
                    <div className="rounded-2xl border border-white/80 bg-white/72 px-4 py-4">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                        Experience
                      </p>
                      <p className="mt-2 text-lg font-semibold text-slate-800">
                        {role.exp}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/80 bg-white/72 px-4 py-4">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                        Questions
                      </p>
                      <p className="mt-2 text-lg font-semibold text-slate-800">
                        {role.qna}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/80 bg-white/72 px-4 py-4">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                        Updated
                      </p>
                      <p className="mt-2 text-lg font-semibold text-slate-800">
                        {role.date}
                      </p>
                    </div>
                  </div>

                  <p className="mt-6 text-base leading-7 text-slate-700">
                    {role.desc}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => handleRoleSelect(role)}
                      className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      Start With This Role
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRoadmapOpen(role.id)}
                      className="rounded-2xl border border-slate-300 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:text-slate-950"
                    >
                      View Roadmap
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </section>

        <div className="mt-12 flex justify-center">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-2xl bg-slate-950 px-7 py-3.5 font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            <PlusCircle size={20} />
            Add Custom Role
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4 backdrop-blur-sm"
          >
            <MotionDiv
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="relative w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute right-5 top-5 text-slate-400 transition hover:text-rose-500"
              >
                <X size={22} />
              </button>

              <h3 className="text-center text-2xl font-bold text-slate-900">
                Add Custom Role
              </h3>

              <p className="mt-2 text-center text-sm text-slate-500">
                Add a role that matches your exact target job.
              </p>

              <form onSubmit={handleAddRole} className="mt-6 space-y-4">
                <input
                  type="text"
                  placeholder="Role ID (e.g. MLE)"
                  value={newRole.id}
                  onChange={(event) =>
                    setNewRole({ ...newRole, id: event.target.value })
                  }
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-300"
                />
                <input
                  type="text"
                  placeholder="Role Title"
                  value={newRole.title}
                  onChange={(event) =>
                    setNewRole({ ...newRole, title: event.target.value })
                  }
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-300"
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={newRole.category}
                  onChange={(event) =>
                    setNewRole({ ...newRole, category: event.target.value })
                  }
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-300"
                />
                <input
                  type="text"
                  placeholder="Skills"
                  value={newRole.skills}
                  onChange={(event) =>
                    setNewRole({ ...newRole, skills: event.target.value })
                  }
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-300"
                />
                <input
                  type="text"
                  placeholder="Experience"
                  value={newRole.exp}
                  onChange={(event) =>
                    setNewRole({ ...newRole, exp: event.target.value })
                  }
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-300"
                />
                <input
                  type="text"
                  placeholder="Questions"
                  value={newRole.qna}
                  onChange={(event) =>
                    setNewRole({ ...newRole, qna: event.target.value })
                  }
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-300"
                />
                <textarea
                  rows={4}
                  placeholder="Description"
                  value={newRole.desc}
                  onChange={(event) =>
                    setNewRole({ ...newRole, desc: event.target.value })
                  }
                  className="w-full resize-none rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-300"
                />
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-cyan-600 py-3 font-semibold text-white transition hover:bg-cyan-700"
                >
                  Save Role
                </button>
              </form>
            </MotionDiv>
          </MotionDiv>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showToast && (
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-10 right-10 flex items-center gap-3 rounded-2xl bg-emerald-500 px-6 py-3 text-white shadow-lg"
          >
            <CheckCircle2 size={20} />
            <span className="font-medium">Role added successfully!</span>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
}
