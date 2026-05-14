// // // import React, { useState, useEffect } from "react";
// // // import { Eye, EyeOff } from "lucide-react";
// // // import { useNavigate } from "react-router-dom";
// // // import { motion } from "framer-motion";
// // // import Particles from "react-tsparticles";
// // // import { loadFull } from "tsparticles";
// // // import {
// // //   signInWithGoogle,
// // //   signInWithFacebook,
// // //   signInWithApple,
// // // } from "../firebase";
// // // import { loginUser } from "../services/api";

// // // export default function Login() {
// // //   const [showPassword, setShowPassword] = useState(false);
// // //   const [email, setEmail] = useState("");
// // //   const [password, setPassword] = useState("");
// // //   const [error, setError] = useState("");
// // //   const [isSubmitting, setIsSubmitting] = useState(false);
// // //   const navigate = useNavigate();

// // //   useEffect(() => {
// // //     if (localStorage.getItem("authToken")) {
// // //       navigate("/dashboard");
// // //     }
// // //   }, [navigate]);

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     setError("");
// // //     setIsSubmitting(true);

// // //     try {
// // //       const data = await loginUser({ email, password });
// // //       localStorage.setItem("authToken", data.token);
// // //       localStorage.setItem("user", JSON.stringify(data.user));
// // //       navigate("/dashboard");
// // //     } catch (err) {
// // //       setError(err.response?.data?.message || "Unable to log in.");
// // //     } finally {
// // //       setIsSubmitting(false);
// // //     }
// // //   };

// // //   const handleSocialLogin = async (type) => {
// // //     if (type === "Google") await signInWithGoogle();
// // //     if (type === "Facebook") await signInWithFacebook();
// // //     if (type === "Apple") await signInWithApple();
// // //     setError(`${type} login is not connected to backend auth yet.`);
// // //   };

// // //   return (
// // //     <div className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden bg-gradient-to-br from-teal-50 via-white to-cyan-50">
// // //       <Particles
// // //         className="absolute inset-0 z-0 pointer-events-none"
// // //         init={async (engine) => loadFull(engine)}
// // //         options={{
// // //           particles: {
// // //             color: { value: "#14B8A6" },
// // //             links: { enable: true, color: "#14B8A6", opacity: 0.3 },
// // //             move: { enable: true, speed: 1 },
// // //             number: { value: 60 },
// // //           },
// // //         }}
// // //       />

// // //       <div className="relative z-10 w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-12 grid grid-cols-1 md:grid-cols-2 gap-10">
// // //         <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
// // //           <h2 className="text-3xl font-bold text-teal-700 mb-6">
// // //             Welcome Back
// // //           </h2>

// // //           <form onSubmit={handleSubmit} className="space-y-5">
// // //             <input
// // //               type="email"
// // //               placeholder="Email"
// // //               value={email}
// // //               onChange={(e) => setEmail(e.target.value)}
// // //               className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
// // //             />

// // //             <div className="relative">
// // //               <input
// // //                 type={showPassword ? "text" : "password"}
// // //                 placeholder="Password"
// // //                 value={password}
// // //                 onChange={(e) => setPassword(e.target.value)}
// // //                 className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
// // //               />
// // //               <button
// // //                 type="button"
// // //                 onClick={() => setShowPassword(!showPassword)}
// // //                 className="absolute right-3 top-3 text-gray-500"
// // //               >
// // //                 {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
// // //               </button>
// // //             </div>

// // //             <button
// // //               type="submit"
// // //               disabled={isSubmitting}
// // //               className="w-full py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 disabled:opacity-70"
// // //             >
// // //               {isSubmitting ? "Logging In..." : "Log In"}
// // //             </button>

// // //             {error && <p className="text-sm text-red-600">{error}</p>}
// // //           </form>
// // //         </motion.div>

// // //         <motion.div
// // //           initial={{ x: 30, opacity: 0 }}
// // //           animate={{ x: 0, opacity: 1 }}
// // //           className="flex flex-col justify-center gap-4"
// // //         >
// // //           <h3 className="text-center font-semibold text-gray-700 mb-2">
// // //             Or continue with
// // //           </h3>

