export default function QuestionList({ questions, onDelete }) {
  if (questions.length === 0) return <p>No questions yet.</p>;

  return (
    <ul className="question-list">
      {questions.map((q) => (
        <li key={q._id} className="question-card">
          <p><strong>Q:</strong> {q.questionText}</p>
          <p><strong>A:</strong> {q.answerText}</p>
          <button onClick={() => onDelete(q._id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}