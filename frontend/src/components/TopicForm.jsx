import { useState } from "react";

export default function TopicForm({ onSubmit }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name, description });
    setName("");
    setDescription("");
  }

  return (
    <form className="topic-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Topic name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit">Add Topic</button>
    </form>
  );
}