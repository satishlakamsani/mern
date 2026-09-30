import { useState } from "react";

export default function TaskItem({ task, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(task.title);

  const save = () => {
    const next = text.trim();
    if (next && next !== task.title) onUpdate(task._id, { title: next });
    else setText(task.title);
    setEditing(false);
  };

  return (
    <li className={`task ${task.done ? "is-done" : ""}`}>
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => onUpdate(task._id, { done: !task.done })}
        aria-label={`Mark "${task.title}" as ${task.done ? "not done" : "done"}`}
      />

      {editing ? (
        <input
          className="edit"
          autoFocus
          value={text}
          maxLength={140}
          onChange={(e) => setText(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") { setText(task.title); setEditing(false); }
          }}
        />
      ) : (
        <span className="title" onDoubleClick={() => setEditing(true)}>{task.title}</span>
      )}

      <select
        className={`prio ${task.priority}`}
        value={task.priority}
        onChange={(e) => onUpdate(task._id, { priority: e.target.value })}
        aria-label="Priority"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <button className="ghost" onClick={() => setEditing(true)}>Edit</button>
      <button className="ghost danger" onClick={() => onDelete(task._id)}>Delete</button>
    </li>
  );
}
