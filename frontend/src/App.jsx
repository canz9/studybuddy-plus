import { Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import TopicDetail from "./pages/TopicDetail.jsx";
import Quiz from "./pages/Quiz.jsx";

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <Link to="/" className="logo">StudyBuddy+</Link>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/topics/:topicId" element={<TopicDetail />} />
          <Route path="/topics/:topicId/quiz" element={<Quiz />} />
        </Routes>
      </main>
    </div>
  );
}