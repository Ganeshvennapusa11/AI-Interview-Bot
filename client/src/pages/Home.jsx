// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Home() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 text-gray-800 scroll-smooth">
      {/* ✅ Navbar */}
      <header className="flex justify-between items-center px-6 md:px-12 py-5 shadow bg-transparent backdrop-blur-md sticky top-0 z-50">
        <div className="text-2xl font-bold tracking-wide text-teal-800">
          Interview Companion
        </div>
        <nav className="space-x-3 md:space-x-4">
          <Link
            to="/login"
            className="px-4 py-2 rounded border border-teal-300 text-teal-700 hover:bg-teal-300 hover:text-white transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 rounded bg-gradient-to-r from-teal-400 to-cyan-500 text-white font-medium hover:from-teal-300 hover:to-cyan-400 transition"
          >
            Sign Up
          </Link>
        </nav>
      </header>

      {/* ✅ Hero Section */}
      <motion.section
        className="flex flex-col items-center text-center px-6 py-20 bg-gradient-to-r from-white/0 to-white/0 rounded-b-3xl shadow-inner"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-teal-800">
          Prepare Smarter. Interview Better.
        </h1>
        <p className="text-lg max-w-2xl text-gray-600 mb-8">
          Practice interviews, upload resumes, and get tailored guidance for your dream job.
          Your one-stop platform to improve your interview confidence.
        </p>
        <Link
          to="/signup"
          className="px-8 py-3 bg-gradient-to-r from-teal-400 to-cyan-500 text-white font-semibold rounded-lg shadow hover:from-teal-300 hover:to-cyan-400 transition"
        >
          Get Started
        </Link>
      </motion.section>

      {/* ✅ Features Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <motion.h2
          className="text-3xl font-bold text-center mb-12 text-teal-800"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          Platform Highlights
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[ ...Array(3) ].map((_, idx) => (
            <motion.div
              key={idx}
              className="p-6 rounded-xl shadow-md bg-white/60 hover:bg-white/70 transition border border-teal-100"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h3 className="text-xl font-semibold mb-3 text-teal-800">
                Feature Title
              </h3>
              <p className="text-gray-600">Feature description goes here.</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ✅ Testimonials Section */}
      <section className="bg-transparent py-16 px-6">
        <motion.h2
          className="text-3xl font-bold text-center mb-12 text-teal-800"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          What Users Say
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[{
              name: "Arjun",
              feedback: "The mock interview feature boosted my confidence tremendously!"
            },{
              name: "Sneha",
              feedback: "I loved the resume feedback — it helped me land my first job."
            },{
              name: "Ravi",
              feedback: "The interface is clean and the insights are super useful. Highly recommend!"
            }].map((t, idx) => (
            <motion.div
              key={idx}
              className="p-5 bg-white/60 rounded-xl shadow-md border border-teal-100 hover:bg-white/70 transition text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <p className="italic text-gray-600 mb-3">“{t.feedback}”</p>
              <h4 className="font-semibold text-teal-800">– {t.name}</h4>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ✅ FAQ Section */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <motion.h2
          className="text-3xl font-bold text-center mb-10 text-teal-800"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          Frequently Asked Questions
        </motion.h2>
        <div className="space-y-4">
          {[{
              q: "Is this platform free to use?",
              a: "Yes, basic features are completely free. Premium features may be added later.",
            },
            {
              q: "Can I practice multiple times?",
              a: "Of course! You can take unlimited mock interviews to sharpen your skills.",
            },
            {
              q: "Do I need to upload my resume?",
              a: "It's optional but recommended for personalized interview questions.",
            }].map((faq, idx) => (
            <motion.div
              key={idx}
              className="bg-white/60 p-4 rounded-lg shadow border border-teal-100"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h4 className="font-semibold text-teal-800">{faq.q}</h4>
              <p className="text-gray-600 mt-1">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ✅ Footer */}
      <footer className="bg-transparent text-gray-600 text-center py-6 mt-auto border-t border-teal-100">
        <p>© {new Date().getFullYear()} Interview Companion. All rights reserved.</p>
        <div className="mt-2 space-x-4">
          <Link to="/about" className="hover:text-teal-600">About</Link>
          <Link to="/contact" className="hover:text-teal-600">Contact</Link>
          <Link to="/privacy" className="hover:text-teal-600">Privacy Policy</Link>
        </div>
      </footer>

      {showScrollTop && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-300 hover:to-cyan-400 text-white p-3 rounded-full shadow-lg transition z-50"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </div>
  );
}
