import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Search, X, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [roles, setRoles] = useState([
    {
      id: "FE",
      title: "Frontend Engineer",
      desc: "Preparing for UI-rich app interviews",
      exp: "2 Years",
      qna: "12 Q&A",
      date: "1st Oct 2025",
      skills: "React, CSS, HTML, JavaScript",
      color: "from-green-100 to-blue-100",
    },
    {
      id: "BE",
      title: "Backend Engineer",
      desc: "Focused on scalable service backends",
      exp: "3 Years",
      qna: "14 Q&A",
      date: "1st Oct 2025",
      skills: "Node.js, Express, MongoDB, REST APIs",
      color: "from-yellow-100 to-orange-100",
    },
    {
      id: "FS",
      title: "Full Stack Dev",
      desc: "Handling both client & server sides",
      exp: "4 Years",
      qna: "10 Q&A",
      date: "1st Oct 2025",
      skills: "MERN stack, deployment, auth",
      color: "from-blue-100 to-indigo-100",
    },
    {
      id: "DS",
      title: "Data Scientist",
      desc: "Analyzing finance and product datasets",
      exp: "2 Years",
      qna: "10 Q&A",
      date: "1st Oct 2025",
      skills: "Python, Pandas, ML, SQL",
      color: "from-rose-100 to-pink-100",
    },
    {
      id: "DEV",
      title: "DevOps",
      desc: "Switching to automation-heavy workflows",
      exp: "5 Years",
      qna: "12 Q&A",
      date: "1st Oct 2025",
      skills: "CI/CD, Docker, AWS, Kubernetes",
      color: "from-teal-100 to-cyan-100",
    },
    {
      id: "UX",
      title: "UI/UX Designer",
      desc: "Mastering product design strategies",
      exp: "3 Years",
      qna: "10 Q&A",
      date: "1st Oct 2025",
      skills: "Figma, wireframing, accessibility",
      color: "from-purple-100 to-indigo-100",
    },
  ]);

  const [newRole, setNewRole] = useState({
    id: "",
    title: "",
    desc: "",
    exp: "",
    qna: "",
    date: "",
    skills: "",
    color: "from-teal-100 to-cyan-100",
  });

  const filteredRoles = roles.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddRole = (e) => {
    e.preventDefault();
    if (newRole.id && newRole.title) {
      setRoles([...roles, newRole]);
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
        color: "from-teal-100 to-cyan-100",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex flex-col items-center py-16 px-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-10 text-center">
        Interview Prep Dashboard
      </h1>

      {/* Search Bar */}
      <div className="relative w-full max-w-2xl mb-10">
        <input
          type="text"
          placeholder="Search roles (e.g. Frontend, DevOps)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-400 outline-none text-gray-700 shadow-md bg-white/90 backdrop-blur-sm"
        />
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {filteredRoles.map((role, index) => (
          <motion.div
            key={role.id + index}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, duration: 0.45 }}
            whileHover={{ scale: 1.03 }}
            className={`cursor-pointer bg-gradient-to-br ${role.color} rounded-2xl p-6 shadow-lg transition-transform`}
            // ✅ Navigate to UploadResume
            onClick={() =>
              navigate(`/uploadresume/${encodeURIComponent(role.title)}`, {
                state: { role },
              })
            }
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center font-semibold text-gray-800 shadow">
                {role.id}
              </div>
              <h2 className="text-xl font-bold text-gray-800">{role.title}</h2>
            </div>
            <p className="text-gray-600 mb-3 text-sm">{role.skills}</p>
            <div className="flex justify-between text-gray-500 text-xs mb-3">
              <span>{role.exp}</span>
              <span>{role.qna}</span>
              <span>{role.date}</span>
            </div>
            <p className="text-gray-700 text-sm font-medium">{role.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Add Role Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowModal(true)}
        className="mt-12 flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition"
      >
        <PlusCircle size={20} />
        Add New Role
      </motion.button>

      {/* Add Role Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
              >
                <X size={22} />
              </button>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Add New Role
              </h3>
              <form onSubmit={handleAddRole} className="space-y-4">
                <input
                  type="text"
                  placeholder="Role ID (e.g., UX, BE)"
                  value={newRole.id}
                  onChange={(e) =>
                    setNewRole({ ...newRole, id: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-teal-400 outline-none"
                />
                <input
                  type="text"
                  placeholder="Role Title"
                  value={newRole.title}
                  onChange={(e) =>
                    setNewRole({ ...newRole, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-teal-400 outline-none"
                />
                <input
                  type="text"
                  placeholder="Skills"
                  value={newRole.skills}
                  onChange={(e) =>
                    setNewRole({ ...newRole, skills: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-teal-400 outline-none"
                />
                <input
                  type="text"
                  placeholder="Experience"
                  value={newRole.exp}
                  onChange={(e) =>
                    setNewRole({ ...newRole, exp: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-teal-400 outline-none"
                />
                <input
                  type="text"
                  placeholder="Questions"
                  value={newRole.qna}
                  onChange={(e) =>
                    setNewRole({ ...newRole, qna: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-teal-400 outline-none"
                />
                <input
                  type="text"
                  placeholder="Last Updated"
                  value={newRole.date}
                  onChange={(e) =>
                    setNewRole({ ...newRole, date: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-teal-400 outline-none"
                />
                <textarea
                  placeholder="Description"
                  value={newRole.desc}
                  onChange={(e) =>
                    setNewRole({ ...newRole, desc: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-teal-400 outline-none resize-none"
                />
                <button
                  type="submit"
                  className="w-full bg-teal-600 text-white py-3 rounded-xl font-semibold hover:bg-teal-700 transition"
                >
                  Save Role
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-10 right-10 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3"
          >
            <CheckCircle2 size={22} />
            <span className="font-medium">Role added successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
