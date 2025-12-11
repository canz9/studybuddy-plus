import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema(
  {
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" },
    totalQuestions: { type: Number, required: true },
    correctCount: { type: Number, required: true }
  },
  { timestamps: true }
);

export const QuizAttempt = mongoose.model("QuizAttempt", quizAttemptSchema);