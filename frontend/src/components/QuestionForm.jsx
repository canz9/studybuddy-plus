import { useState } from "react";

export default function QuestionForm({ onSubmit }) {
  const [questionText, setQuestionText] = useState("");
  const [answerText, setAnswerText] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!questionText.trim() || !answerText.trim()) return;
    onSubmit({ questionText, answerText });
    setQuestionText("");
    setAnswerText("");
  }

  return (
    <form className="question-form" onSubmit={handleSubmit}>
      <textarea
        placeholder="Question"
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
      />
      <textarea
        placeholder="Answer"
        value={answerText}
        onChange={(e) => setAnswerText(e.target.value)}
      />
      <button type="submit">Add Question</button>
    </form>
  );
}