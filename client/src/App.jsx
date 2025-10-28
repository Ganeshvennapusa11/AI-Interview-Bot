// src/App.jsx
import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

// 🧩 Layouts and Components
import MainLayout from "./layouts/MainLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ChatBot from "./components/ChatBot.jsx";

// 🏠 Pages
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Interview from "./pages/Interview.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import UploadResume from "./pages/UploadResume.jsx";
import ResumeAnalysis from "./pages/ResumeAnalysis.jsx";
import Profile from "./pages/Profile.jsx";

// 🎯 Rounds / Prep Pages
import TechnicalRound from "./pages/TechnicalRound.jsx";
import ManagerialRound from "./pages/ManagerialRound.jsx";
import HRRound from "./pages/HRRound.jsx";

export default function App() {
  const location = useLocation();

  // ✨ Animation variants for smooth page transitions
  const pageVariants = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -40 },
  };

  const transition = { duration: 0.5, ease: "easeInOut" };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* 🌐 PUBLIC ROUTES */}
        <Route
          path="/home"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={transition}
            >
              <Home />
            </motion.div>
          }
        />

        <Route
          path="/signup"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={transition}
            >
              <Signup />
            </motion.div>
          }
        />

        <Route
          path="/login"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={transition}
            >
              <Login />
            </motion.div>
          }
        />

        {/* 🔒 PROTECTED ROUTES */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* 🧭 Dashboard */}
          <Route
            path="/dashboard"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={transition}
              >
                <Dashboard />
              </motion.div>
            }
          />

          {/* 📤 Resume Upload */}
          <Route
            path="/uploadresume/:title"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={transition}
              >
                <UploadResume />
              </motion.div>
            }
          />

          {/* 📊 Resume Analysis */}
          <Route
            path="/resumeanalysis/:roleTitle"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={transition}
              >
                <ResumeAnalysis />
              </motion.div>
            }
          />

          {/* 🎤 Interview Page */}
          <Route
            path="/interview/:roleTitle"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={transition}
              >
                <Interview />
              </motion.div>
            }
          />

          {/* 💬 ChatBot Page */}
          <Route
            path="/chat"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={transition}
              >
                <ChatBot />
              </motion.div>
            }
          />

          {/* 👤 Profile Page */}
          <Route
            path="/profile"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={transition}
              >
                <Profile />
              </motion.div>
            }
          />

          {/* 🧠 Technical Round */}
          <Route
            path="/technical"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={transition}
              >
                <TechnicalRound />
              </motion.div>
            }
          />

          {/* 💼 Managerial Round */}
          <Route
            path="/managerial"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={transition}
              >
                <ManagerialRound />
              </motion.div>
            }
          />

          {/* ❤️ HR Round */}
          <Route
            path="/hr"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={transition}
              >
                <HRRound />
              </motion.div>
            }
          />
        </Route>

        {/* 🏠 DEFAULT REDIRECT */}
        <Route path="/" element={<Navigate to="/home" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
