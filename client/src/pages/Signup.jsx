// // // import React, { useState, useEffect } from "react";
// // // import { Eye, EyeOff, X } from "lucide-react";
// // // import { useNavigate, Link } from "react-router-dom";
// // // import { motion } from "framer-motion";
// // // import Particles from "react-tsparticles";
// // // import { loadFull } from "tsparticles";
// // // import {
// // //   signInWithGoogle,
// // //   signInWithFacebook,
// // //   signInWithApple,
// // // } from "../firebase";
// // // import { registerUser } from "../services/api";

// // // export default function Signup() {
// // //   const [showPassword, setShowPassword] = useState(false);
// // //   const [showConfirm, setShowConfirm] = useState(false);
// // //   const [username, setUsername] = useState("");
// // //   const [email, setEmail] = useState("");
// // //   const [password, setPassword] = useState("");
// // //   const [confirm, setConfirm] = useState("");
// // //   const [profileFile, setProfileFile] = useState(null);
// // //   const [profilePreview, setProfilePreview] = useState(null);
// // //   const [errors, setErrors] = useState({});
// // //   const [submitError, setSubmitError] = useState("");
// // //   const [isSubmitting, setIsSubmitting] = useState(false);
// // //   const navigate = useNavigate();

// // //   useEffect(() => {
// // //     if (!profileFile) {
// // //       setProfilePreview(null);
// // //       return;
// // //     }
// // //     const url = URL.createObjectURL(profileFile);
// // //     setProfilePreview(url);
// // //     return () => URL.revokeObjectURL(url);
// // //   }, [profileFile]);

// // //   const handleFileChange = (e) => {
// // //     const file = e.target.files?.[0];
// // //     if (!file) return;
// // //     if (!file.type.startsWith("image/")) {
// // //       setErrors((s) => ({ ...s, profile: "Please upload an image file." }));
// // //       return;
// // //     }
// // //     if (file.size > 2 * 1024 * 1024) {
// // //       setErrors((s) => ({ ...s, profile: "Image must be smaller than 2MB." }));
// // //       return;
// // //     }
// // //     setErrors((s) => ({ ...s, profile: null }));
// // //     setProfileFile(file);
// // //   };

// // //   const removeProfile = () => {
// // //     setProfileFile(null);
// // //     setProfilePreview(null);
// // //   };

// // //   const validate = () => {
// // //     const e = {};
// // //     if (!username.trim()) e.username = "Username is required.";
// // //     if (!email.trim()) e.email = "Email is required.";
// // //     if (email && !/^\S+@\S+\.\S+$/.test(email)) e.email = "Email is invalid.";
// // //     if (!password) e.password = "Password is required.";
// // //     if (password && password.length < 8)
// // //       e.password = "Password must be at least 8 characters.";
// // //     if (password !== confirm) e.confirm = "Passwords do not match.";
// // //     setErrors(e);
// // //     return Object.keys(e).length === 0;
// // //   };

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     if (!validate()) return;
// // //     setSubmitError("");
// // //     setIsSubmitting(true);

// // //     try {
// // //       const data = await registerUser({
// // //         name: username.trim(),
// // //         email: email.trim(),
// // //         password,
// // //       });

// // //       localStorage.setItem("authToken", data.token);
// // //       localStorage.setItem("user", JSON.stringify(data.user));
// // //       navigate("/dashboard");
// // //     } catch (err) {
// // //       setSubmitError(err.response?.data?.message || "Unable to create account.");
// // //     } finally {
// // //       setIsSubmitting(false);
// // //     }
// // //   };

// // //   const handleSocialLogin = async (type) => {
// // //     try {
// // //       if (type === "Google") await signInWithGoogle();
// // //       if (type === "Facebook") await signInWithFacebook();
// // //       if (type === "Apple") await signInWithApple();
// // //       setSubmitError(`${type} login is not connected to backend auth yet.`);
// // //     } catch (err) {
// // //       console.error("Login error:", err.message);
// // //     }
// // //   };

// // //   return (
// // //     <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 bg-gradient-to-br from-teal-50 via-white to-cyan-50">
// // //       {/* Background Particles */}
// // //       <Particles
// // //         id="tsparticles"
// // //         className="absolute inset-0 z-0"
// // //         init={async (engine) => await loadFull(engine)}
// // //         options={{
// // //           background: { color: "transparent" },
// // //           fpsLimit: 60,
// // //           particles: {
// // //             color: { value: "#14B8A6" },
// // //             links: {
// // //               color: "#14B8A6",
// // //               distance: 130,
// // //               enable: true,
// // //               opacity: 0.4,
// // //               width: 1,
// // //             },
// // //             move: { enable: true, speed: 1 },
// // //             number: { value: 80, density: { enable: true, area: 800 } },
// // //             opacity: { value: 0.5 },
// // //             shape: { type: "circle" },
// // //             size: { value: { min: 1, max: 3 } },
// // //           },
// // //         }}
// // //       />

// // //       {/* Header */}
// // //       <header className="absolute top-0 left-0 w-full flex justify-between items-center px-6 py-4 z-10">
// // //         <h1 className="text-teal-700 font-bold text-2xl tracking-wide">
// // //           Interview Companion
// // //         </h1>
// // //         <button
// // //           onClick={() => navigate("/")}
// // //           className="text-teal-700 hover:text-teal-900 transition"
// // //         >
// // //           <X size={28} />
// // //         </button>
// // //       </header>

// // //       {/* Signup Card */}
// // //       <div className="relative z-10 w-full max-w-5xl bg-white shadow-2xl rounded-2xl p-10 border border-blue-100 mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
// // //         {/* Left: Form */}
// // //         <motion.div
// // //           initial={{ opacity: 0, x: -60 }}
// // //           animate={{ opacity: 1, x: 0 }}
// // //           transition={{ duration: 0.8 }}
// // //         >
// // //           <h2 className="text-3xl font-extrabold text-teal-700 mb-3 text-center md:text-left">
// // //             Create Account
// // //           </h2>
// // //           <p className="text-gray-700 mb-6 text-center md:text-left">
// // //             Start your journey with Interview Companion
// // //           </p>

