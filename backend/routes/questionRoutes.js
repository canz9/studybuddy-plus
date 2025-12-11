import express from "express";
import { Question } from "../models/Question.js";

const router = express.Router();

// GET /api/topics/:topicId/questions
router.get("/topics/:topicId/questions", async (req, res, next) => {
  try {
    const questions = await Question.find({ topicId: req.params.topicId }).sort({
      createdAt: -1
    });
    res.json(questions);
  } catch (err) {
    next(err);
  }
});

// POST /api/topics/:topicId/questions
router.post("/topics/:topicId/questions", async (req, res, next) => {
  try {
    const { questionText, answerText } = req.body;
    const question = await Question.create({
      topicId: req.params.topicId,
      questionText,
      answerText
    });
    res.status(201).json(question);
  } catch (err) {
    next(err);
  }
});

// PUT /api/questions/:id
router.put("/questions/:id", async (req, res, next) => {
  try {
    const { questionText, answerText } = req.body;
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { questionText, answerText },
      { new: true }
    );
    if (!question) return res.status(404).json({ message: "Question not found" });
    res.json(question);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/questions/:id
router.delete("/questions/:id", async (req, res, next) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) return res.status(404).json({ message: "Question not found" });
    res.json({ message: "Question deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;