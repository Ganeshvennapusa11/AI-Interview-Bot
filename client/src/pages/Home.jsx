// // src/pages/Home.jsx
// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import { ArrowUp } from "lucide-react";

// const fadeInUp = {
//   hidden: { opacity: 0, y: 40 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
// };

// export default function Home() {
//   const [showScrollTop, setShowScrollTop] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => setShowScrollTop(window.scrollY > 300);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 text-gray-800 scroll-smooth">
//       {/* ✅ Navbar */}
//       <header className="flex justify-between items-center px-6 md:px-12 py-5 shadow bg-transparent backdrop-blur-md sticky top-0 z-50">
//         <div className="text-2xl font-bold tracking-wide text-teal-800">
//           Interview Companion
//         </div>
//         <nav className="space-x-3 md:space-x-4">
//           <Link
//             to="/login"
//             className="px-4 py-2 rounded border border-teal-300 text-teal-700 hover:bg-teal-300 hover:text-white transition"
//           >
//             Login
//           </Link>
//           <Link
//             to="/signup"
//             className="px-4 py-2 rounded bg-gradient-to-r from-teal-400 to-cyan-500 text-white font-medium hover:from-teal-300 hover:to-cyan-400 transition"
//           >
//             Sign Up
//           </Link>
//         </nav>
//       </header>

//       {/* ✅ Hero Section */}
//       <motion.section
//         className="flex flex-col items-center text-center px-6 py-20 bg-gradient-to-r from-white/0 to-white/0 rounded-b-3xl shadow-inner"
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true }}
//         variants={fadeInUp}
//       >
//         <h1 className="text-4xl md:text-5xl font-bold mb-4 text-teal-800">
//           Prepare Smarter. Interview Better.
//         </h1>
//         <p className="text-lg max-w-2xl text-gray-600 mb-8">
//           Practice interviews, upload resumes, and get tailored guidance for your dream job.
//           Your one-stop platform to improve your interview confidence.
//         </p>
//         <Link
//           to="/signup"
//           className="px-8 py-3 bg-gradient-to-r from-teal-400 to-cyan-500 text-white font-semibold rounded-lg shadow hover:from-teal-300 hover:to-cyan-400 transition"
//         >
//           Get Started
//         </Link>
//       </motion.section>

//       {/* ✅ Features Section */}
//       <section className="py-16 px-6 max-w-6xl mx-auto">
//         <motion.h2
//           className="text-3xl font-bold text-center mb-12 text-teal-800"
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true }}
//           variants={fadeInUp}
//         >
//           Platform Highlights
//         </motion.h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {[ ...Array(3) ].map((_, idx) => (
//             <motion.div
//               key={idx}
//               className="p-6 rounded-xl shadow-md bg-white/60 hover:bg-white/70 transition border border-teal-100"
//               initial="hidden"
//               whileInView="visible"
//               viewport={{ once: true }}
//               variants={fadeInUp}
//             >
//               <h3 className="text-xl font-semibold mb-3 text-teal-800">
//                 Feature Title
//               </h3>
//               <p className="text-gray-600">Feature description goes here.</p>
//             </motion.div>
//           ))}
//         </div>
//       </section>

//       {/* ✅ Testimonials Section */}
//       <section className="bg-transparent py-16 px-6">
//         <motion.h2
//           className="text-3xl font-bold text-center mb-12 text-teal-800"
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true }}
//           variants={fadeInUp}
//         >
//           What Users Say
//         </motion.h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
//           {[{
//               name: "Arjun",
//               feedback: "The mock interview feature boosted my confidence tremendously!"
//             },{
//               name: "Sneha",
//               feedback: "I loved the resume feedback — it helped me land my first job."
//             },{
//               name: "Ravi",
//               feedback: "The interface is clean and the insights are super useful. Highly recommend!"
//             }].map((t, idx) => (
//             <motion.div
//               key={idx}
//               className="p-5 bg-white/60 rounded-xl shadow-md border border-teal-100 hover:bg-white/70 transition text-center"
//               initial="hidden"
//               whileInView="visible"
//               viewport={{ once: true }}
//               variants={fadeInUp}
//             >
//               <p className="italic text-gray-600 mb-3">“{t.feedback}”</p>
//               <h4 className="font-semibold text-teal-800">– {t.name}</h4>
//             </motion.div>
//           ))}
//         </div>
//       </section>

