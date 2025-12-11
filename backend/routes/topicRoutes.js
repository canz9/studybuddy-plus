import express from "express";
import { Topic } from "../models/Topic.js";
import { Question } from "../models/Question.js";

const router = express.Router();

// GET /api/topics
router.get("/", async (req, res, next) => {
  try {
    const topics = await Topic.find().sort({ createdAt: -1 });
    res.json(topics);
  } catch (err) {
    next(err);
  }
});

// POST /api/topics
router.post("/", async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const topic = await Topic.create({ name, description });
    res.status(201).json(topic);
  } catch (err) {
    next(err);
  }
});

// GET /api/topics/:id
router.get("/:id", async (req, res, next) => {
  try {
    const topic = await Topic.findById(req.params.id);
    if (!topic) return res.status(404).json({ message: "Topic not found" });

    const questionCount = await Question.countDocuments({ topicId: topic._id });
    res.json({ ...topic.toObject(), questionCount });
  } catch (err) {
    next(err);
  }
});

// PUT /api/topics/:id
router.put("/:id", async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const topic = await Topic.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );
    if (!topic) return res.status(404).json({ message: "Topic not found" });
    res.json(topic);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/topics/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const topic = await Topic.findByIdAndDelete(req.params.id);
    if (!topic) return res.status(404).json({ message: "Topic not found" });

    await Question.deleteMany({ topicId: topic._id });
    res.json({ message: "Topic and questions deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;