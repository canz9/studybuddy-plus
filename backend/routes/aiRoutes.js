import express from "express";
import OpenAI from "openai";

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// POST /api/ai/generate
router.post("/generate", async (req, res, next) => {
  try {
    const { topicName } = req.body;

    if (!topicName || !topicName.trim()) {
      return res.status(400).json({ message: "topicName is required" });
    }

    const prompt = `
You are generating simple flashcard questions for a college student.

Topic: "${topicName}"

Generate EXACTLY 2 flashcards as a JSON array.
Each item must have this shape:
{ "question": "question text", "answer": "answer text" }

Rules:
- Respond with JSON ONLY, no extra text, no explanation.
- Do NOT wrap the JSON in backticks.
Example format:
[
  { "question": "Q1", "answer": "A1" },
  { "question": "Q2", "answer": "A2" }
]
`;

    const completion = await openai.responses.create({
      model: "gpt-4o-mini",
      input: prompt
    });

    const text = completion.output_text;

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (parseErr) {
      console.error("JSON parse error. Model output was:\n", text);
      return res
        .status(500)
        .json({ message: "Model did not return valid JSON. Check server logs." });
    }

    if (!Array.isArray(parsed)) {
      console.error("Model output is not an array:", parsed);
      return res
        .status(500)
        .json({ message: "Model output format unexpected (not an array)." });
    }

    return res.json({ questions: parsed, source: "openai" });
  } catch (err) {
    if (
      err.status === 429 ||
      err.code === "insufficient_quota" ||
      err?.error?.code === "insufficient_quota"
    ) {
      console.warn(
        "OpenAI quota exceeded. Using fallback questions instead. Original error:",
        err.message
      );

      const { topicName } = req.body;

      // Simple non-AI fallback 
      const fallbackQuestions = [
        {
          question: `What is one key idea related to "${topicName}"?`,
          answer: `A key idea for "${topicName}" is something you should review from your notes or textbook.`
        },
        {
          question: `Can you explain an important term or concept in "${topicName}"?`,
          answer: `Pick an important term in "${topicName}" and write a short definition in your own words.`
        }
      ];

      return res.json({
        questions: fallbackQuestions,
        source: "fallback_no_quota"
      });
    }

    console.error("AI generation error:", err);
    next(err);
  }
});

export default router;