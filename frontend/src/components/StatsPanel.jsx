import { useEffect, useState } from "react";
import { api } from "../api/axiosClient.js";
import { socket } from "../api/socket.js";

export default function StatsPanel() {
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalQuestions: 0,
    totalCorrect: 0,
    accuracy: 0
  });

  // initial fetch
  useEffect(() => {
    async function fetchStats() {
      const res = await api.get("/stats");
      setStats(res.data);
    }
    fetchStats();
  }, []);

  // live updates via socket.io
  useEffect(() => {
    function handleQuizCompleted(newStats) {
      setStats(newStats);
    }

    socket.on("quiz:completed", handleQuizCompleted);

    return () => {
      socket.off("quiz:completed", handleQuizCompleted);
    };
  }, []);

  const accuracyPercent = Math.round(stats.accuracy * 100);

  return (
    <div className="stats-panel">
      <h2>Live Study Stats</h2>
      <p><strong>Total quizzes:</strong> {stats.totalQuizzes}</p>
      <p><strong>Total questions answered:</strong> {stats.totalQuestions}</p>
      <p><strong>Total correct:</strong> {stats.totalCorrect}</p>
      <p><strong>Overall accuracy:</strong> {isNaN(accuracyPercent) ? 0 : accuracyPercent}%</p>
      <small>(updates in real-time as users finish quizzes)</small>
    </div>
  );
}