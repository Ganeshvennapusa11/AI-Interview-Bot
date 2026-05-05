# 🤖 AI Interview Bot: Smart AI-Powered Interview Preparation System

AI Interview Bot is a full-stack web application designed to simulate real-world technical interviews. It leverages resume parsing, role-based question generation, and a personalized learning roadmap to help users systematically improve their skills.

---

## 🚀 Key Features

* 📄 **Resume-Based Questioning**
  Upload resumes and generate interview questions based on extracted skills.

* 🎯 **Role-Based Interview Flow**
  Tailored interviews for roles like Frontend, Backend, Data Science, etc.

* 🧠 **AI-Based Evaluation System**
  Analyze answers and provide structured feedback.

* 🗺️ **Personalized Learning Roadmap (🔥 Key Feature)**
  Generates a step-by-step roadmap based on:

  * Resume gaps
  * Interview performance
  * Skill deficiencies

* 🔐 **Authentication System**
  Secure login/signup with session handling.

* 📊 **Performance Feedback Dashboard**
  Track progress, scores, and improvement areas.

* ⭐ **Favorites & Review System**
  Save important questions and revisit them anytime.

---

## 🛠️ Technical Tech Stack

| Layer          | Technology                      |
| -------------- | ------------------------------- |
| Frontend UI    | React.js, HTML, CSS, JavaScript |
| Backend API    | Node.js, Express.js (REST API)  |
| Database       | MongoDB                         |
| Communication  | Axios                           |
| Resume Parsing | PDF/DOC Processing Libraries    |

---

## 🧠 System Architecture & Logic

### 1. Resume Parsing Engine

* Extracts structured information (skills, projects, experience)
* Converts unstructured resume data into usable format

---

### 2. Role-Based Question Generator

* Matches extracted skills with predefined question banks
* Dynamically generates relevant interview questions

---

### 3. Interview Flow Engine

```text id="flow05"
User → Select Role → Upload Resume → Parse → Generate Questions → Answer → Evaluate
```

* Maintains session-based progression
* Ensures structured interview experience

---

### 4. Feedback & Evaluation Logic

* Compares responses with expected patterns/keywords
* Provides:

  * Strengths
  * Weaknesses
  * Suggestions

---

### 5. 📍 Learning Roadmap Generator (Core Feature)

* Identifies missing or weak skills from:

  * Resume analysis
  * Interview performance

* Generates:

  * 📘 Topics to learn
  * 🛠️ Skills to improve
  * 📅 Suggested progression path

Example:

```text id="roadmap01"
Frontend Role →
Missing: React Hooks, State Management
Roadmap:
1. Learn useState & useEffect
2. Build small React projects
3. Study Redux / Context API
4. Practice interview questions
```

---

## 📂 Project Structure

```text id="struct02"
AI-Interview-Bot/
│
├── client/                 # React Frontend
├── server/                 # Node.js REST API
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── middleware/
│
├── uploads/                # Resume storage
├── README.md
└── package.json
```

---

## 🔧 Installation & Implementation

### 1. Prerequisites

* Node.js (v16+)
* MongoDB (Local / Atlas)

---

### 2. Clone Repository

```bash id="clone02"
git clone https://github.com/Ganeshvennapusa11/AI-Interview-Bot.git
cd AI-Interview-Bot
```

---

### 3. Backend Setup

```bash id="backend02"
cd server
npm install
npm start
```

---

### 4. Frontend Setup

```bash id="frontend02"
cd client
npm install
npm run dev
```

---

## 🔑 Environment Variables

### Server (.env)

```env id="env03"
MONGO_URI=your_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

### Client (.env)

```env id="env04"
VITE_API_URL=http://localhost:5000/api
```

---

## 📡 API Overview

| Method | Endpoint           | Description      |
| ------ | ------------------ | ---------------- |
| POST   | /api/auth/signup   | Register user    |
| POST   | /api/auth/login    | Login            |
| POST   | /api/resume/upload | Upload resume    |
| GET    | /api/interview     | Get questions    |
| POST   | /api/feedback      | Submit answers   |
| GET    | /api/roadmap       | Generate roadmap |

---

## 🔄 Application Workflow

```text id="flow06"
Dashboard → Role Selection → Resume Upload → Interview → Feedback → Roadmap Generation
```

---

## 📌 Future Enhancements

* 🎤 Voice-based interviews
* 🎥 Video interview simulation
* 🤖 LLM-based dynamic questioning
* 📈 Advanced analytics dashboard
* 🌐 Cloud deployment

---

## 🤝 Contribution

1. Fork the repository
2. Create a branch
3. Commit changes
4. Submit a Pull Request

---

## 👨‍💻 Author

**Ganesh Vennapusa**
GitHub: https://github.com/Ganeshvennapusa11

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