// // //           <form className="grid grid-cols-1 gap-5" onSubmit={handleSubmit}>
// // //             {/* Profile Upload */}
// // //             <div className="flex flex-col items-center mb-3">
// // //               {profilePreview ? (
// // //                 <motion.div
// // //                   initial={{ scale: 0.9, opacity: 0 }}
// // //                   animate={{ scale: 1, opacity: 1 }}
// // //                   transition={{ duration: 0.4 }}
// // //                   className="relative"
// // //                 >
// // //                   <img
// // //                     src={profilePreview}
// // //                     alt="Profile Preview"
// // //                     className="w-24 h-24 rounded-full object-cover border-4 border-teal-400 shadow-md"
// // //                   />
// // //                   <button
// // //                     type="button"
// // //                     onClick={removeProfile}
// // //                     className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-700"
// // //                   >
// // //                     ✕
// // //                   </button>
// // //                 </motion.div>
// // //               ) : (
// // //                 <label className="w-24 h-24 rounded-full flex items-center justify-center bg-gray-50 cursor-pointer border-2 border-dashed border-gray-400 hover:border-teal-400 transition">
// // //                   <span className="text-gray-700 text-sm text-center">
// // //                     Upload
// // //                   </span>
// // //                   <input
// // //                     type="file"
// // //                     accept="image/*"
// // //                     onChange={handleFileChange}
// // //                     className="hidden"
// // //                   />
// // //                 </label>
// // //               )}
// // //               {errors.profile && (
// // //                 <p className="text-sm text-red-500 mt-2">{errors.profile}</p>
// // //               )}
// // //             </div>

// // //             {/* Username */}
// // //             <div>
// // //               <label className="block text-sm font-semibold text-gray-800 mb-1">
// // //                 Username
// // //               </label>
// // //               <input
// // //                 value={username}
// // //                 onChange={(e) => setUsername(e.target.value)}
// // //                 type="text"
// // //                 placeholder="johndoe"
// // //                 className="w-full px-5 py-3 rounded-xl border-2 border-black bg-white text-black focus:ring-2 focus:ring-teal-400 outline-none text-base placeholder-gray-500"
// // //               />
// // //               {errors.username && (
// // //                 <p className="text-sm text-red-500 mt-1">{errors.username}</p>
// // //               )}
// // //             </div>

// // //             {/* Email */}
// // //             <div>
// // //               <label className="block text-sm font-semibold text-gray-800 mb-1">
// // //                 Email Address
// // //               </label>
// // //               <input
// // //                 value={email}
// // //                 onChange={(e) => setEmail(e.target.value)}
// // //                 type="email"
// // //                 placeholder="john@example.com"
// // //                 className="w-full px-5 py-3 rounded-xl border-2 border-black bg-white text-black focus:ring-2 focus:ring-teal-400 outline-none text-base placeholder-gray-500"
// // //               />
// // //               {errors.email && (
// // //                 <p className="text-sm text-red-500 mt-1">{errors.email}</p>
// // //               )}
// // //             </div>

// // //             {/* Password */}
// // //             <div>
// // //               <label className="block text-sm font-semibold text-gray-800 mb-1">
// // //                 Password
// // //               </label>
// // //               <div className="relative">
// // //                 <input
// // //                   value={password}
// // //                   onChange={(e) => setPassword(e.target.value)}
// // //                   type={showPassword ? "text" : "password"}
// // //                   placeholder="Min 8 characters"
// // //                   className="w-full px-5 py-3 rounded-xl border-2 border-black bg-white text-black focus:ring-2 focus:ring-teal-400 outline-none pr-12 placeholder-gray-500"
// // //                 />
// // //                 <button
// // //                   type="button"
// // //                   onClick={() => setShowPassword(!showPassword)}
// // //                   className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-teal-600"
// // //                 >
// // //                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
// // //                 </button>
// // //               </div>
// // //               {errors.password && (
// // //                 <p className="text-sm text-red-500 mt-1">{errors.password}</p>
// // //               )}
// // //             </div>

// // //             {/* Confirm Password */}
// // //             <div>
// // //               <label className="block text-sm font-semibold text-gray-800 mb-1">
// // //                 Confirm Password
// // //               </label>
// // //               <div className="relative">
// // //                 <input
// // //                   value={confirm}
// // //                   onChange={(e) => setConfirm(e.target.value)}
// // //                   type={showConfirm ? "text" : "password"}
// // //                   placeholder="Re-enter password"
// // //                   className="w-full px-5 py-3 rounded-xl border-2 border-black bg-white text-black focus:ring-2 focus:ring-teal-400 outline-none pr-12 placeholder-gray-500"
// // //                 />
// // //                 <button
// // //                   type="button"
// // //                   onClick={() => setShowConfirm(!showConfirm)}
// // //                   className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-teal-600"
// // //                 >
// // //                   {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
// // //                 </button>
// // //               </div>
// // //               {errors.confirm && (
// // //                 <p className="text-sm text-red-500 mt-1">{errors.confirm}</p>
// // //               )}
// // //             </div>

// // //             <button
// // //               type="submit"
// // //               disabled={isSubmitting}
// // //               className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:from-teal-400 hover:to-cyan-400 transition"
// // //             >
// // //               {isSubmitting ? "Creating Account..." : "Sign Up"}
// // //             </button>

// // //             {submitError && (
// // //               <p className="text-sm text-red-500">{submitError}</p>
// // //             )}
// // //           </form>

// // //           <p className="text-center text-sm text-gray-700 mt-6">
// // //             Already have an account?{" "}
// // //             <Link
// // //               to="/login"
// // //               className="text-teal-600 font-semibold hover:underline"
// // //             >
// // //               Log In
// // //             </Link>
// // //           </p>
// // //         </motion.div>

