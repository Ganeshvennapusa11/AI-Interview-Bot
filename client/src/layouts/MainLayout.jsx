// // src/layouts/MainLayout.jsx
// import React, { useState } from "react";
// import { Outlet, useNavigate, useLocation } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Home,
//   BarChart2,
//   MessageCircle,
//   LogOut,
//   ChevronLeft,
//   ChevronRight,
//   User,
//   X,
// } from "lucide-react";

// // ✅ Correct relative import
// import AnoAI from "../components/ui/animated-shader-background";

// export default function MainLayout() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

//   const handleLogout = () => {
//     localStorage.removeItem("authToken");
//     navigate("/login");
//   };

//   const isActive = (path) => location.pathname.startsWith(path);

//   const sidebarVariants = {
//     expanded: { width: "16rem" },
//     collapsed: { width: "5rem" },
//   };

//   const navItems = [
//     { name: "Dashboard", icon: <BarChart2 size={20} />, path: "/dashboard" },
//     { name: "Chat", icon: <MessageCircle size={20} />, path: "/chat" },
//     { name: "Profile", icon: <User size={20} />, path: "/profile" },
//     { name: "Home", icon: <Home size={20} />, path: "/home" },
//   ];

//   return (
//     <div className="relative min-h-screen flex text-gray-100 overflow-hidden">

//       {/* 🌌 BACKGROUND (behind everything, no click blocking) */}
//       <div className="fixed inset-0 -z-10 pointer-events-none">
//         <AnoAI />
//       </div>

//       {/* 🧭 SIDEBAR */}
//       <motion.aside
//         variants={sidebarVariants}
//         animate={isCollapsed ? "collapsed" : "expanded"}
//         transition={{ duration: 0.4, ease: "easeInOut" }}
//         className="fixed left-0 top-0 bottom-0 z-40 flex flex-col justify-between
//                    bg-black/30 backdrop-blur-xl border-r border-white/10 shadow-2xl"
//       >
//         <div>
//           {/* Header */}
//           <div
//             className={`flex items-center justify-between px-4 py-5 border-b border-white/10 ${
//               isCollapsed ? "justify-center" : ""
//             }`}
//           >
//             {!isCollapsed && (
//               <motion.h1
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="text-xl font-bold text-blue-400 cursor-pointer"
//                 onClick={() => navigate("/dashboard")}
//               >
//                 Interview Companion
//               </motion.h1>
//             )}
//             <button
//               onClick={() => setIsCollapsed(!isCollapsed)}
//               className="p-2 rounded-md hover:bg-white/10 text-gray-300"
//             >
//               {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
//             </button>
//           </div>

//           {/* Navigation */}
//           <nav className="mt-4 flex flex-col space-y-1 px-2">
//             {navItems.map((item, idx) => (
//               <motion.button
//                 key={idx}
//                 onClick={() => navigate(item.path)}
//                 className={`flex items-center gap-3 px-4 py-3 text-sm rounded-md transition-all ${
//                   isActive(item.path)
//                     ? "bg-blue-500/20 text-blue-300 border-r-2 border-blue-400"
//                     : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
//                 } ${isCollapsed ? "justify-center" : ""}`}
//               >
//                 {item.icon}
//                 <AnimatePresence>
//                   {!isCollapsed && (
//                     <motion.span
//                       initial={{ opacity: 0, x: -10 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       exit={{ opacity: 0, x: -10 }}
//                     >
//                       {item.name}
//                     </motion.span>
//                   )}
//                 </AnimatePresence>
//               </motion.button>
//             ))}
//           </nav>
//         </div>

//         {/* Logout */}
//         <div className="border-t border-white/10 m-2 pt-2">
//           <motion.button
//             onClick={() => setShowLogoutConfirm(true)}
//             className={`flex items-center gap-3 px-4 py-3 text-sm text-red-400
//                         hover:bg-red-500/10 rounded-md w-full ${
//                           isCollapsed ? "justify-center" : ""
//                         }`}
//           >
//             <LogOut size={20} />
//             <AnimatePresence>
//               {!isCollapsed && <motion.span>Logout</motion.span>}
//             </AnimatePresence>
//           </motion.button>
//         </div>
//       </motion.aside>

//       {/* 🧩 MAIN CONTENT */}
//       <motion.main
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.4 }}
//         className={`flex-1 min-h-screen overflow-y-auto relative z-10
//                     backdrop-blur-md bg-black/40 ${
//                       isCollapsed ? "ml-20" : "ml-64"
//                     } transition-all duration-500`}
//       >
//         <div className="p-8">
//           <Outlet />
//         </div>

//         <footer className="text-center py-4 text-sm text-gray-400">
//           © {new Date().getFullYear()} Interview Companion. All rights reserved.
//         </footer>
//       </motion.main>

