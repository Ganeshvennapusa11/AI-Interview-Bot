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

| Layer          | Technology                          |
| -------------- | ----------------------------------- |
| Frontend UI    | React 19, Vite, Tailwind CSS        |
| Backend API    | Node.js, Express 5 (REST API)       |
| Database       | MongoDB (Mongoose)                  |
| AI             | Groq (model auto-selected)          |
| Communication  | Axios                               |
| Resume Parsing | pdf-parse (PDF), mammoth (DOCX)     |

---

## 🔬 What makes this more than an API wrapper

Three parts of this project exist because "call an LLM and print the answer" is
not an engineering result. Each one is measured, not asserted.

### 1. A code judge that measures complexity instead of guessing it

The live coding round runs the candidate's code in a Web Worker against
generated unit tests.

Every problem ships starter code in **JavaScript, Python, C++ and Java**, and
each language keeps its own draft so switching does not lose work:

| Language | Tests run | Complexity measured | How it is graded |
| --- | --- | --- | --- |
| JavaScript | Yes, in a Web Worker | Yes | Executed |
| Python | Yes, on Pyodide (CPython in WebAssembly, downloaded once from a CDN on first use) | Yes | Executed |
| C++ | No | No | Reviewed by reading - browsers have no compiler |
| Java | No | No | Reviewed by reading - browsers have no compiler |

The panel states which of these applied, and the reviewer is told whether the
code was executed so it never claims tests passed when nothing ran. Input
generation stays in JavaScript and crosses into Python as JSON, so a problem
needs only one generator regardless of the chosen language. Adding compiled
languages later means adding a sandboxed execution service (Judge0 or a
container runner) behind the same interface. Once every test passes, it times the same function on
inputs of increasing size (n = 1,000 to 64,000), fits every candidate growth
curve by least squares, and reports the one that explains the measurements,
together with the empirical exponent from a log-log regression.

```text id="judge01"
brute force  ->  4/4 tests  |  measured O(n^2)  b = 1.98  R2 1.000
hash map     ->  4/4 tests  |  measured O(n)    b = 0.97  R2 0.999
```

The feedback then says "your solution is quadratic against a target of O(n)"
because it timed it, not because a model guessed. Warm-up runs and
sub-millisecond samples are discarded before fitting, and the panel says how
many were dropped. Infinite loops are terminated from outside the worker.

Regression test: `cd client && npm run test:sandbox`.

### 2. A deterministic grader as the control condition

`server/src/services/baselineGrader.js` scores answers with no model at all:
role-vocabulary coverage, answer structure (STAR for behavioural rounds,
definition/mechanism/example/tradeoff for technical ones), evidence, causal
reasoning, specificity, length fit and readability. It is fully explainable -
every point traces to a signal - and it is the fallback that keeps the app
grading when the AI provider is down.

Every answer is scored by both graders, and the UI shows both scores with their
agreement.

### 3. An evaluation harness that measures the grader

`server/eval/` holds 48 author-labelled answers spanning four quality tiers, and
a harness that measures each grader against those labels using MAE, RMSE, bias,
Pearson and Spearman correlation, and quadratic weighted kappa.

| Grader | MAE | r | Spearman | QWK |
| --- | --- | --- | --- | --- |
| deterministic baseline (raw) | 1.66 | 0.82 | 0.84 | 0.74 |
| deterministic baseline (calibrated, held-out half) | 1.18 | 0.84 | - | 0.81 |

```bash id="eval01"
cd server
npm run eval -- --graders=baseline --calibrate     # offline, no API calls
npm run eval -- --graders=baseline,v1_plain,v2_rubric_anchored,v3_few_shot
```

The harness surfaced the most instructive bug in the project: early versions
scored fluent-but-empty answers around 5/10, because readability, length and
vocabulary all looked healthy. Fluency is not knowledge, so the grader now caps
any answer showing none of evidence, structure, reasoning or sufficient length.

Method, metrics and limitations: [`server/eval/README.md`](server/eval/README.md).

### Company tiers

Companies interview at different bars, so the company picker sets the round's
difficulty rather than decorating the prompt:

