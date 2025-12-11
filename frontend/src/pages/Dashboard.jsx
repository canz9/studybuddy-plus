import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/axiosClient.js";
import TopicForm from "../components/TopicForm.jsx";
import { motion } from "framer-motion";
import StatsPanel from "../components/StatsPanel.jsx";


export default function Dashboard() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchTopics() {
    setLoading(true);
    const res = await api.get("/topics");
    setTopics(res.data);
    setLoading(false);
  }

  useEffect(() => {
    fetchTopics();
  }, []);

  async function handleCreateTopic(data) {
    await api.post("/topics", data);
    fetchTopics();
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="dashboard"
    >
      <h1>Your Topics</h1>
      <StatsPanel />
      <TopicForm onSubmit={handleCreateTopic} />

      {loading ? (
        <p>Loading...</p>
      ) : topics.length === 0 ? (
        <p>No topics yet. Add your first one!</p>
      ) : (
        <ul className="topic-list">
          {topics.map((t) => (
            <li key={t._id} className="topic-card">
              <Link to={`/topics/${t._id}`}>
                <h2>{t.name}</h2>
                <p>{t.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}