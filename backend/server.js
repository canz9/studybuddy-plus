import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";
import topicRoutes from "./routes/topicRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();

// create HTTP server and socket.io server
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Vite dev server
    methods: ["GET", "POST"]
  }
});

// make io available in routes via app
app.set("io", io);

// socket.io events
io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/topics", topicRoutes);
app.use("/api", questionRoutes);
app.use("/api", quizRoutes);
app.use("/api/ai", aiRoutes);

// error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`🚀 Backend + Socket.io running on port ${PORT}`);
  });
});