// // //           <button
// // //             onClick={() => handleSocialLogin("Google")}
// // //             className="flex items-center gap-3 px-6 py-3 border rounded-xl hover:bg-gray-50 transition"
// // //           >
// // //             <img
// // //               src="https://www.svgrepo.com/show/475656/google-color.svg"
// // //               alt="Google"
// // //               className="w-5 h-5"
// // //             />
// // //             Continue with Google
// // //           </button>

// // //           <button
// // //             onClick={() => handleSocialLogin("Facebook")}
// // //             className="flex items-center gap-3 px-6 py-3 border rounded-xl hover:bg-gray-50 transition"
// // //           >
// // //             <img
// // //               src="https://www.svgrepo.com/show/475647/facebook-color.svg"
// // //               alt="Facebook"
// // //               className="w-5 h-5"
// // //             />
// // //             Continue with Facebook
// // //           </button>

// // //           <button
// // //             onClick={() => handleSocialLogin("Apple")}
// // //             className="flex items-center gap-3 px-6 py-3 border rounded-xl hover:bg-gray-50 transition"
// // //           >
// // //             <svg viewBox="0 0 24 24" className="w-5 h-5" fill="black">
// // //               <path d="M16.365 1.43c0 1.14-.416 2.23-1.187 3.097-.79.88-2.083 1.57-3.197 1.49-.14-1.06.48-2.19 1.24-2.98.79-.83 2.19-1.47 3.144-1.6zM20.62 17.04c-.57 1.3-.84 1.87-1.58 3.03-1.04 1.61-2.5 3.62-4.32 3.64-1.62.02-2.04-1.05-4.2-1.03-2.17.01-2.64 1.05-4.26 1.02-1.82-.02-3.22-1.82-4.26-3.42-2.9-4.46-3.2-9.68-1.41-12.46 1.27-1.98 3.28-3.14 5.18-3.14 1.94 0 3.16 1.05 4.76 1.05 1.56 0 2.5-1.06 4.74-1.06 1.7 0 3.5.93 4.76 2.54-4.19 2.3-3.51 8.24.99 10.78z" />
// // //             </svg>
// // //             Continue with Apple
// // //           </button>
// // //         </motion.div>
// // //       </div>
// // //     </div>
// // //   );
// // // }




// // import React, { useState, useEffect } from "react";
// // import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";
// // import { useNavigate, Link } from "react-router-dom";
// // import { motion } from "framer-motion";
// // import Particles from "react-tsparticles";
// // import { loadFull } from "tsparticles";
// // import {
// //   signInWithGoogle,
// //   signInWithFacebook,
// //   signInWithApple,
// // } from "../firebase";
// // import { loginUser } from "../services/api";

