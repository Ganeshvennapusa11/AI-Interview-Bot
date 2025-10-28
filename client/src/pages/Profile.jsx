import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Edit3, Loader2, FileText, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [about, setAbout] = useState("");
  const [avatar, setAvatar] = useState("");
  const [analysisHistory, setAnalysisHistory] = useState([]);

  // Replace with logged-in user’s email (later from auth)
  const email = "demo@example.com";

  // ✅ Fetch profile + history
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, historyRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/user/profile/${email}`),
          axios.get(`http://localhost:5000/api/user/history/${email}`),
        ]);
        setProfile(profileRes.data);
        setAbout(profileRes.data.about || "");
        setAvatar(profileRes.data.avatar || "");
        setAnalysisHistory(historyRes.data || []);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [email]);

  // ✅ Save profile updates
  const handleSave = async () => {
    try {
      await axios.post("http://localhost:5000/api/user/profile", {
        email,
        name: profile.name,
        avatar,
        about,
      });
      setEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto bg-white shadow-2xl rounded-2xl p-8"
      >
        <div className="flex items-center gap-6 mb-6">
          <img
            src={
              avatar ||
              "https://api.dicebear.com/7.x/initials/svg?seed=" +
                (profile.name || "User")
            }
            alt="Avatar"
            className="w-24 h-24 rounded-full border-4 border-indigo-400"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <User className="text-indigo-600" /> {profile.name}
            </h1>
            <p className="text-gray-600 flex items-center gap-1">
              <Mail className="text-indigo-400" /> {profile.email}
            </p>
          </div>
        </div>

        {/* About Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <Edit3 className="text-indigo-500" /> About Me
          </h2>
          {editing ? (
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400"
              rows={4}
            />
          ) : (
            <p className="text-gray-700 whitespace-pre-line">
              {about || "No information provided yet."}
            </p>
          )}
          <div className="mt-3">
            {editing ? (
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:opacity-90 transition"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-gray-100 text-indigo-600 rounded-lg hover:bg-indigo-50 transition"
              >
                Edit
              </button>
            )}
          </div>
        </div>

        {/* Analysis History */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <FileText className="text-indigo-500" /> Resume Analysis History
          </h2>
          {analysisHistory.length === 0 ? (
            <p className="text-gray-500">No analyses yet.</p>
          ) : (
            <div className="space-y-4">
              {analysisHistory.map((a, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg flex justify-between items-center hover:shadow-sm transition"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      Role: {a.role}
                    </p>
                    <p className="text-sm text-gray-600">
                      Match Score: {a.matchScore}% | {new Date(a.date).toLocaleDateString()}
                    </p>
                  </div>
                  <button className="px-3 py-2 bg-indigo-500 text-white rounded-lg text-sm hover:opacity-90 transition">
                    Download Report
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Change Resume Button */}
        <div className="mt-8 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/uploadresume")}
            className="flex items-center justify-center gap-2 mx-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl shadow-md hover:opacity-90 transition"
          >
            <Upload size={18} /> Change Resume
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