| Level | Examples | DSA | System design |
| --- | --- | --- | --- |
| 1 - Service & early-stage | TCS, Infosys, Wipro, Accenture | Easy to medium, single concept | No |
| 2 - Product & mid-tier | Zoho, Razorpay, Adobe, Oracle | Medium, two concepts, complexity asked | Feature-level only |
| 3 - Top product & big tech | Google, Microsoft, Amazon, Meta, Netflix | Hard, with a constraint that rules out brute force | Yes, plus ambiguous situational scenarios |

The server clamps the requested difficulty into the tier's band, so picking
Google cannot produce an easy round and picking TCS cannot produce a hard one.
Unknown company names fall back to level 2.

### Interviewer personas

The same round is run by a different interviewer depending on the selected
persona - big-tech bar raiser, startup founder, service-company panel,
fundamentals professor, supportive mentor. The persona changes the questions,
the follow-up style and how strictly answers are scored.

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
├── client/                     # React + Vite frontend
│   └── src/
│       ├── pages/              # Home, Login, Signup, Dashboard, Interview, ...
│       ├── components/         # ChatBot, ProtectedRoute, ParticlesBackground
│       ├── layouts/            # MainLayout (sidebar shell)
│       ├── data/               # Role tracks and roadmaps
│       └── services/api.js     # Axios client
│
├── server/                     # Express REST API
│   ├── scripts/                # check-groq, syntax-check
│   └── src/
│       ├── routes/
│       ├── controllers/
│       ├── services/           # Groq, email, coding, and analysis services
│       ├── middleware/
│       ├── models/
│       └── utils/              # Resume parsing, JWT
│
└── README.md
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
npm start            # or: npm run dev

npm test             # syntax check across every source file
npm run lint         # lint the server (uses the client's eslint, no extra install)
npm run check:groq   # list the models your Groq key can use
npm run eval -- --graders=baseline --calibrate   # grader evaluation, offline
```

---

### 4. Frontend Setup

```bash id="frontend02"
cd client
npm install
npm run dev

npm run test:sandbox   # verifies the code judge and complexity measurement
npm run lint
```

---

## 🔑 Environment Variables

### Server (`server/.env`)

```env id="env03"
# Required
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=a_long_random_secret
GROQ_API_KEY=your_groq_api_key
PORT=5000

# Optional: pin a model. Leave unset and the server picks the first one your
# key can use. Run `npm run check:groq` to list them.
# GROQ_MODEL=llama-3.3-70b-versatile

# Used in password-reset links and welcome emails
FRONTEND_URL=http://localhost:5173
# Extra origins allowed by CORS in production (comma separated)
# FRONTEND_URLS=https://your-app.vercel.app

# Required for the forgot-password flow. Without these, no email is ever sent.
# Gmail needs an App Password, not your login password.
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=you@gmail.com
SMTP_PASS=your_app_password
APP_NAME=Interview Companion
```

Copy `server/.env.example` to `server/.env` and fill it in.

### Client (`client/.env`)

```env id="env04"
# No /api suffix - the client appends it
VITE_API_URL=http://localhost:5000
```

---

## 📡 API Overview

| Method | Endpoint                          | Description                       |
| ------ | --------------------------------- | --------------------------------- |
| POST   | /api/user/register                | Register a user                   |
| POST   | /api/user/login                   | Log in                            |
| POST   | /api/user/forgot-password         | Request a reset link              |
| POST   | /api/user/reset-password/:token   | Set a new password                |
| GET    | /api/user/profile                 | Fetch the signed-in profile       |
| PUT    | /api/user/profile                 | Update the profile                |
| POST   | /api/resume/upload                | Upload and analyze a resume       |
| POST   | /api/interview/generate           | Generate interview questions      |
| POST   | /api/interview/evaluate           | Evaluate an answer                |
| POST   | /api/interview/coding/generate    | Create a runnable coding problem  |
| POST   | /api/interview/coding/review      | Review code + measured complexity |
| POST   | /api/chat                         | Interview coach chat              |

All routes except register, login, and the password-reset pair require an
`Authorization: Bearer <token>` header.

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
