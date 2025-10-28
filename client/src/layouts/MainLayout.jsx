// src/layouts/MainLayout.jsx
import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  BarChart2,
  MessageCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  X,
} from "lucide-react";

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const isActive = (path) => location.pathname.startsWith(path);

  const sidebarVariants = {
    expanded: { width: "16rem" },
    collapsed: { width: "5rem" },
  };

  const navItems = [
    { name: "Dashboard", icon: <BarChart2 size={20} />, path: "/dashboard" },
    { name: "Chat", icon: <MessageCircle size={20} />, path: "/chat" },
    { name: "Profile", icon: <User size={20} />, path: "/profile" }, // ✅ Added profile
    { name: "Home", icon: <Home size={20} />, path: "/home" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-800">
      {/* 🧭 Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        animate={isCollapsed ? "collapsed" : "expanded"}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="bg-white shadow-xl flex flex-col justify-between fixed left-0 top-0 bottom-0 z-50 overflow-hidden"
      >
        {/* 🔹 Header */}
        <div>
          <div
            className={`flex items-center justify-between px-4 py-5 border-b border-gray-200 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            {!isCollapsed && (
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xl font-bold text-blue-600 cursor-pointer"
                onClick={() => navigate("/dashboard")}
              >
                Interview Companion
              </motion.h1>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
            >
              {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>

          {/* 🧭 Navigation */}
          <nav className="mt-4 flex flex-col space-y-1">
            {navItems.map((item, idx) => (
              <motion.button
                key={idx}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 ${
                  isActive(item.path)
                    ? "bg-blue-100 text-blue-600 border-r-4 border-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                } ${isCollapsed ? "justify-center" : ""}`}
              >
                {item.icon}
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </nav>
        </div>

        {/* 🔻 Logout Button */}
        <div className="border-t border-gray-200 mb-4">
          <motion.button
            onClick={() => setShowLogoutConfirm(true)}
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-200 w-full ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <LogOut size={20} />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.aside>

      {/* 🧩 Main Section */}
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`flex-1 min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 overflow-y-auto ${
          isCollapsed ? "ml-20" : "ml-64"
        } transition-all duration-500`}
      >
        <div className="p-8">
          <Outlet />
        </div>

        <footer className="text-center py-4 text-sm text-gray-500">
          © {new Date().getFullYear()} Interview Companion. All rights reserved.
        </footer>
      </motion.main>

      {/* ⚡ Logout Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-[100]"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-2xl p-8 w-80 text-center"
            >
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Confirm Logout
              </h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to log out?
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