//       {/* ✅ FAQ Section */}
//       <section className="py-16 px-6 max-w-4xl mx-auto">
//         <motion.h2
//           className="text-3xl font-bold text-center mb-10 text-teal-800"
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true }}
//           variants={fadeInUp}
//         >
//           Frequently Asked Questions
//         </motion.h2>
//         <div className="space-y-4">
//           {[{
//               q: "Is this platform free to use?",
//               a: "Yes, basic features are completely free. Premium features may be added later.",
//             },
//             {
//               q: "Can I practice multiple times?",
//               a: "Of course! You can take unlimited mock interviews to sharpen your skills.",
//             },
//             {
//               q: "Do I need to upload my resume?",
//               a: "It's optional but recommended for personalized interview questions.",
//             }].map((faq, idx) => (
//             <motion.div
//               key={idx}
//               className="bg-white/60 p-4 rounded-lg shadow border border-teal-100"
//               initial="hidden"
//               whileInView="visible"
//               viewport={{ once: true }}
//               variants={fadeInUp}
//             >
//               <h4 className="font-semibold text-teal-800">{faq.q}</h4>
//               <p className="text-gray-600 mt-1">{faq.a}</p>
//             </motion.div>
//           ))}
//         </div>
//       </section>

//       {/* ✅ Footer */}
//       <footer className="bg-transparent text-gray-600 text-center py-6 mt-auto border-t border-teal-100">
//         <p>© {new Date().getFullYear()} Interview Companion. All rights reserved.</p>
//         <div className="mt-2 space-x-4">
//           <Link to="/about" className="hover:text-teal-600">About</Link>
//           <Link to="/contact" className="hover:text-teal-600">Contact</Link>
//           <Link to="/privacy" className="hover:text-teal-600">Privacy Policy</Link>
//         </div>
//       </footer>

//       {showScrollTop && (
//         <motion.button
//           onClick={scrollToTop}
//           className="fixed bottom-6 right-6 bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-300 hover:to-cyan-400 text-white p-3 rounded-full shadow-lg transition z-50"
//           initial={{ opacity: 0, scale: 0.5 }}
//           animate={{ opacity: 1, scale: 1 }}
//           exit={{ opacity: 0 }}
//           aria-label="Scroll to top"
//         >
//           <ArrowUp className="w-5 h-5" />
//         </motion.button>
//       )}
//     </div>
//   );
// }



// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUp,
  FileText,
  Brain,
  BriefcaseBusiness,
  MessageSquareText,
  ChartNoAxesColumn,
  CheckCircle2,
} from "lucide-react";

const MotionSection = motion.section;
const MotionDiv = motion.div;
const MotionButton = motion.button;

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const features = [
  {
    title: "Resume-Based Interview Prep",
    description:
      "Upload your resume and get questions shaped around your skills, projects, and target role instead of generic practice sets.",
    icon: FileText,
  },
  {
    title: "Multi-Round Simulation",
    description:
      "Practice technical, managerial, and HR rounds in one workflow so your preparation feels closer to a real hiring process.",
    icon: Brain,
  },
  {
    title: "Instant AI Feedback",
    description:
      "Get immediate feedback on every response with suggestions to improve clarity, structure, and interview confidence.",
    icon: MessageSquareText,
  },
  {
    title: "Role-Focused Preparation",
    description:
      "Prepare for frontend, backend, full stack, data, and other paths with questions aligned to the role you want.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Track Improvement",
    description:
      "Review match scores, missing keywords, and progress over time so each practice session leads to measurable improvement.",
    icon: ChartNoAxesColumn,
  },
  {
    title: "Practical Interview Flow",
    description:
      "Move from resume upload to analysis to live interview rounds in a product flow designed to mirror real candidate preparation.",
    icon: CheckCircle2,
  },
];

const steps = [
  {
    number: "01",
    title: "Upload your resume",
    description:
      "Start with your current resume to generate more relevant analysis and interview questions.",
  },
  {
    number: "02",
    title: "Choose your target role",
    description:
      "Pick the role you are preparing for so the platform can tailor questions and feedback.",
  },
  {
    number: "03",
    title: "Practice real interview rounds",
    description:
      "Go through technical, managerial, and HR rounds with structured AI-driven prompts.",
  },
  {
    number: "04",
    title: "Review feedback and improve",
    description:
      "Use match score, missing keywords, and answer feedback to refine your next attempt.",
  },
];

