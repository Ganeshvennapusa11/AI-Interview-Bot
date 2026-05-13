import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import MainLayout from "./layouts/MainLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ChatBot from "./components/ChatBot.jsx";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import UploadResume from "./pages/UploadResume.jsx";
import Profile from "./pages/Profile.jsx";
import InterviewSession from "./pages/InterviewSession.jsx";
import PreparationRoadmap from "./pages/PreparationRoadmap.jsx";

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chat" element={<ChatBot />} />
          <Route path="/roadmap" element={<PreparationRoadmap />} />
          <Route path="/roadmap/:roleId" element={<PreparationRoadmap />} />
          <Route path="/uploadresume" element={<UploadResume />} />
          <Route path="/uploadresume/:title" element={<UploadResume />} />
          <Route
            path="/interview-session"
            element={<InterviewSession />}
          />
          <Route
            path="/interview-session/:roundType"
            element={<InterviewSession />}
          />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}