// // export default function Login() {
// //   const [showPassword, setShowPassword] = useState(false);
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [errors, setErrors] = useState({});
// //   const [error, setError] = useState("");
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [socialLoading, setSocialLoading] = useState("");
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     if (localStorage.getItem("authToken")) {
// //       navigate("/dashboard");
// //     }
// //   }, [navigate]);

// //   const validateForm = () => {
// //     const nextErrors = {};

// //     if (!email.trim()) {
// //       nextErrors.email = "Email is required.";
// //     } else if (!/^\S+@\S+\.\S+$/.test(email)) {
// //       nextErrors.email = "Enter a valid email address.";
// //     }

// //     if (!password.trim()) {
// //       nextErrors.password = "Password is required.";
// //     } else if (password.length < 8) {
// //       nextErrors.password = "Password must be at least 8 characters.";
// //     }

// //     setErrors(nextErrors);
// //     return Object.keys(nextErrors).length === 0;
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setError("");

// //     if (!validateForm()) return;

// //     setIsSubmitting(true);

// //     try {
// //       const data = await loginUser({ email, password });
// //       localStorage.setItem("authToken", data.token);
// //       localStorage.setItem("user", JSON.stringify(data.user));
// //       navigate("/dashboard");
// //     } catch (err) {
// //       setError(err.response?.data?.message || "Unable to log in.");
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   const handleSocialLogin = async (type) => {
// //     setError("");
// //     setSocialLoading(type);

// //     try {
// //       if (type === "Google") {
// //         const result = await signInWithGoogle();
// //         setError(
// //           result?.user?.email
// //             ? `Google account selected: ${result.user.email}. Backend social login is not connected yet.`
// //             : "Google login completed, but backend social login is not connected yet."
// //         );
// //       }

// //       if (type === "Facebook") {
// //         await signInWithFacebook();
// //         setError("Facebook login is not connected to backend auth yet.");
// //       }

// //       if (type === "Apple") {
// //         await signInWithApple();
// //         setError("Apple login is not connected to backend auth yet.");
// //       }
// //     } catch (err) {
// //       setError(err.message || `${type} sign-in failed.`);
// //     } finally {
// //       setSocialLoading("");
// //     }
// //   };

// //   return (
// //     <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.14),_transparent_28%),linear-gradient(180deg,_#f8fbff_0%,_#eef4ff_52%,_#f8fbff_100%)]">
// //       <Particles
// //         className="absolute inset-0 z-0 pointer-events-none"
// //         init={async (engine) => loadFull(engine)}
// //         options={{
// //           particles: {
// //             color: { value: "#14B8A6" },
// //             links: {
// //               enable: true,
// //               color: "#14B8A6",
// //               opacity: 0.2,
// //               distance: 130,
// //             },
// //             move: { enable: true, speed: 1 },
// //             number: { value: 55 },
// //             opacity: { value: 0.35 },
// //             size: { value: { min: 1, max: 3 } },
// //           },
// //         }}
// //       />

// //       <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
// //         <motion.div
// //           initial={{ opacity: 0, y: 24 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           transition={{ duration: 0.55 }}
// //           className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/75 shadow-[0_25px_80px_rgba(148,163,184,0.2)] backdrop-blur-xl md:grid-cols-2"
// //         >
// //           <div className="hidden md:flex flex-col justify-between border-r border-slate-200/80 bg-white/45 p-10">
// //             <div>
// //               <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-4 py-2 text-sm text-teal-700 shadow-sm">
// //                 <span className="h-2 w-2 rounded-full bg-teal-500" />
// //                 Interview Companion
// //               </div>

// //               <h1 className="mt-8 text-4xl font-bold leading-tight tracking-tight text-slate-900">
// //                 Step back into interview prep with clarity and structure
// //               </h1>

// //               <p className="mt-5 text-base leading-7 text-slate-600">
// //                 Practice role-based interviews, review AI feedback, and build
// //                 confidence with a workflow that feels closer to real preparation.
// //               </p>
// //             </div>

// //             <div className="mt-10 space-y-4">
// //               {[
// //                 "Resume-aware preparation flow",
// //                 "Technical, managerial, and HR rounds",
// //                 "Cleaner feedback after every response",
// //               ].map((item) => (
// //                 <div
// //                   key={item}
// //                   className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-700 shadow-sm"
// //                 >
// //                   {item}
// //                 </div>
// //               ))}
// //             </div>
// //           </div>

// //           <div className="p-6 sm:p-8 md:p-10">
// //             <div className="mx-auto w-full max-w-md">
// //               <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
// //               <p className="mt-2 text-sm leading-6 text-slate-500">
// //                 Log in to continue your interview preparation journey.
// //               </p>

// //               <form onSubmit={handleSubmit} className="mt-8 space-y-5">
// //                 <div>
// //                   <label className="mb-2 block text-sm font-semibold text-slate-700">
// //                     Email Address
// //                   </label>
// //                   <div className="relative">
// //                     <Mail
// //                       size={18}
// //                       className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
// //                     />
// //                     <input
// //                       type="email"
// //                       autoComplete="email"
// //                       inputMode="email"
// //                       placeholder="john@example.com"
// //                       value={email}
// //                       onChange={(e) => {
// //                         setEmail(e.target.value);
// //                         setErrors((prev) => ({ ...prev, email: "" }));
// //                       }}
// //                       className="w-full rounded-2xl border border-slate-300 bg-white/85 py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-200"
// //                     />
// //                   </div>
// //                   {errors.email && (
// //                     <p className="mt-2 text-sm text-red-500">{errors.email}</p>
// //                   )}
// //                 </div>

// //                 <div>
// //                   <label className="mb-2 block text-sm font-semibold text-slate-700">
// //                     Password
// //                   </label>
// //                   <div className="relative">
// //                     <Lock
// //                       size={18}
// //                       className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
// //                     />
// //                     <input
// //                       type={showPassword ? "text" : "password"}
// //                       autoComplete="current-password"
// //                       placeholder="Enter your password"
// //                       value={password}
// //                       onChange={(e) => {
// //                         setPassword(e.target.value);
// //                         setErrors((prev) => ({ ...prev, password: "" }));
// //                       }}
// //                       className="w-full rounded-2xl border border-slate-300 bg-white/85 py-3 pl-11 pr-12 text-slate-900 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-200"
// //                     />
// //                     <button
// //                       type="button"
// //                       onClick={() => setShowPassword(!showPassword)}
// //                       className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
// //                     >
// //                       {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
// //                     </button>
// //                   </div>
// //                   {errors.password && (
// //                     <p className="mt-2 text-sm text-red-500">{errors.password}</p>
// //                   )}
// //                 </div>

// //                 {error && (
// //                   <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
// //                     {error}
// //                   </div>
// //                 )}

// //                 <button
// //                   type="submit"
// //                   disabled={isSubmitting}
// //                   className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
// //                 >
// //                   {isSubmitting ? (
// //                     <>
// //                       <Loader2 size={18} className="animate-spin" />
// //                       Logging In...
// //                     </>
// //                   ) : (
// //                     "Log In"
// //                   )}
// //                 </button>
// //               </form>

// //               <div className="my-6 flex items-center gap-3">
// //                 <div className="h-px flex-1 bg-slate-200" />
// //                 <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
// //                   or continue with
// //                 </span>
// //                 <div className="h-px flex-1 bg-slate-200" />
// //               </div>

// //               <div className="space-y-3">
// //                 <button
// //                   type="button"
// //                   onClick={() => handleSocialLogin("Google")}
// //                   disabled={socialLoading !== ""}
// //                   className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-700 transition hover:bg-slate-50 disabled:opacity-70"
// //                 >
// //                   {socialLoading === "Google" ? (
// //                     <Loader2 size={18} className="animate-spin" />
// //                   ) : (
// //                     <img
// //                       src="https://www.svgrepo.com/show/475656/google-color.svg"
// //                       alt="Google"
// //                       className="h-5 w-5"
// //                     />
// //                   )}
// //                   <span className="font-medium">Continue with Google</span>
// //                 </button>

// //                 <button
// //                   type="button"
// //                   onClick={() => handleSocialLogin("Facebook")}
// //                   disabled={socialLoading !== ""}
// //                   className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-700 transition hover:bg-slate-50 disabled:opacity-70"
// //                 >
// //                   {socialLoading === "Facebook" ? (
// //                     <Loader2 size={18} className="animate-spin" />
// //                   ) : (
// //                     <img
// //                       src="https://www.svgrepo.com/show/475647/facebook-color.svg"
// //                       alt="Facebook"
// //                       className="h-5 w-5"
// //                     />
// //                   )}
// //                   <span className="font-medium">Continue with Facebook</span>
// //                 </button>

// //                 <button
// //                   type="button"
// //                   onClick={() => handleSocialLogin("Apple")}
// //                   disabled={socialLoading !== ""}
// //                   className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-700 transition hover:bg-slate-50 disabled:opacity-70"
// //                 >
// //                   {socialLoading === "Apple" ? (
// //                     <Loader2 size={18} className="animate-spin" />
// //                   ) : (
// //                     <svg viewBox="0 0 24 24" className="h-5 w-5" fill="black">
// //                       <path d="M16.365 1.43c0 1.14-.416 2.23-1.187 3.097-.79.88-2.083 1.57-3.197 1.49-.14-1.06.48-2.19 1.24-2.98.79-.83 2.19-1.47 3.144-1.6zM20.62 17.04c-.57 1.3-.84 1.87-1.58 3.03-1.04 1.61-2.5 3.62-4.32 3.64-1.62.02-2.04-1.05-4.2-1.03-2.17.01-2.64 1.05-4.26 1.02-1.82-.02-3.22-1.82-4.26-3.42-2.9-4.46-3.2-9.68-1.41-12.46 1.27-1.98 3.28-3.14 5.18-3.14 1.94 0 3.16 1.05 4.76 1.05 1.56 0 2.5-1.06 4.74-1.06 1.7 0 3.5.93 4.76 2.54-4.19 2.3-3.51 8.24.99 10.78z" />
// //                     </svg>
// //                   )}
// //                   <span className="font-medium">Continue with Apple</span>
// //                 </button>
// //               </div>

// //               <p className="mt-6 text-center text-sm text-slate-500">
// //                 Don&apos;t have an account?{" "}
// //                 <Link to="/signup" className="font-semibold text-teal-700 hover:underline">
// //                   Sign Up
// //                 </Link>
// //               </p>
// //             </div>
// //           </div>
// //         </motion.div>
// //       </div>
// //     </div>
// //   );
// // }



// import React, { useState, useEffect } from "react";
// import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";
// import { useNavigate, Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import Particles from "react-tsparticles";
// import { loadFull } from "tsparticles";
// import {
//   signInWithGoogle,
//   signInWithFacebook,
//   signInWithApple,
// } from "../firebase";
// import { loginUser } from "../services/api";

// export default function Login() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errors, setErrors] = useState({});
//   const [error, setError] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [socialLoading, setSocialLoading] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (localStorage.getItem("authToken")) {
//       navigate("/dashboard");
//     }
//   }, [navigate]);

//   const validateForm = () => {
//     const nextErrors = {};

//     if (!email.trim()) {
//       nextErrors.email = "Email is required.";
//     } else if (!/^\S+@\S+\.\S+$/.test(email)) {
//       nextErrors.email = "Enter a valid email address.";
//     }

//     if (!password.trim()) {
//       nextErrors.password = "Password is required.";
//     } else if (password.length < 8) {
//       nextErrors.password = "Password must be at least 8 characters.";
//     }

//     setErrors(nextErrors);
//     return Object.keys(nextErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!validateForm()) return;

//     setIsSubmitting(true);

//     try {
//       const data = await loginUser({ email, password });
//       localStorage.setItem("authToken", data.token);
//       localStorage.setItem("user", JSON.stringify(data.user));
//       navigate("/dashboard");
//     } catch (err) {
//       setError(err.response?.data?.message || "Unable to log in.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleSocialLogin = async (type) => {
//     setError("");
//     setSocialLoading(type);

//     try {
//       if (type === "Google") {
//         const result = await signInWithGoogle();
//         setError(
//           result?.user?.email
//             ? `Google account selected: ${result.user.email}. Backend social login is not connected yet.`
//             : "Google login completed, but backend social login is not connected yet."
//         );
//       }

//       if (type === "Facebook") {
//         await signInWithFacebook();
//         setError("Facebook login is not connected to backend auth yet.");
//       }

//       if (type === "Apple") {
//         await signInWithApple();
//         setError("Apple login is not connected to backend auth yet.");
//       }
//     } catch (err) {
//       setError(err.message || `${type} sign-in failed.`);
//     } finally {
//       setSocialLoading("");
//     }
//   };

//   return (
//     <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.14),_transparent_28%),linear-gradient(180deg,_#f8fbff_0%,_#eef4ff_52%,_#f8fbff_100%)]">
//       <Particles
//         className="absolute inset-0 z-0 pointer-events-none"
//         init={async (engine) => loadFull(engine)}
//         options={{
//           particles: {
//             color: { value: "#14B8A6" },
//             links: {
//               enable: true,
//               color: "#14B8A6",
//               opacity: 0.2,
//               distance: 130,
//             },
//             move: { enable: true, speed: 1 },
//             number: { value: 55 },
//             opacity: { value: 0.35 },
//             size: { value: { min: 1, max: 3 } },
//           },
//         }}
//       />

//       <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
//         <motion.div
//           initial={{ opacity: 0, y: 24 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.55 }}
//           className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/75 shadow-[0_25px_80px_rgba(148,163,184,0.2)] backdrop-blur-xl md:grid-cols-2"
//         >
//           <div className="p-6 sm:p-8 md:p-10 border-r border-slate-200/80">
//             <div className="mx-auto w-full max-w-md">
//               <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
//               <p className="mt-2 text-sm leading-6 text-slate-500">
//                 Log in to continue your interview preparation journey.
//               </p>

//               <form onSubmit={handleSubmit} className="mt-8 space-y-5">
//                 <div>
//                   <label className="mb-2 block text-sm font-semibold text-slate-700">
//                     Email Address
//                   </label>
//                   <div className="relative">
//                     <Mail
//                       size={18}
//                       className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
//                     />
//                     <input
//                       type="email"
//                       autoComplete="email"
//                       inputMode="email"
//                       placeholder="john@example.com"
//                       value={email}
//                       onChange={(e) => {
//                         setEmail(e.target.value);
//                         setErrors((prev) => ({ ...prev, email: "" }));
//                       }}
//                       className="w-full rounded-2xl border border-slate-300 bg-white/85 py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-200"
//                     />
//                   </div>
//                   {errors.email && (
//                     <p className="mt-2 text-sm text-red-500">{errors.email}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="mb-2 block text-sm font-semibold text-slate-700">
//                     Password
//                   </label>
//                   <div className="relative">
//                     <Lock
//                       size={18}
//                       className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
//                     />
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       autoComplete="current-password"
//                       placeholder="Enter your password"
//                       value={password}
//                       onChange={(e) => {
//                         setPassword(e.target.value);
//                         setErrors((prev) => ({ ...prev, password: "" }));
//                       }}
//                       className="w-full rounded-2xl border border-slate-300 bg-white/85 py-3 pl-11 pr-12 text-slate-900 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-200"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
//                     >
//                       {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                     </button>
//                   </div>
//                   {errors.password && (
//                     <p className="mt-2 text-sm text-red-500">{errors.password}</p>
//                   )}
//                 </div>

//                 {error && (
//                   <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
//                     {error}
//                   </div>
//                 )}

//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <Loader2 size={18} className="animate-spin" />
//                       Logging In...
//                     </>
//                   ) : (
//                     "Log In"
//                   )}
//                 </button>
//               </form>
//             </div>
//           </div>

//           <div className="p-6 sm:p-8 md:p-10">
//             <div className="mx-auto w-full max-w-md flex flex-col justify-center h-full">
//               <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-4 py-2 text-sm text-teal-700 shadow-sm w-fit mb-6">
//                 <span className="h-2 w-2 rounded-full bg-teal-500" />
//                 Interview Companion
//               </div>

//               <h3 className="text-3xl font-bold text-slate-900">
//                 Continue with your account
//               </h3>
//               <p className="mt-3 text-base leading-7 text-slate-600">
//                 Choose your preferred provider to continue quickly.
//               </p>

//               <div className="my-8 flex items-center gap-3">
//                 <div className="h-px flex-1 bg-slate-200" />
//                 <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
//                   social login
//                 </span>
//                 <div className="h-px flex-1 bg-slate-200" />
//               </div>

//               <div className="space-y-3">
//                 <button
//                   type="button"
//                   onClick={() => handleSocialLogin("Google")}
//                   disabled={socialLoading !== ""}
//                   className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-black bg-white px-4 py-3 text-slate-800 transition hover:bg-slate-50 disabled:opacity-70"
//                 >
//                   {socialLoading === "Google" ? (
//                     <Loader2 size={18} className="animate-spin" />
//                   ) : (
//                     <img
//                       src="https://www.svgrepo.com/show/475656/google-color.svg"
//                       alt="Google"
//                       className="h-5 w-5"
//                     />
//                   )}
//                   <span className="font-medium">Continue with Google</span>
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => handleSocialLogin("Facebook")}
//                   disabled={socialLoading !== ""}
//                   //className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-black bg-white px-4 py-3 text-slate-800 transition hover:bg-slate-50 disabled:opacity-70"
//                   className="w-full flex items-center justify-center gap-3 border-2 border-black rounded-2xl py-3 bg-white hover:bg-slate-50 transition disabled:opacity-70 shadow-none"
//                   style={{ borderColor: "#000000" }}

//                 >
//                   {socialLoading === "Facebook" ? (
//                     <Loader2 size={18} className="animate-spin" />
//                   ) : (
//                     <img
//                       src="https://www.svgrepo.com/show/475647/facebook-color.svg"
//                       alt="Facebook"
//                       className="h-5 w-5"
//                     />
//                   )}
//                   <span className="font-medium">Continue with Facebook</span>
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => handleSocialLogin("Apple")}
//                   disabled={socialLoading !== ""}
//                   className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-black bg-white px-4 py-3 text-slate-800 transition hover:bg-slate-50 disabled:opacity-70"
//                 >
//                   {socialLoading === "Apple" ? (
//                     <Loader2 size={18} className="animate-spin" />
//                   ) : (
//                     <svg viewBox="0 0 24 24" className="h-5 w-5" fill="black">
//                       <path d="M16.365 1.43c0 1.14-.416 2.23-1.187 3.097-.79.88-2.083 1.57-3.197 1.49-.14-1.06.48-2.19 1.24-2.98.79-.83 2.19-1.47 3.144-1.6zM20.62 17.04c-.57 1.3-.84 1.87-1.58 3.03-1.04 1.61-2.5 3.62-4.32 3.64-1.62.02-2.04-1.05-4.2-1.03-2.17.01-2.64 1.05-4.26 1.02-1.82-.02-3.22-1.82-4.26-3.42-2.9-4.46-3.2-9.68-1.41-12.46 1.27-1.98 3.28-3.14 5.18-3.14 1.94 0 3.16 1.05 4.76 1.05 1.56 0 2.5-1.06 4.74-1.06 1.7 0 3.5.93 4.76 2.54-4.19 2.3-3.51 8.24.99 10.78z" />
//                     </svg>
//                   )}
//                   <span className="font-medium">Continue with Apple</span>
//                 </button>
//               </div>