const testimonials = [
  {
    name: "Arjun",
    role: "Frontend Candidate",
    feedback:
      "The questions felt much closer to what I faced in real interviews because they were aligned with my resume and target role.",
  },
  {
    name: "Sneha",
    role: "Campus Placement Student",
    feedback:
      "The feedback after every answer helped me improve how I explained projects and technical decisions, not just memorize responses.",
  },
  {
    name: "Ravi",
    role: "Backend Aspirant",
    feedback:
      "The full flow from resume review to mock interview made preparation feel structured and realistic instead of random practice.",
  },
];

const faqs = [
  {
    q: "Is this platform free to use?",
    a: "Yes, the current experience is available for practice and portfolio use. Premium features can always be added later.",
  },
  {
    q: "Can I practice multiple times?",
    a: "Yes. Repeating rounds is one of the best ways to improve confidence and answer quality over time.",
  },
  {
    q: "Do I need to upload my resume?",
    a: "It is optional, but uploading it makes the interview flow more personalized and realistic.",
  },
];

export default function Home() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.14),_transparent_28%),linear-gradient(180deg,_#f8fbff_0%,_#eef4ff_52%,_#f8fbff_100%)] text-slate-800 scroll-smooth">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/75 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
          <div>
            <div className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
              Interview Companion
            </div>
            <p className="text-sm text-slate-500 mt-1 hidden md:block">
              AI-guided interview preparation with resume-aware feedback
            </p>
          </div>

          <nav className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition shadow-sm"
            >
              Start Free
            </Link>
          </nav>
        </div>
      </header>

      <MotionSection
        className="max-w-7xl mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-14 w-full"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-4 py-2 text-sm text-teal-700 shadow-sm mb-6">
              <span className="h-2 w-2 rounded-full bg-teal-500" />
              Built for real interview preparation
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight text-slate-900">
              AI mock interviews that feel closer to the real hiring process
            </h1>

            <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-2xl leading-8">
              Upload your resume, choose your target role, and practice
              technical, managerial, and HR rounds with feedback designed to
              help you improve after every attempt.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/signup"
                className="px-7 py-3.5 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition shadow-lg shadow-teal-200"
              >
                Start Free Practice
              </Link>
              <a
                href="#how-it-works"
                className="px-7 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold hover:bg-slate-50 transition"
              >
                See How It Works
              </a>
            </div>

            <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { value: "3", label: "Interview rounds" },
                { value: "AI", label: "Instant feedback" },
                { value: "Role-based", label: "Question flow" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-slate-200 bg-white/85 p-4 shadow-sm"
                >
                  <div className="text-2xl font-bold text-slate-900">
                    {item.value}
                  </div>
                  <div className="text-sm text-slate-500 mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <MotionDiv
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-teal-200/40 via-cyan-200/30 to-blue-200/40 blur-3xl rounded-[2rem]" />
            <div className="relative rounded-[2rem] border border-slate-200 bg-white/90 backdrop-blur-xl p-6 md:p-7 shadow-2xl shadow-slate-200/70">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-slate-500">Live Interview Preview</p>
                  <h3 className="text-xl font-semibold text-slate-900 mt-1">
                    Frontend Engineer
                  </h3>
                </div>
                <span className="rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium px-3 py-1">
                  Match Score 84%
                </span>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">
                    Resume Insight
                  </p>
                  <p className="text-slate-700">
                    Strong React foundation detected. Add clearer performance and
                    state-management examples to strengthen your profile.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-900 text-white p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">
                    Interview Question
                  </p>
                  <p className="leading-7">
                    How would you optimize a React application that is slowing
                    down because of unnecessary re-renders?
                  </p>
                </div>

                <div className="rounded-2xl bg-teal-50 border border-teal-100 p-4">
                  <p className="text-xs uppercase tracking-wide text-teal-700 mb-2">
                    AI Feedback
                  </p>
                  <p className="text-slate-700">
                    Good direction. Improve by explaining profiling, memoization
                    strategy, component boundaries, and real examples from your
                    projects.
                  </p>
                </div>
              </div>
            </div>
          </MotionDiv>
        </div>
      </MotionSection>

      <section id="how-it-works" className="max-w-7xl mx-auto px-6 md:px-10 py-14 w-full">
        <MotionDiv initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
          <div className="text-center mb-12">
            <p className="text-sm font-semibold tracking-[0.18em] uppercase text-teal-600 mb-3">
              How It Works
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900">
              A realistic workflow, not random practice
            </h2>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-sm hover:shadow-lg transition"
              >
                <div className="text-sm font-bold text-teal-600 mb-4">{step.number}</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-600 leading-7">{step.description}</p>
              </div>
            ))}
          </div>
        </MotionDiv>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-10 py-14 w-full">
        <MotionDiv initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
          <div className="text-center mb-12">
            <p className="text-sm font-semibold tracking-[0.18em] uppercase text-teal-600 mb-3">
              Core Features
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900">
              Built for serious interview preparation
            </h2>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-7">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <MotionDiv
                  key={feature.title}
                  className="rounded-3xl border border-slate-200 bg-white/90 p-7 shadow-sm hover:-translate-y-1 hover:shadow-xl transition"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                >
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-5">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-7">{feature.description}</p>
                </MotionDiv>
              );
            })}
          </div>
        </MotionDiv>
      </section>

      <section className="py-14 px-6 md:px-10">
        <MotionDiv
          className="max-w-7xl mx-auto rounded-[2rem] border border-slate-200 bg-slate-900 text-white p-8 md:p-12 shadow-2xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] uppercase text-teal-300 mb-3">
                Why It Feels Real
              </p>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                Practice the way candidates actually prepare
              </h2>
              <p className="mt-5 text-slate-300 text-lg leading-8">
                Most interview tools stop at question lists. Interview Companion
                connects resume analysis, role selection, structured rounds, and
                AI feedback into one preparation flow.
              </p>
            </div>

            <div className="grid gap-4">
              {[
                "Resume-driven question generation",
                "Technical, managerial, and HR rounds",
                "Immediate answer feedback after each response",
                "Cleaner preparation flow for students and job seekers",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-slate-100"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </MotionDiv>
      </section>

      <section className="py-14 px-6 md:px-10">
        <MotionDiv
          className="max-w-7xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div className="text-center mb-12">
            <p className="text-sm font-semibold tracking-[0.18em] uppercase text-teal-600 mb-3">
              Testimonials
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900">
              What Users Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <MotionDiv
                key={idx}
                className="p-7 bg-white/90 rounded-3xl shadow-sm border border-slate-200 hover:shadow-lg transition"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <p className="italic text-slate-600 text-lg leading-8 mb-6">
                  “{t.feedback}”
                </p>
                <h4 className="font-semibold text-slate-900 text-lg">{t.name}</h4>
                <p className="text-sm text-teal-700 mt-1">{t.role}</p>
              </MotionDiv>
            ))}
          </div>
        </MotionDiv>
      </section>

      <section className="py-14 px-6 md:px-10">
        <MotionDiv
          className="max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div className="text-center mb-10">
            <p className="text-sm font-semibold tracking-[0.18em] uppercase text-teal-600 mb-3">
              FAQ
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-5">
            {faqs.map((faq, idx) => (
              <MotionDiv
                key={idx}
                className="bg-white/90 p-6 rounded-3xl shadow-sm border border-slate-200"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <h4 className="font-semibold text-slate-900 text-xl">{faq.q}</h4>
                <p className="text-slate-600 mt-3 leading-7">{faq.a}</p>
              </MotionDiv>
            ))}
          </div>
        </MotionDiv>
      </section>

      <section className="px-6 md:px-10 pb-16">
        <MotionDiv
          className="max-w-5xl mx-auto text-center rounded-[2rem] border border-teal-100 bg-gradient-to-r from-teal-50 via-white to-cyan-50 p-10 md:p-14 shadow-sm"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900">
            Start preparing with more structure and confidence
          </h2>
          <p className="mt-5 text-slate-600 text-lg max-w-2xl mx-auto leading-8">
            Move from resume upload to real interview practice in one streamlined
            workflow designed for real-world preparation.
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <Link
              to="/signup"
              className="px-7 py-3.5 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
            >
              Create Account
            </Link>
            <Link
              to="/login"
              className="px-7 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold hover:bg-slate-50 transition"
            >
              Login
            </Link>
          </div>
        </MotionDiv>
      </section>

      <footer className="text-slate-500 text-center py-8 mt-auto border-t border-slate-200">
        <p>© {new Date().getFullYear()} Interview Companion. All rights reserved.</p>
        <div className="mt-3 space-x-6">
          <Link to="/about" className="hover:text-slate-700">
            About
          </Link>
          <Link to="/contact" className="hover:text-slate-700">
            Contact
          </Link>
          <Link to="/privacy" className="hover:text-slate-700">
            Privacy Policy
          </Link>
        </div>
      </footer>

      {showScrollTop && (
        <MotionButton
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-slate-900 hover:bg-slate-800 text-white p-3 rounded-full shadow-xl transition z-50"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </MotionButton>
      )}
    </div>
  );
}


