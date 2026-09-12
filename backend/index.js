import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./src/config/env.js";
import { connectDatabase } from "./src/config/database.js";
import apiRouter from "./src/routes/index.js";
import { errorHandler, notFoundHandler } from "./src/middleware/errorMiddleware.js";

const app = express();

// Connect to MongoDB
connectDatabase();

// Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  })
);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: "RATE_LIMIT_EXCEEDED",
      message: "Too many requests from this IP. Please try again in 15 minutes.",
    },
  },
});
app.use("/api/", limiter);

// CORS configuration
const allowedOrigins = [
  env.CLIENT_URL,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in local dev
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parsers
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// API v1 Routes
app.use("/api/v1", apiRouter);

// 404 & Central Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

const server = app.listen(env.PORT, () => {
  console.log(`[OnlyFlix Server] Listening on http://localhost:${env.PORT} in ${env.NODE_ENV} mode`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("[Unhandled Rejection]:", err);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("[Uncaught Exception]:", err);
  process.exit(1);
});

// Graceful shutdown
const shutdown = () => {
  console.log("[OnlyFlix Server] Gracefully shutting down...");
  server.close(() => {
    console.log("[OnlyFlix Server] Process terminated.");
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

export default app;