// // //         {/* Right: Social Login */}
// // //         <motion.div
// // //           initial={{ opacity: 0, x: 60 }}
// // //           animate={{ opacity: 1, x: 0 }}
// // //           transition={{ duration: 0.8, delay: 0.2 }}
// // //           className="flex flex-col items-center justify-center gap-4 border-l border-gray-200 pl-6"
// // //         >
// // //           <h3 className="text-gray-800 font-semibold mb-2">Or continue with</h3>
// // //           <div className="w-full space-y-3">
// // //             {[
// // //               {
// // //                 name: "Google",
// // //                 icon: "https://www.svgrepo.com/show/355037/google.svg",
// // //               },
// // //               {
// // //                 name: "Facebook",
// // //                 icon: "https://www.svgrepo.com/show/475647/facebook-color.svg",
// // //               },
// // //               {
// // //                 name: "Apple",
// // //                 icon: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
// // //               },
// // //             ].map((provider, i) => (
// // //               <motion.button
// // //                 key={provider.name}
// // //                 initial={{ opacity: 0, y: 20 }}
// // //                 animate={{ opacity: 1, y: 0 }}
// // //                 transition={{ delay: 0.4 + i * 0.1 }}
// // //                 type="button"
// // //                 onClick={() => handleSocialLogin(provider.name)}
// // //                 className="w-full flex items-center justify-center gap-3 border-2 border-black rounded-xl py-3 bg-white hover:bg-gray-100 transition transform hover:-translate-y-0.5 hover:shadow-md"
// // //               >
// // //                 <img src={provider.icon} alt={provider.name} className="w-5 h-5" />
// // //                 <span className="text-gray-800 font-medium">{provider.name}</span>
// // //               </motion.button>
// // //             ))}
// // //           </div>
// // //         </motion.div>
// // //       </div>
// // //     </div>
// // //   );
// // // }



// // import React, { useState, useEffect } from "react";
// // import { Eye, EyeOff, X, Loader2, WandSparkles, Check } from "lucide-react";
// // import { useNavigate, Link } from "react-router-dom";
// // import { motion } from "framer-motion";
// // import Particles from "react-tsparticles";
// // import { loadFull } from "tsparticles";
// // import {
// //   signInWithGoogle,
// //   signInWithFacebook,
// //   signInWithApple,
// // } from "../firebase";
// // import { registerUser } from "../services/api";

// // export default function Signup() {
// //   const [showPassword, setShowPassword] = useState(false);
// //   const [showConfirm, setShowConfirm] = useState(false);
// //   const [username, setUsername] = useState("");
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [confirm, setConfirm] = useState("");
// //   const [profileFile, setProfileFile] = useState(null);
// //   const [profilePreview, setProfilePreview] = useState(null);
// //   const [errors, setErrors] = useState({});
// //   const [submitError, setSubmitError] = useState("");
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [socialLoading, setSocialLoading] = useState("");
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     if (!profileFile) {
// //       setProfilePreview(null);
// //       return;
// //     }
// //     const url = URL.createObjectURL(profileFile);
// //     setProfilePreview(url);
// //     return () => URL.revokeObjectURL(url);
// //   }, [profileFile]);

// //   const handleFileChange = (e) => {
// //     const file = e.target.files?.[0];
// //     if (!file) return;
// //     if (!file.type.startsWith("image/")) {
// //       setErrors((s) => ({ ...s, profile: "Please upload an image file." }));
// //       return;
// //     }
// //     if (file.size > 2 * 1024 * 1024) {
// //       setErrors((s) => ({ ...s, profile: "Image must be smaller than 2MB." }));
// //       return;
// //     }
// //     setErrors((s) => ({ ...s, profile: null }));
// //     setProfileFile(file);
// //   };

// //   const removeProfile = () => {
// //     setProfileFile(null);
// //     setProfilePreview(null);
// //   };

// //   const generateStrongPassword = () => {
// //     const chars =
// //       "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";
// //     let generated = "";
// //     for (let i = 0; i < 14; i += 1) {
// //       generated += chars.charAt(Math.floor(Math.random() * chars.length));
// //     }
// //     setPassword(generated);
// //     setConfirm(generated);
// //     setErrors((prev) => ({ ...prev, password: "", confirm: "" }));
// //   };

// //   const passwordChecks = {
// //     length: password.length >= 8,
// //     upper: /[A-Z]/.test(password),
// //     lower: /[a-z]/.test(password),
// //     number: /[0-9]/.test(password),
// //     symbol: /[^A-Za-z0-9]/.test(password),
// //   };

// //   const validate = () => {
// //     const e = {};
// //     if (!username.trim()) e.username = "Username is required.";
// //     if (!email.trim()) e.email = "Email is required.";
// //     if (email && !/^\S+@\S+\.\S+$/.test(email)) e.email = "Email is invalid.";
// //     if (!password) e.password = "Password is required.";
// //     if (
// //       password &&
// //       (!passwordChecks.length ||
// //         !passwordChecks.upper ||
// //         !passwordChecks.lower ||
// //         !passwordChecks.number ||
// //         !passwordChecks.symbol)
// //     ) {
// //       e.password =
// //         "Use at least 8 characters with uppercase, lowercase, number, and symbol.";
// //     }
// //     if (!confirm) e.confirm = "Confirm your password.";
// //     if (password && confirm && password !== confirm) {
// //       e.confirm = "Passwords do not match.";
// //     }
// //     setErrors(e);
// //     return Object.keys(e).length === 0;
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!validate()) return;
// //     setSubmitError("");
// //     setIsSubmitting(true);

// //     try {
// //       const data = await registerUser({
// //         name: username.trim(),
// //         email: email.trim(),
// //         password,
// //       });

