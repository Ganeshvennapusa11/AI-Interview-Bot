import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function InterviewSession() {
  const { state } = useLocation();
  const role = state?.role?.title || "Unknown Role";
  const round = state?.round || "technical";

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    const res = await fetch("http://localhost:5000/api/interview/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, round })
    });

    const data = await res.json();
    setQuestions(data.questions || []);
  };

  const submitAnswer = async () => {
    const res = await fetch("http://localhost:5000/api/interview/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: questions[currentIndex],
        answer
      })
    });

    const data = await res.json();
    setFeedback(data.feedback);
  };

  const nextQuestion = () => {
    setAnswer("");
    setFeedback("");
    setCurrentIndex(prev => prev + 1);
  };

  return (
    <div>
      <h2>{round.toUpperCase()} - {role}</h2>

      {questions.length > 0 && (
        <>
          <h3>Question {currentIndex + 1}</h3>
          <p>{questions[currentIndex]}</p>

          <textarea
            value={answer}
            onChange={e => setAnswer(e.target.value)}
          />

          <button onClick={submitAnswer}>Submit</button>
          <button onClick={nextQuestion}>Next</button>

          {feedback && <p><b>Feedback:</b> {feedback}</p>}
        </>
      )}
    </div>
  );
}
