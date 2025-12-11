import express from "express";
import { Question } from "../models/Question.js";
import { QuizAttempt } from "../models/QuizAttempt.js";

const router = express.Router();

// helper to compute stats
async function computeStats() {
  const attempts = await QuizAttempt.find();
  const totalQuizzes = attempts.length;
  const totalQuestions = attempts.reduce((acc, a) => acc + a.totalQuestions, 0);
  const totalCorrect = attempts.reduce((acc, a) => acc + a.correctCount, 0);
  const accuracy = totalQuestions ? totalCorrect / totalQuestions : 0;
  return { totalQuizzes, totalQuestions, totalCorrect, accuracy };
}

// GET /api/topics/:topicId/quiz?limit=10
router.get("/topics/:topicId/quiz", async (req, res, next) => {
  try {
    const { topicId } = req.params;
    const limit = Number(req.query.limit) || 10;

    const allQuestions = await Question.find({ topicId });
    const shuffled = allQuestions.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, limit);

    res.json(selected);
  } catch (err) {
    next(err);
  }
});

// POST /api/quiz-attempts
router.post("/quiz-attempts", async (req, res, next) => {
  try {
    const { topicId, totalQuestions, correctCount } = req.body;
    const attempt = await QuizAttempt.create({ topicId, totalQuestions, correctCount });

    // compute latest stats
    const stats = await computeStats();

    // emit real-time event to all connected clients
    const io = req.app.get("io");
    if (io) {
      io.emit("quiz:completed", stats);
    }

    res.status(201).json({ attempt, stats });
  } catch (err) {
    next(err);
  }
});

// GET /api/stats
router.get("/stats", async (req, res, next) => {
  try {
    const stats = await computeStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

export default router;