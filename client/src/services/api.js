import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.code === "ECONNABORTED"
        ? "The server is taking too long to respond. Please try again in a moment."
        : error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Something went wrong.";

    const normalizedError = new Error(message);
    normalizedError.status = error.response?.status;
    normalizedError.data = error.response?.data;

    return Promise.reject(normalizedError);
  }
);

export async function loginUser(credentials) {
  const response = await api.post("/user/login", credentials);
  return response.data;
}

export async function wakeBackend() {
  const response = await axios.get(API_BASE, {
    timeout: 60000,
  });
  return response.data;
}

export async function registerUser(payload) {
  const response = await api.post("/user/register", payload);
  return response.data;
}

export async function requestPasswordReset(email) {
  const response = await api.post("/user/forgot-password", { email });
  return response.data;
}

export async function resetPassword(token, password) {
  const response = await api.post(`/user/reset-password/${token}`, { password });
  return response.data;
}

export async function firebaseLogin(idToken) {
  const response = await api.post("/user/firebase-login", { idToken });
  return response.data;
}

export async function fetchProfile() {
  const response = await api.get("/user/profile");
  return response.data;
}

export async function updateProfile(payload) {
  const response = await api.put("/user/profile", payload);
  return response.data;
}

export async function uploadResume(formData) {
  const response = await api.post("/resume/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function generateInterviewQuestions(payload) {
  const response = await api.post("/interview/generate", payload);
  return response.data;
}

export async function evaluateInterviewAnswer(payload) {
  const response = await api.post("/interview/evaluate", payload);
  return response.data;
}

export async function sendChatMessage(message, context = {}) {
  const response = await api.post("/chat", {
    message,
    context,
  });
  return response.data;
}
