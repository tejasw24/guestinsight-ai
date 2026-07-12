import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";

import connectDB from "./config/db.js";
import passport from "./config/passport.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Security and request middleware
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// Initialize Google authentication
app.use(passport.initialize());

const PORT = process.env.PORT || 5000;

// Home route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "GuestInsight AI Backend is Running 🚀",
  });
});

// API routes
app.use("/api/reviews", reviewRoutes);
app.use("/api/auth", authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});