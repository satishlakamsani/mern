const router = require("express").Router();
const Task = require("../models/Task");
const protect = require("../middleware/auth");

router.use(protect);

// List my tasks (optional ?status=active|done)
router.get("/", async (req, res, next) => {
  try {
    const filter = { user: req.user._id };
    if (req.query.status === "active") filter.done = false;
    if (req.query.status === "done") filter.done = true;
    res.json(await Task.find(filter).sort({ done: 1, createdAt: -1 }));
  } catch (err) { next(err); }
});

// Create
router.post("/", async (req, res, next) => {
  try {
    const { title, priority } = req.body;
    if (!title || !title.trim()) return res.status(400).json({ message: "Task title is required." });
    res.status(201).json(await Task.create({ user: req.user._id, title, priority }));
  } catch (err) { next(err); }
});

// Update (title, priority, done)
router.put("/:id", async (req, res, next) => {
  try {
    const { title, priority, done } = req.body;
    const changes = {};
    if (title !== undefined) changes.title = title;
    if (priority) changes.priority = priority;
    if (done !== undefined) changes.done = done;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: changes },
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found." });
    res.json(task);
  } catch (err) { next(err); }
});

// Delete
router.delete("/:id", async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found." });
    res.json({ id: task._id });
  } catch (err) { next(err); }
});

module.exports = router;