//               <p className="mt-6 text-center text-sm text-slate-500">
//                 Don&apos;t have an account?{" "}
//                 <Link
//                   to="/signup"
//                   className="font-semibold text-teal-700 hover:underline"
//                 >
//                   Sign Up
//                 </Link>
//               </p>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
// import {
//   signInWithGoogle,
//   // signInWithFacebook,
//   // signInWithApple,
// } from "../firebase";
import { loginUser, wakeBackend } from "../services/api";

const MotionDiv = motion.div;


export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWakingServer, setIsWakingServer] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  useEffect(() => {
    let isMounted = true;

    setIsWakingServer(true);
    wakeBackend()
      .catch(() => {})
      .finally(() => {
        if (isMounted) {
          setIsWakingServer(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const validateForm = () => {
    const nextErrors = {};

    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!password.trim()) {
      nextErrors.password = "Password is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const data = await loginUser({ email, password });
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Unable to log in.");
    } finally {
      setIsSubmitting(false);
    }
  };

//  const handleSocialLogin = async (type) => {
//   setError("");
//   setSocialLoading(type);

//   try {
//     let result;

//     if (type === "Google") {
//       result = await signInWithGoogle();
//     }

//     if (type === "Facebook") {
//       result = await signInWithFacebook();
//     }

//     if (type === "Apple") {
//       result = await signInWithApple();
//     }

//     const idToken = await result.user.getIdToken();
//     const data = await firebaseLogin(idToken);

//     localStorage.setItem("authToken", data.token);
//     localStorage.setItem("user", JSON.stringify(data.user));
//     navigate("/dashboard");
//   } catch (err) {
//     setError(err.message || `${type} sign-in failed.`);
//   } finally {
//     setSocialLoading("");
//   }
// };

//  const handleSocialLogin = async (type) => {
//   setError("");
//   setSocialLoading(type);

//   try {
//     let result;

//     if (type === "Google") {
//       result = await signInWithGoogle();
//     }

//     // if (type === "Facebook") {
//     //   result = await signInWithFacebook();
//     // }

//     // if (type === "Apple") {
//     //   result = await signInWithApple();
//     // }

//     const idToken = await result.user.getIdToken();
//     const data = await firebaseLogin(idToken);

//     localStorage.setItem("authToken", data.token);
//     localStorage.setItem("user", JSON.stringify(data.user));

//     navigate("/dashboard");
//   } catch (err) {
//     setError(err.message || `${type} sign-in failed.`);
//   } finally {
//     setSocialLoading("");
//   }
// };



  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.16),_transparent_28%),linear-gradient(180deg,_#f8fcfb_0%,_#eef8f6_52%,_#f8fcfb_100%)]">
      <Particles
        className="absolute inset-0 z-0 pointer-events-none"
        init={async (engine) => loadFull(engine)}
        options={{
          particles: {
            color: { value: "#10B981" },
            links: {
              enable: true,
              color: "#10B981",
              opacity: 0.18,
              distance: 130,
            },
            move: { enable: true, speed: 1 },
            number: { value: 55 },
            opacity: { value: 0.3 },
            size: { value: { min: 1, max: 3 } },
          },
        }}
      />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <MotionDiv
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/80 shadow-[0_25px_80px_rgba(148,163,184,0.18)] backdrop-blur-xl md:grid-cols-2"
        >
          <div className="p-6 sm:p-8 md:p-10 border-r border-slate-200/80">
            <div className="mx-auto w-full max-w-md">
              <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Log in to continue your interview preparation journey.
              </p>
              {isWakingServer && (
                <p className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  Warming up the server. First request can take a little longer.
                </p>
              )}

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors((prev) => ({ ...prev, email: "" }));
                      }}
                      className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-rose-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrors((prev) => ({ ...prev, password: "" }));
                      }}
                      className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-11 pr-12 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-rose-500">{errors.password}</p>
                  )}
                  <div className="mt-3 text-right">
                    <Link
                      to="/forgot-password"
                      className="text-sm font-semibold text-emerald-700 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                {error && (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Logging In...
                    </>
                  ) : (
                    "Log In"
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="p-6 sm:p-8 md:p-10">
            <div className="mx-auto w-full max-w-md flex flex-col justify-center h-full">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm text-emerald-700 shadow-sm w-fit mb-6">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Interview Companion
              </div>

              <h3 className="text-3xl font-bold text-slate-900">
                Continue with your account
              </h3>
              <p className="mt-3 text-base leading-7 text-slate-600">
                Choose your preferred provider to continue quickly.
              </p>

              {/* <div className="my-8 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  social login
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => handleSocialLogin("Google")}
                  disabled={socialLoading !== ""}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-800 transition hover:bg-slate-50 disabled:opacity-70"
                >
                  {socialLoading === "Google" ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <img
                      src="https://www.svgrepo.com/show/475656/google-color.svg"
                      alt="Google"
                      className="h-5 w-5"
                    />
                  )}
                  <span className="font-medium">Continue with Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialLogin("Facebook")}
                  disabled={socialLoading !== ""}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-800 transition hover:bg-slate-50 disabled:opacity-70"
                >
                  {socialLoading === "Facebook" ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <img
                      src="https://www.svgrepo.com/show/475647/facebook-color.svg"
                      alt="Facebook"
                      className="h-5 w-5"
                    />
                  )}
                  <span className="font-medium">Continue with Facebook</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialLogin("Apple")}
                  disabled={socialLoading !== ""}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-800 transition hover:bg-slate-50 disabled:opacity-70"
                >
                  {socialLoading === "Apple" ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="black">
                      <path d="M16.365 1.43c0 1.14-.416 2.23-1.187 3.097-.79.88-2.083 1.57-3.197 1.49-.14-1.06.48-2.19 1.24-2.98.79-.83 2.19-1.47 3.144-1.6zM20.62 17.04c-.57 1.3-.84 1.87-1.58 3.03-1.04 1.61-2.5 3.62-4.32 3.64-1.62.02-2.04-1.05-4.2-1.03-2.17.01-2.64 1.05-4.26 1.02-1.82-.02-3.22-1.82-4.26-3.42-2.9-4.46-3.2-9.68-1.41-12.46 1.27-1.98 3.28-3.14 5.18-3.14 1.94 0 3.16 1.05 4.76 1.05 1.56 0 2.5-1.06 4.74-1.06 1.7 0 3.5.93 4.76 2.54-4.19 2.3-3.51 8.24.99 10.78z" />
                    </svg>
                  )}
                  <span className="font-medium">Continue with Apple</span>
                </button>
              </div> */}
                            {/* <div className="my-8 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  social login
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => handleSocialLogin()}
                  disabled={socialLoading !== ""}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-800 transition hover:bg-slate-50 disabled:opacity-70"
                >
                  {socialLoading === "Google" ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <img
                      src="https://www.svgrepo.com/show/475656/google-color.svg"
                      alt="Google"
                      className="h-5 w-5"
                    />
                  )}
                  <span className="font-medium">Continue with Google</span>
                </button>
              </div> */}


              <p className="mt-6 text-center text-sm text-slate-500">
                Don&apos;t have an account?{" "}
                <Link
                  to="/signup"
                  className="font-semibold text-emerald-700 hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </MotionDiv>
      </div>
    </div>
  );
}