//       {/* ⚠️ LOGOUT MODAL */}
//       <AnimatePresence>
//         {showLogoutConfirm && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
//           >
//             <motion.div
//               initial={{ scale: 0.85, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.85, opacity: 0 }}
//               className="relative bg-gray-900 border border-white/10
//                          rounded-2xl shadow-2xl p-8 w-80 text-center"
//             >
//               <button
//                 onClick={() => setShowLogoutConfirm(false)}
//                 className="absolute top-4 right-4 text-gray-500 hover:text-gray-300"
//               >
//                 <X size={20} />
//               </button>
//               <h2 className="text-lg font-semibold text-white mb-3">
//                 Confirm Logout
//               </h2>
//               <p className="text-gray-400 mb-6">
//                 Are you sure you want to log out?
//               </p>
//               <div className="flex justify-center gap-3">
//                 <button
//                   onClick={() => setShowLogoutConfirm(false)}
//                   className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleLogout}
//                   className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
//                 >
//                   Logout
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }



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
  Map,
  X,
} from "lucide-react";

const MotionAside = motion.aside;
const MotionDiv = motion.div;
const MotionButton = motion.button;
const MotionSpan = motion.span;
const MotionMain = motion.main;

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isActive = (path) => location.pathname.startsWith(path);

  const sidebarVariants = {
    expanded: { width: "17rem" },
    collapsed: { width: "5.5rem" },
  };

  const navItems = [
    { name: "Dashboard", icon: <BarChart2 size={20} />, path: "/dashboard" },
    { name: "Roadmap", icon: <Map size={20} />, path: "/roadmap" },
    { name: "Chat", icon: <MessageCircle size={20} />, path: "/chat" },
    { name: "Profile", icon: <User size={20} />, path: "/profile" },
    { name: "Home", icon: <Home size={20} />, path: "/home" },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.14),_transparent_28%),linear-gradient(180deg,_#f8fbff_0%,_#eef4ff_52%,_#f8fbff_100%)] text-slate-800">
      <MotionAside
        variants={sidebarVariants}
        animate={isCollapsed ? "collapsed" : "expanded"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed left-0 top-0 bottom-0 z-40 flex flex-col justify-between border-r border-slate-200/80 bg-white/75 backdrop-blur-xl shadow-[0_10px_40px_rgba(148,163,184,0.12)]"
      >
        <div>
          <div
            className={`flex items-center justify-between px-5 py-5 border-b border-slate-200/80 ${
              isCollapsed ? "justify-center px-3" : ""
            }`}
          >
            {!isCollapsed && (
              <MotionDiv
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="cursor-pointer"
                onClick={() => navigate("/dashboard")}
              >
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Interview Companion
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  AI-guided interview preparation
                </p>
              </MotionDiv>
            )}

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
            >
              {isCollapsed ? (
                <ChevronRight size={20} />
              ) : (
                <ChevronLeft size={20} />
              )}
            </button>
          </div>

          <nav className="mt-5 flex flex-col gap-2 px-3">
            {navItems.map((item, idx) => (
              <MotionButton
                key={idx}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                  isActive(item.path)
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-white/80 hover:text-slate-900"
                } ${isCollapsed ? "justify-center px-3" : ""}`}
              >
                {item.icon}
                <AnimatePresence>
                  {!isCollapsed && (
                    <MotionSpan
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                    >
                      {item.name}
                    </MotionSpan>
                  )}
                </AnimatePresence>
              </MotionButton>
            ))}
          </nav>
        </div>

        <div className="border-t border-slate-200/80 m-3 pt-3">
          <MotionButton
            onClick={() => setShowLogoutConfirm(true)}
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium text-rose-500 hover:bg-rose-50 rounded-2xl w-full transition ${
              isCollapsed ? "justify-center px-3" : ""
            }`}
          >
            <LogOut size={20} />
            <AnimatePresence>
              {!isCollapsed && <MotionSpan>Logout</MotionSpan>}
            </AnimatePresence>
          </MotionButton>
        </div>
      </MotionAside>

      <MotionMain
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`min-h-screen transition-all duration-500 ${
          isCollapsed ? "ml-[5.5rem]" : "ml-[17rem]"
        }`}
      >
        <div className="p-6 md:p-8">
          <Outlet />
        </div>

        <footer className="border-t border-slate-200/80 text-center py-6 text-sm text-slate-500">
          © {new Date().getFullYear()} Interview Companion. All rights reserved.
        </footer>
      </MotionMain>

      <AnimatePresence>
        {showLogoutConfirm && (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/35 backdrop-blur-sm flex items-center justify-center"
          >
            <MotionDiv
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              className="relative w-[22rem] rounded-[1.75rem] border border-slate-200 bg-white p-8 text-center shadow-2xl"
            >
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
              >
                <X size={20} />
              </button>

              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                Confirm Logout
              </h2>
              <p className="text-slate-500 mb-6">
                Are you sure you want to log out?
              </p>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white transition"
                >
                  Logout
                </button>
              </div>
            </MotionDiv>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
}
