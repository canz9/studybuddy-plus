import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: true },
    questionText: { type: String, required: true },
    answerText: { type: String, required: true }
  },
  { timestamps: true }
);

export const Question = mongoose.model("Question", questionSchema);