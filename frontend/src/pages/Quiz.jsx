import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../api/axiosClient.js";
import { motion } from "framer-motion";

export default function Quiz() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    async function fetchQuiz() {
      const res = await api.get(`/topics/${topicId}/quiz?limit=10`);
      setQuestions(res.data);
    }
    fetchQuiz();
  }, [topicId]);

  if (!questions.length && !ended) {
    return <p>Loading quiz...</p>;
  }

  async function handleAnswer(isCorrect) {
    if (isCorrect) setCorrectCount((c) => c + 1);

    if (index + 1 < questions.length) {
      setIndex((i) => i + 1);
      setShowAnswer(false);
    } else {
      const finalCorrect = isCorrect ? correctCount + 1 : correctCount;
      setCorrectCount(finalCorrect);
      setEnded(true);
      await api.post("/quiz-attempts", {
        topicId,
        totalQuestions: questions.length,
        correctCount: finalCorrect
      });
    }
  }

  if (ended) {
    const total = questions.length;
    const accuracy = total ? Math.round((correctCount / total) * 100) : 0;
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1>Quiz Complete!</h1>
        <p>
          You got {correctCount} / {questions.length} correct ({accuracy}%)
        </p>
        <button onClick={() => navigate(-1)}>Back to topic</button>
      </motion.div>
    );
  }

  const q = questions[index];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Link to={`/topics/${topicId}`}>← Back</Link>
      <h1>Quiz</h1>
      <p>
        Question {index + 1} / {questions.length}
      </p>

      <motion.div
        key={q._id}
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="quiz-card"
      >
        <p><strong>Q:</strong> {q.questionText}</p>

        {showAnswer && (
          <p className="answer">
            <strong>A:</strong> {q.answerText}
          </p>
        )}

        {!showAnswer ? (
          <button onClick={() => setShowAnswer(true)}>Show answer</button>
        ) : (
          <div className="quiz-buttons">
            <button onClick={() => handleAnswer(true)}>I was right</button>
            <button onClick={() => handleAnswer(false)}>I was wrong</button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}