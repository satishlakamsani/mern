import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../api";
import { useAuth } from "../AuthContext.jsx";
import TaskItem from "../components/TaskItem.jsx";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "active", label: "To do" },
  { id: "done", label: "Done" },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setTasks(await api("/tasks"));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const add = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const task = await api("/tasks", { method: "POST", body: { title, priority } });
      setTasks((t) => [task, ...t]);
      setTitle("");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const update = async (id, patch) => {
    try {
      const updated = await api(`/tasks/${id}`, { method: "PUT", body: patch });
      setTasks((t) => t.map((x) => (x._id === id ? updated : x)));
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (id) => {
    try {
      await api(`/tasks/${id}`, { method: "DELETE" });
      setTasks((t) => t.filter((x) => x._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const visible = useMemo(
    () =>
      tasks
        .filter((t) => (filter === "active" ? !t.done : filter === "done" ? t.done : true))
        .sort((a, b) => Number(a.done) - Number(b.done)),
    [tasks, filter]
  );

  const doneCount = tasks.filter((t) => t.done).length;
  const pct = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;

  return (
    <div className="shell">
      <header className="topbar">
        <h1>Taskboard</h1>
        <div>
          <span className="who">{user.name}</span>
          <button className="ghost" onClick={logout}>Sign out</button>
        </div>
      </header>

      <section className="progress" aria-label="Progress">
        <p><strong>{doneCount}</strong> of {tasks.length} done</p>
        <div className="bar"><span style={{ width: `${pct}%` }} /></div>
      </section>

      <form className="add" onSubmit={add}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs doing?"
          maxLength={140}
          aria-label="Task title"
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)} aria-label="Priority">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button className="primary">Add task</button>
      </form>

      {error && <p className="error" role="alert">{error}</p>}

      <nav className="filters" aria-label="Filter tasks">
        {FILTERS.map((f) => (
          <button key={f.id} className={filter === f.id ? "on" : ""} onClick={() => setFilter(f.id)}>
            {f.label}
          </button>
        ))}
      </nav>

      {loading ? (
        <p className="empty">Loading tasks…</p>
      ) : visible.length === 0 ? (
        <p className="empty">
          {tasks.length === 0 ? "No tasks yet. Add your first one above." : "Nothing in this view."}
        </p>
      ) : (
        <ul className="tasks">
          {visible.map((t) => (
            <TaskItem key={t._id} task={t} onUpdate={update} onDelete={remove} />
          ))}
        </ul>
      )}
    </div>
  );
}
