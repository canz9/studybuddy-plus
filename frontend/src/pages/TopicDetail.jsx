import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../api/axiosClient.js";
import QuestionForm from "../components/QuestionForm.jsx";
import QuestionList from "../components/QuestionList.jsx";

export default function TopicDetail() {
  const { topicId } = useParams();
  const navigate = useNavigate();

  const [topic, setTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [generated, setGenerated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  async function fetchTopic() {
    const res = await api.get(`/topics/${topicId}`);
    setTopic(res.data);
  }

  async function fetchQuestions() {
    const res = await api.get(`/topics/${topicId}/questions`);
    setQuestions(res.data);
  }

  async function fetchAll() {
    try {
      setLoading(true);
      await Promise.all([fetchTopic(), fetchQuestions()]);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load topic");
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId]);

  async function handleAddQuestion(data) {
    try {
      await api.post(`/topics/${topicId}/questions`, data);
      await fetchQuestions();
    } catch (err) {
      console.error(err);
      setError("Failed to add question");
    }
  }

  async function handleDeleteQuestion(id) {
    try {
      await api.delete(`/questions/${id}`);
      await fetchQuestions();
    } catch (err) {
      console.error(err);
      setError("Failed to delete question");
    }
  }

  async function handleGenerateAI() {
    if (!topic) return;
    try {
      setGenerating(true);
      setError("");
      const res = await api.post("/ai/generate", {
        topicName: topic.name
      });
      setGenerated(res.data.questions || []);
      if (res.data.source === "fallback_no_quota") {
      setError("AI quota exceeded — showing fallback questions instead.");
      }
    } catch (err) {
      console.error(err);
      setError("AI question generation failed. Try again later");
    } finally {
      setGenerating(false);
    }
  }

  if (loading || !topic) {
    return <p style={{ padding: "1rem" }}>Loading topic...</p>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="topic-detail"
    >
      <Link to="/">← Back to all topics</Link>

      <h1>{topic.name}</h1>
      {topic.description && <p>{topic.description}</p>}

      {error && <p style={{ color: "salmon" }}>{error}</p>}

      <div style={{ margin: "1rem 0" }}>
        <button
          onClick={() => navigate(`/topics/${topicId}/quiz`)}
          disabled={questions.length === 0}
        >
          Start Quiz ({questions.length} questions)
        </button>
      </div>

      <div style={{ margin: "1rem 0" }}>
        <button onClick={handleGenerateAI} disabled={generating}>
          {generating ? "Generating..." : "Generate AI Questions"}
        </button>
      </div>

      {generated.length > 0 && (
        <div className="ai-box">
          <h3>AI Suggestions</h3>
          {generated.map((q, i) => (
            <div key={i} className="ai-card">
              <p>
                <strong>Q:</strong> {q.question}
              </p>
              <p>
                <strong>A:</strong> {q.answer}
              </p>
              <button
                onClick={() =>
                  handleAddQuestion({
                    questionText: q.question,
                    answerText: q.answer
                  })
                }
              >
                Save to Topic
              </button>
            </div>
          ))}
        </div>
      )}

      <h2 style={{ marginTop: "2rem" }}>Questions</h2>
      <QuestionForm onSubmit={handleAddQuestion} />
      <QuestionList questions={questions} onDelete={handleDeleteQuestion} />
    </motion.div>
  );
}