// //       localStorage.setItem("authToken", data.token);
// //       localStorage.setItem("user", JSON.stringify(data.user));
// //       navigate("/dashboard");
// //     } catch (err) {
// //       setSubmitError(err.response?.data?.message || "Unable to create account.");
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   const handleSocialLogin = async (type) => {
// //     setSubmitError("");
// //     setSocialLoading(type);

// //     try {
// //       if (type === "Google") {
// //         const result = await signInWithGoogle();
// //         setSubmitError(
// //           result?.user?.email
// //             ? `Google account selected: ${result.user.email}. Backend social signup is not connected yet.`
// //             : "Google login completed, but backend social signup is not connected yet."
// //         );
// //       }
// //       if (type === "Facebook") {
// //         await signInWithFacebook();
// //         setSubmitError("Facebook login is not connected to backend auth yet.");
// //       }
// //       if (type === "Apple") {
// //         await signInWithApple();
// //         setSubmitError("Apple login is not connected to backend auth yet.");
// //       }
// //     } catch (err) {
// //       setSubmitError(err.message || `${type} sign-in failed.`);
// //     } finally {
// //       setSocialLoading("");
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-10 bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.14),_transparent_28%),linear-gradient(180deg,_#f8fbff_0%,_#eef4ff_52%,_#f8fbff_100%)]">
// //       <Particles
// //         id="tsparticles"
// //         className="absolute inset-0 z-0"
// //         init={async (engine) => loadFull(engine)}
// //         options={{
// //           background: { color: "transparent" },
// //           fpsLimit: 60,
// //           particles: {
// //             color: { value: "#14B8A6" },
// //             links: {
// //               color: "#14B8A6",
// //               distance: 130,
// //               enable: true,
// //               opacity: 0.25,
// //               width: 1,
// //             },
// //             move: { enable: true, speed: 1 },
// //             number: { value: 70, density: { enable: true, area: 800 } },
// //             opacity: { value: 0.4 },
// //             shape: { type: "circle" },
// //             size: { value: { min: 1, max: 3 } },
// //           },
// //         }}
// //       />

// //       <header className="absolute top-0 left-0 w-full flex justify-between items-center px-6 py-4 z-10">
// //         <h1 className="text-slate-900 font-bold text-2xl tracking-tight">
// //           Interview Companion
// //         </h1>
// //         <button
// //           onClick={() => navigate("/")}
// //           className="text-slate-500 hover:text-slate-900 transition"
// //         >
// //           <X size={28} />
// //         </button>
// //       </header>

// //       <div className="relative z-10 w-full max-w-6xl bg-white/75 shadow-[0_25px_80px_rgba(148,163,184,0.2)] rounded-[2rem] border border-slate-200/80 mt-16 grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden backdrop-blur-xl">
// //         <motion.div
// //           initial={{ opacity: 0, x: -60 }}
// //           animate={{ opacity: 1, x: 0 }}
// //           transition={{ duration: 0.8 }}
// //           className="p-8 md:p-10"
// //         >
// //           <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
// //             Create Account
// //           </h2>
// //           <p className="text-slate-600 mb-6">
// //             Start your journey with Interview Companion
// //           </p>

// //           <form className="grid grid-cols-1 gap-5" onSubmit={handleSubmit}>
// //             <div className="flex flex-col items-center mb-2">
// //               {profilePreview ? (
// //                 <motion.div
// //                   initial={{ scale: 0.9, opacity: 0 }}
// //                   animate={{ scale: 1, opacity: 1 }}
// //                   transition={{ duration: 0.4 }}
// //                   className="relative"
// //                 >
// //                   <img
// //                     src={profilePreview}
// //                     alt="Profile Preview"
// //                     className="w-24 h-24 rounded-full object-cover border-4 border-teal-400 shadow-md"
// //                   />
// //                   <button
// //                     type="button"
// //                     onClick={removeProfile}
// //                     className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-700"
// //                   >
// //                     ×
// //                   </button>
// //                 </motion.div>
// //               ) : (
// //                 <label className="w-24 h-24 rounded-full flex items-center justify-center bg-white cursor-pointer border-2 border-dashed border-slate-300 hover:border-teal-400 transition shadow-sm">
// //                   <span className="text-slate-600 text-sm text-center">
// //                     Upload
// //                   </span>
// //                   <input
// //                     type="file"
// //                     accept="image/*"
// //                     onChange={handleFileChange}
// //                     className="hidden"
// //                   />
// //                 </label>
// //               )}
// //               {errors.profile && (
// //                 <p className="text-sm text-red-500 mt-2">{errors.profile}</p>
// //               )}
// //             </div>

// //             <div>
// //               <label className="block text-sm font-semibold text-slate-700 mb-1">
// //                 Username
// //               </label>
// //               <input
// //                 value={username}
// //                 onChange={(e) => setUsername(e.target.value)}
// //                 type="text"
// //                 autoComplete="username"
// //                 placeholder="johndoe"
// //                 className="w-full px-5 py-3 rounded-2xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-teal-200 focus:border-teal-400 outline-none text-base placeholder-slate-400"
// //               />
// //               {errors.username && (
// //                 <p className="text-sm text-red-500 mt-1">{errors.username}</p>
// //               )}
// //             </div>

// //             <div>
// //               <label className="block text-sm font-semibold text-slate-700 mb-1">
// //                 Email Address
// //               </label>
// //               <input
// //                 value={email}
// //                 onChange={(e) => setEmail(e.target.value)}
// //                 type="email"
// //                 autoComplete="email"
// //                 inputMode="email"
// //                 placeholder="john@example.com"
// //                 className="w-full px-5 py-3 rounded-2xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-teal-200 focus:border-teal-400 outline-none text-base placeholder-slate-400"
// //               />
// //               {errors.email && (
// //                 <p className="text-sm text-red-500 mt-1">{errors.email}</p>
// //               )}
// //             </div>

// //             <div>
// //               <div className="flex items-center justify-between mb-1">
// //                 <label className="block text-sm font-semibold text-slate-700">
// //                   Password
// //                 </label>
// //                 <button
// //                   type="button"
// //                   onClick={generateStrongPassword}
// //                   className="inline-flex items-center gap-1 text-sm font-medium text-teal-700 hover:text-teal-800"
// //                 >
// //                   <WandSparkles size={14} />
// //                   Suggest strong password
// //                 </button>
// //               </div>

// //               <div className="relative">
// //                 <input
// //                   value={password}
// //                   onChange={(e) => setPassword(e.target.value)}
// //                   type={showPassword ? "text" : "password"}
// //                   autoComplete="new-password"
// //                   placeholder="Create a strong password"
// //                   className="w-full px-5 py-3 rounded-2xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-teal-200 focus:border-teal-400 outline-none pr-12 placeholder-slate-400"
// //                 />
// //                 <button
// //                   type="button"
// //                   onClick={() => setShowPassword(!showPassword)}
// //                   className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600"
// //                 >
// //                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
// //                 </button>
// //               </div>

// //               <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
// //                 {[
// //                   { label: "8+ characters", ok: passwordChecks.length },
// //                   { label: "Uppercase letter", ok: passwordChecks.upper },
// //                   { label: "Lowercase letter", ok: passwordChecks.lower },
// //                   { label: "Number and symbol", ok: passwordChecks.number && passwordChecks.symbol },
// //                 ].map((rule) => (
// //                   <div
// //                     key={rule.label}
// //                     className={`flex items-center gap-2 rounded-xl px-3 py-2 ${
// //                       rule.ok
// //                         ? "bg-emerald-50 text-emerald-700"
// //                         : "bg-slate-100 text-slate-500"
// //                     }`}
// //                   >
// //                     <Check size={14} />
// //                     <span>{rule.label}</span>
// //                   </div>
// //                 ))}
// //               </div>

// //               {errors.password && (
// //                 <p className="text-sm text-red-500 mt-2">{errors.password}</p>
// //               )}
// //             </div>

// //             <div>
// //               <label className="block text-sm font-semibold text-slate-700 mb-1">
// //                 Confirm Password
// //               </label>
// //               <div className="relative">
// //                 <input
// //                   value={confirm}
// //                   onChange={(e) => setConfirm(e.target.value)}
// //                   type={showConfirm ? "text" : "password"}
// //                   autoComplete="new-password"
// //                   placeholder="Re-enter password"
// //                   className="w-full px-5 py-3 rounded-2xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-teal-200 focus:border-teal-400 outline-none pr-12 placeholder-slate-400"
// //                 />
// //                 <button
// //                   type="button"
// //                   onClick={() => setShowConfirm(!showConfirm)}
// //                   className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600"
// //                 >
// //                   {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
// //                 </button>
// //               </div>
// //               {errors.confirm && (
// //                 <p className="text-sm text-red-500 mt-1">{errors.confirm}</p>
// //               )}
// //             </div>

// //             <button
// //               type="submit"
// //               disabled={isSubmitting}
// //               className="w-full py-3 bg-slate-900 text-white rounded-2xl font-semibold text-lg shadow-sm hover:bg-slate-800 transition disabled:opacity-70"
// //             >
// //               {isSubmitting ? "Creating Account..." : "Sign Up"}
// //             </button>

// //             {submitError && (
// //               <p className="text-sm text-red-500">{submitError}</p>
// //             )}
// //           </form>

// //           <p className="text-center text-sm text-slate-600 mt-6">
// //             Already have an account?{" "}
// //             <Link
// //               to="/login"
// //               className="text-teal-700 font-semibold hover:underline"
// //             >
// //               Log In
// //             </Link>
// //           </p>
// //         </motion.div>

// //         <motion.div
// //           initial={{ opacity: 0, x: 60 }}
// //           animate={{ opacity: 1, x: 0 }}
// //           transition={{ duration: 0.8, delay: 0.2 }}
// //           className="flex flex-col items-center justify-center gap-4 border-l border-slate-200/80 bg-white/35 p-8 md:p-10"
// //         >
// //           <div className="max-w-sm text-center">
// //             <h3 className="text-2xl font-bold text-slate-900">
// //               Continue with social sign in
// //             </h3>
// //             <p className="mt-3 text-slate-500 leading-7">
// //               Choose an existing provider if you want to test the social auth
// //               flow and account chooser experience.
// //             </p>
// //           </div>

// //           <div className="w-full max-w-xs space-y-3 mt-6">
// //             {[
// //               {
// //                 name: "Google",
// //                 icon: "https://www.svgrepo.com/show/355037/google.svg",
// //               },
// //               {
// //                 name: "Facebook",
// //                 icon: "https://www.svgrepo.com/show/475647/facebook-color.svg",
// //               },
// //               {
// //                 name: "Apple",
// //                 icon: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
// //               },
// //             ].map((provider, i) => (
// //               <motion.button
// //                 key={provider.name}
// //                 initial={{ opacity: 0, y: 20 }}
// //                 animate={{ opacity: 1, y: 0 }}
// //                 transition={{ delay: 0.4 + i * 0.1 }}
// //                 type="button"
// //                 onClick={() => handleSocialLogin(provider.name)}
// //                 disabled={socialLoading !== ""}
// //                 className="w-full flex items-center justify-center gap-3 border border-slate-300 rounded-2xl py-3 bg-white hover:bg-slate-50 transition disabled:opacity-70"
// //               >
// //                 {socialLoading === provider.name ? (
// //                   <Loader2 size={18} className="animate-spin" />
// //                 ) : (
// //                   <img src={provider.icon} alt={provider.name} className="w-5 h-5" />
// //                 )}
// //                 <span className="text-slate-800 font-medium">
// //                   Continue with {provider.name}
// //                 </span>
// //               </motion.button>
// //             ))}
// //           </div>
// //         </motion.div>
// //       </div>
// //     </div>
// //   );
// // }



// import React, { useState, useEffect } from "react";
// import {
//   Eye,
//   EyeOff,
//   X,
//   Loader2,
//   WandSparkles,
//   Check,
// } from "lucide-react";
// import { useNavigate, Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import Particles from "react-tsparticles";
// import { loadFull } from "tsparticles";
// import {
//   signInWithGoogle,
//   signInWithFacebook,
//   signInWithApple,
// } from "../firebase";
// import { registerUser } from "../services/api";

// export default function Signup() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirm, setConfirm] = useState("");
//   const [profileFile, setProfileFile] = useState(null);
//   const [profilePreview, setProfilePreview] = useState(null);
//   const [errors, setErrors] = useState({});
//   const [submitError, setSubmitError] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [socialLoading, setSocialLoading] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!profileFile) {
//       setProfilePreview(null);
//       return;
//     }
//     const url = URL.createObjectURL(profileFile);
//     setProfilePreview(url);
//     return () => URL.revokeObjectURL(url);
//   }, [profileFile]);

//   const handleFileChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     if (!file.type.startsWith("image/")) {
//       setErrors((s) => ({ ...s, profile: "Please upload an image file." }));
//       return;
//     }
//     if (file.size > 2 * 1024 * 1024) {
//       setErrors((s) => ({ ...s, profile: "Image must be smaller than 2MB." }));
//       return;
//     }
//     setErrors((s) => ({ ...s, profile: null }));
//     setProfileFile(file);
//   };

//   const removeProfile = () => {
//     setProfileFile(null);
//     setProfilePreview(null);
//   };

//   const generateStrongPassword = () => {
//     const chars =
//       "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";
//     let generated = "";
//     for (let i = 0; i < 14; i += 1) {
//       generated += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
//     setPassword(generated);
//     setConfirm(generated);
//     setErrors((prev) => ({ ...prev, password: "", confirm: "" }));
//   };

//   const passwordChecks = {
//     length: password.length >= 8,
//     upper: /[A-Z]/.test(password),
//     lower: /[a-z]/.test(password),
//     number: /[0-9]/.test(password),
//     symbol: /[^A-Za-z0-9]/.test(password),
//   };

//   const validate = () => {
//     const e = {};
//     if (!username.trim()) e.username = "Username is required.";
//     if (!email.trim()) e.email = "Email is required.";
//     if (email && !/^\S+@\S+\.\S+$/.test(email)) e.email = "Email is invalid.";
//     if (!password) e.password = "Password is required.";
//     if (
//       password &&
//       (!passwordChecks.length ||
//         !passwordChecks.upper ||
//         !passwordChecks.lower ||
//         !passwordChecks.number ||
//         !passwordChecks.symbol)
//     ) {
//       e.password =
//         "Use at least 8 characters with uppercase, lowercase, number, and symbol.";
//     }
//     if (!confirm) e.confirm = "Confirm your password.";
//     if (password && confirm && password !== confirm) {
//       e.confirm = "Passwords do not match.";
//     }
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;
//     setSubmitError("");
//     setIsSubmitting(true);

//     try {
//       const data = await registerUser({
//         name: username.trim(),
//         email: email.trim(),
//         password,
//       });

//       localStorage.setItem("authToken", data.token);
//       localStorage.setItem("user", JSON.stringify(data.user));
//       navigate("/dashboard");
//     } catch (err) {
//       setSubmitError(
//         err.response?.data?.message || "Unable to create account."
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleSocialLogin = async (type) => {
//     setSubmitError("");
//     setSocialLoading(type);

//     try {
//       if (type === "Google") {
//         const result = await signInWithGoogle();
//         setSubmitError(
//           result?.user?.email
//             ? `Google account selected: ${result.user.email}. Backend social signup is not connected yet.`
//             : "Google login completed, but backend social signup is not connected yet."
//         );
//       }
//       if (type === "Facebook") {
//         await signInWithFacebook();
//         setSubmitError("Facebook login is not connected to backend auth yet.");
//       }
//       if (type === "Apple") {
//         await signInWithApple();
//         setSubmitError("Apple login is not connected to backend auth yet.");
//       }
//     } catch (err) {
//       setSubmitError(err.message || `${type} sign-in failed.`);
//     } finally {
//       setSocialLoading("");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-10 bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.14),_transparent_28%),linear-gradient(180deg,_#f8fbff_0%,_#eef4ff_52%,_#f8fbff_100%)]">
//       <Particles
//         id="tsparticles"
//         className="absolute inset-0 z-0"
//         init={async (engine) => loadFull(engine)}
//         options={{
//           background: { color: "transparent" },
//           fpsLimit: 60,
//           particles: {
//             color: { value: "#14B8A6" },
//             links: {
//               color: "#14B8A6",
//               distance: 130,
//               enable: true,
//               opacity: 0.25,
//               width: 1,
//             },
//             move: { enable: true, speed: 1 },
//             number: { value: 70, density: { enable: true, area: 800 } },
//             opacity: { value: 0.4 },
//             shape: { type: "circle" },
//             size: { value: { min: 1, max: 3 } },
//           },
//         }}
//       />

//       <header className="absolute top-0 left-0 w-full flex justify-between items-center px-6 py-4 z-10">
//         <h1 className="text-slate-900 font-bold text-2xl tracking-tight">
//           Interview Companion
//         </h1>
//         <button
//           onClick={() => navigate("/")}
//           className="text-slate-500 hover:text-slate-900 transition"
//         >
//           <X size={28} />
//         </button>
//       </header>

//       <div className="relative z-10 w-full max-w-6xl bg-white/75 shadow-[0_25px_80px_rgba(148,163,184,0.2)] rounded-[2rem] border border-slate-200/80 mt-16 grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden backdrop-blur-xl">
//         <motion.div
//           initial={{ opacity: 0, x: -60 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.8 }}
//           className="p-8 md:p-10"
//         >
//           <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
//             Create Account
//           </h2>
//           <p className="text-slate-600 mb-6">
//             Start your journey with Interview Companion
//           </p>

//           <form className="grid grid-cols-1 gap-5" onSubmit={handleSubmit}>
//             <div className="flex flex-col items-center mb-2">
//               {profilePreview ? (
//                 <motion.div
//                   initial={{ scale: 0.9, opacity: 0 }}
//                   animate={{ scale: 1, opacity: 1 }}
//                   transition={{ duration: 0.4 }}
//                   className="relative"
//                 >
//                   <img
//                     src={profilePreview}
//                     alt="Profile Preview"
//                     className="w-24 h-24 rounded-full object-cover border-4 border-teal-400 shadow-md"
//                   />
//                   <button
//                     type="button"
//                     onClick={removeProfile}
//                     className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-700"
//                   >
//                     ×
//                   </button>
//                 </motion.div>
//               ) : (
//                 <label className="w-24 h-24 rounded-full flex items-center justify-center bg-white cursor-pointer border-2 border-dashed border-slate-300 hover:border-teal-400 transition shadow-sm">
//                   <span className="text-slate-600 text-sm text-center">
//                     Upload
//                   </span>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleFileChange}
//                     className="hidden"
//                   />
//                 </label>
//               )}
//               {errors.profile && (
//                 <p className="text-sm text-red-500 mt-2">{errors.profile}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-slate-700 mb-1">
//                 Username
//               </label>
//               <input
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 type="text"
//                 autoComplete="username"
//                 placeholder="johndoe"
//                 className="w-full px-5 py-3 rounded-2xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-teal-200 focus:border-teal-400 outline-none text-base placeholder-slate-400"
//               />
//               {errors.username && (
//                 <p className="text-sm text-red-500 mt-1">{errors.username}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-slate-700 mb-1">
//                 Email Address
//               </label>
//               <input
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 type="email"
//                 autoComplete="email"
//                 inputMode="email"
//                 placeholder="john@example.com"
//                 className="w-full px-5 py-3 rounded-2xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-teal-200 focus:border-teal-400 outline-none text-base placeholder-slate-400"
//               />
//               {errors.email && (
//                 <p className="text-sm text-red-500 mt-1">{errors.email}</p>
//               )}
//             </div>

//             <div>
//               <div className="flex items-center justify-between mb-1">
//                 <label className="block text-sm font-semibold text-slate-700">
//                   Password
//                 </label>
//                 <button
//                   type="button"
//                   onClick={generateStrongPassword}
//                   className="inline-flex items-center gap-1 text-sm font-medium text-teal-700 hover:text-teal-800"
//                 >
//                   <WandSparkles size={14} />
//                   Suggest strong password
//                 </button>
//               </div>

//               <div className="relative">
//                 <input
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   type={showPassword ? "text" : "password"}
//                   autoComplete="new-password"
//                   placeholder="Create a strong password"
//                   className="w-full px-5 py-3 rounded-2xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-teal-200 focus:border-teal-400 outline-none pr-12 placeholder-slate-400"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600"
//                 >
//                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//               </div>

//               <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
//                 {[
//                   { label: "8+ characters", ok: passwordChecks.length },
//                   { label: "Uppercase letter", ok: passwordChecks.upper },
//                   { label: "Lowercase letter", ok: passwordChecks.lower },
//                   {
//                     label: "Number and symbol",
//                     ok: passwordChecks.number && passwordChecks.symbol,
//                   },
//                 ].map((rule) => (
//                   <div
//                     key={rule.label}
//                     className={`flex items-center gap-2 rounded-xl px-3 py-2 ${
//                       rule.ok
//                         ? "bg-emerald-50 text-emerald-700"
//                         : "bg-slate-100 text-slate-500"
//                     }`}
//                   >
//                     <Check size={14} />
//                     <span>{rule.label}</span>
//                   </div>
//                 ))}
//               </div>

//               {errors.password && (
//                 <p className="text-sm text-red-500 mt-2">{errors.password}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-slate-700 mb-1">
//                 Confirm Password
//               </label>
//               <div className="relative">
//                 <input
//                   value={confirm}
//                   onChange={(e) => setConfirm(e.target.value)}
//                   type={showConfirm ? "text" : "password"}
//                   autoComplete="new-password"
//                   placeholder="Re-enter password"
//                   className="w-full px-5 py-3 rounded-2xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-teal-200 focus:border-teal-400 outline-none pr-12 placeholder-slate-400"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirm(!showConfirm)}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600"
//                 >
//                   {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//               </div>
//               {errors.confirm && (
//                 <p className="text-sm text-red-500 mt-1">{errors.confirm}</p>
//               )}
//             </div>

//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="w-full py-3 bg-slate-900 text-white rounded-2xl font-semibold text-lg shadow-sm hover:bg-slate-800 transition disabled:opacity-70"
//             >
//               {isSubmitting ? "Creating Account..." : "Sign Up"}
//             </button>

//             {submitError && (
//               <p className="text-sm text-red-500">{submitError}</p>
//             )}
//           </form>

//           <p className="text-center text-sm text-slate-600 mt-6">
//             Already have an account?{" "}
//             <Link
//               to="/login"
//               className="text-teal-700 font-semibold hover:underline"
//             >
//               Log In
//             </Link>
//           </p>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, x: 60 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.8, delay: 0.2 }}
//           className="flex flex-col items-center justify-center gap-4 border-l border-slate-200/80 bg-white/35 p-8 md:p-10"
//         >
//           <div className="max-w-sm text-center">
//             <h3 className="text-2xl font-bold text-slate-900">
//               Continue with social sign in
//             </h3>
//             <p className="mt-3 text-slate-500 leading-7">
//               Use your preferred provider to continue quickly.
//             </p>
//           </div>

//           <div className="w-full max-w-xs space-y-3 mt-6">
//             {[
//               {
//                 name: "Google",
//                 icon: "https://www.svgrepo.com/show/355037/google.svg",
//               },
//               {
//                 name: "Facebook",
//                 icon: "https://www.svgrepo.com/show/475647/facebook-color.svg",
//               },
//               {
//                 name: "Apple",
//                 icon: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
//               },
//             ].map((provider, i) => (
//               <motion.button
//                 key={provider.name}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.4 + i * 0.1 }}
//                 type="button"
//                 onClick={() => handleSocialLogin(provider.name)}
//                 disabled={socialLoading !== ""}
//                 className="w-full flex items-center justify-center gap-3 border-2 border-black rounded-2xl py-3 bg-white hover:bg-slate-50 transition disabled:opacity-70 shadow-none"
//                 style={{ borderColor: "#000000" }}

//               >
//                 {socialLoading === provider.name ? (
//                   <Loader2 size={18} className="animate-spin" />
//                 ) : (
//                   <img
//                     src={provider.icon}
//                     alt={provider.name}
//                     className="w-5 h-5"
//                   />
//                 )}
//                 <span className="text-slate-800 font-medium">
//                   Continue with {provider.name}
//                 </span>
//               </motion.button>
//             ))}
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  X,
  Loader2,
  WandSparkles,
  Check,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import {
  signInWithGoogle,
  signInWithFacebook,
  signInWithApple,
} from "../firebase";
import { registerUser, firebaseLogin } from "../services/api";

const MotionDiv = motion.div;
const MotionButton = motion.button;

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [profileFile, setProfileFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!profileFile) {
      setProfilePreview(null);
      return;
    }

    const url = URL.createObjectURL(profileFile);
    setProfilePreview(url);

    return () => URL.revokeObjectURL(url);
  }, [profileFile]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, profile: "Please upload an image file." }));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        profile: "Image must be smaller than 2MB.",
      }));
      return;
    }

    setErrors((prev) => ({ ...prev, profile: "" }));
    setProfileFile(file);
  };

  const removeProfile = () => {
    setProfileFile(null);
    setProfilePreview(null);
  };

  const generateStrongPassword = () => {
    const chars =
      "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";
    let generated = "";

    for (let i = 0; i < 14; i += 1) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    setPassword(generated);
    setConfirm(generated);
    setErrors((prev) => ({ ...prev, password: "", confirm: "" }));
  };

  const passwordChecks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };

  const validate = () => {
    const nextErrors = {};

    if (!username.trim()) nextErrors.username = "Username is required.";
    if (!email.trim()) nextErrors.email = "Email is required.";
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      nextErrors.email = "Email is invalid.";
    }

    if (!password) {
      nextErrors.password = "Password is required.";
    } else if (
      !passwordChecks.length ||
      !passwordChecks.upper ||
      !passwordChecks.lower ||
      !passwordChecks.number ||
      !passwordChecks.symbol
    ) {
      nextErrors.password =
        "Use at least 8 characters with uppercase, lowercase, number, and symbol.";
    }

    if (!confirm) {
      nextErrors.confirm = "Confirm your password.";
    } else if (password !== confirm) {
      nextErrors.confirm = "Passwords do not match.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitError("");
    setIsSubmitting(true);

    try {
      const data = await registerUser({
        name: username.trim(),
        email: email.trim(),
        password,
      });

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      setSubmitError(err.message || "Unable to create account.");
    } finally {
      setIsSubmitting(false);
    }
  };

 const handleSocialLogin = async (type) => {
  setSubmitError("");
  setSocialLoading(type);

  try {
    let result;

    if (type === "Google") {
      result = await signInWithGoogle();
    }

    if (type === "Facebook") {
      result = await signInWithFacebook();
    }

    if (type === "Apple") {
      result = await signInWithApple();
    }

    const idToken = await result.user.getIdToken();
    const data = await firebaseLogin(idToken);

    localStorage.setItem("authToken", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    navigate("/dashboard");
  } catch (err) {
    setSubmitError(err.message || `${type} sign-in failed.`);
  } finally {
    setSocialLoading("");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-10 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.16),_transparent_28%),linear-gradient(180deg,_#f8fcfb_0%,_#eef8f6_52%,_#f8fcfb_100%)]">
      <Particles
        id="tsparticles"
        className="absolute inset-0 z-0"
        init={async (engine) => loadFull(engine)}
        options={{
          background: { color: "transparent" },
          fpsLimit: 60,
          particles: {
            color: { value: "#10B981" },
            links: {
              color: "#10B981",
              distance: 130,
              enable: true,
              opacity: 0.22,
              width: 1,
            },
            move: { enable: true, speed: 1 },
            number: { value: 70, density: { enable: true, area: 800 } },
            opacity: { value: 0.35 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 3 } },
          },
        }}
      />

      <header className="absolute top-0 left-0 w-full flex justify-between items-center px-6 py-4 z-10">
        <h1 className="text-slate-900 font-bold text-2xl tracking-tight">
          Interview Companion
        </h1>
        <button
          onClick={() => navigate("/")}
          className="text-slate-500 hover:text-slate-900 transition"
        >
          <X size={28} />
        </button>
      </header>

      <div className="relative z-10 w-full max-w-6xl bg-white/80 shadow-[0_25px_80px_rgba(148,163,184,0.18)] rounded-[2rem] border border-slate-200/80 mt-16 grid grid-cols-1 md:grid-cols-2 overflow-hidden backdrop-blur-xl">
        <MotionDiv
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="p-8 md:p-10"
        >
          <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
            Create Account
          </h2>
          <p className="text-slate-600 mb-6">
            Start your journey with Interview Companion
          </p>

          <form className="grid grid-cols-1 gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col items-center mb-2">
              {profilePreview ? (
                <MotionDiv
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="relative"
                >
                  <img
                    src={profilePreview}
                    alt="Profile Preview"
                    className="w-24 h-24 rounded-full object-cover border-4 border-emerald-400 shadow-md"
                  />
                  <button
                    type="button"
                    onClick={removeProfile}
                    className="absolute -top-2 -right-2 bg-rose-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center hover:bg-rose-700"
                  >
                    x
                  </button>
                </MotionDiv>
              ) : (
                <label className="w-24 h-24 rounded-full flex items-center justify-center bg-white cursor-pointer border-2 border-dashed border-slate-300 hover:border-emerald-400 transition shadow-sm">
                  <span className="text-slate-600 text-sm text-center">
                    Upload
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
              {errors.profile && (
                <p className="text-sm text-rose-500 mt-2">{errors.profile}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Username
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                autoComplete="username"
                placeholder="johndoe"
                className="w-full px-5 py-3 rounded-2xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 outline-none"
              />
              {errors.username && (
                <p className="text-sm text-rose-500 mt-1">{errors.username}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="john@example.com"
                className="w-full px-5 py-3 rounded-2xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 outline-none"
              />
              {errors.email && (
                <p className="text-sm text-rose-500 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={generateStrongPassword}
                  className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700 hover:text-emerald-800"
                >
                  <WandSparkles size={14} />
                  Suggest strong password
                </button>
              </div>

              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Create a strong password"
                  className="w-full px-5 py-3 rounded-2xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 outline-none pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                {[
                  { label: "8+ characters", ok: passwordChecks.length },
                  { label: "Uppercase letter", ok: passwordChecks.upper },
                  { label: "Lowercase letter", ok: passwordChecks.lower },
                  {
                    label: "Number and symbol",
                    ok: passwordChecks.number && passwordChecks.symbol,
                  },
                ].map((rule) => (
                  <div
                    key={rule.label}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2 ${
                      rule.ok
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <Check size={14} />
                    <span>{rule.label}</span>
                  </div>
                ))}
              </div>

              {errors.password && (
                <p className="text-sm text-rose-500 mt-2">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Re-enter password"
                  className="w-full px-5 py-3 rounded-2xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 outline-none pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600"
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirm && (
                <p className="text-sm text-rose-500 mt-1">{errors.confirm}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-slate-900 text-white rounded-2xl font-semibold text-lg shadow-sm hover:bg-slate-800 transition disabled:opacity-70"
            >
              {isSubmitting ? "Creating Account..." : "Sign Up"}
            </button>

            {submitError && (
              <p className="text-sm text-rose-500">{submitError}</p>
            )}
          </form>

          <p className="text-center text-sm text-slate-600 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-emerald-700 font-semibold hover:underline"
            >
              Log In
            </Link>
          </p>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-center justify-center gap-4 border-l border-slate-200/80 bg-white/40 p-8 md:p-10"
        >
          <div className="max-w-sm text-center">
            <h3 className="text-2xl font-bold text-slate-900">
              Continue with social sign in
            </h3>
            <p className="mt-3 text-slate-500 leading-7">
              Use your preferred provider to continue quickly.
            </p>
          </div>

          <div className="w-full max-w-xs space-y-3 mt-6">
            {[
              {
                name: "Google",
                icon: "https://www.svgrepo.com/show/355037/google.svg",
              },
              {
                name: "Facebook",
                icon: "https://www.svgrepo.com/show/475647/facebook-color.svg",
              },
              {
                name: "Apple",
                icon: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
              },
            ].map((provider, index) => (
              <MotionButton
                key={provider.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                type="button"
                onClick={() => handleSocialLogin(provider.name)}
                disabled={socialLoading !== ""}
                className="w-full flex items-center justify-center gap-3 border border-slate-300 rounded-2xl py-3 bg-white hover:bg-slate-50 transition disabled:opacity-70"
              >
                {socialLoading === provider.name ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <img
                    src={provider.icon}
                    alt={provider.name}
                    className="w-5 h-5"
                  />
                )}
                <span className="text-slate-800 font-medium">
                  Continue with {provider.name}
                </span>
              </MotionButton>
            ))}
          </div>
        </MotionDiv>
      </div>
    </div>
  );
}
