import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./src/config/env.js";
import { prisma } from "./src/config/prisma.js";
import apiRouter from "./src/routes/index.js";
import { errorHandler, notFoundHandler } from "./src/middleware/errorMiddleware.js";

const app = express();

// Trust reverse proxy (Render, Railway, Vercel, Cloudflare, etc.)
app.set("trust proxy", 1);

// Verify Neon/Prisma connectivity at startup
prisma.$connect().then(() => {
  console.log("[OnlyFlix] ✔ Connected to Neon PostgreSQL via Prisma");
}).catch((err) => {
  console.error("[OnlyFlix] ✘ Database connection failed:", err.message);
});

// Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  })
);

const limiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: "RATE_LIMIT_EXCEEDED",
      message: "Too many requests from this IP. Please slow down.",
    },
  },
});
app.use("/api/", limiter);

// CORS configuration supporting single/multiple origins and Vercel/Render deployments
const configuredOrigins = env.CLIENT_URL
  ? env.CLIENT_URL.split(",").map((url) => url.trim().replace(/\/$/, ""))
  : [];

const defaultAllowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173",
  ...configuredOrigins,
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl, server-to-server, mobile)
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.replace(/\/$/, "");

      const isAllowed =
        defaultAllowedOrigins.includes(normalizedOrigin) ||
        /\.vercel\.app$/.test(normalizedOrigin) ||
        /\.netlify\.app$/.test(normalizedOrigin) ||
        /\.onrender\.com$/.test(normalizedOrigin) ||
        env.NODE_ENV === "development";

      if (isAllowed) {
        return callback(null, true);
      }

      console.warn(`[CORS Blocked] Origin: ${origin}`);
      return callback(new Error(`Origin ${origin} not allowed by CORS policy.`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

// Body parsers
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Root & Health Check Endpoints
app.get("/", (req, res) => {
  res.json({
    success: true,
    name: "OnlyFlix 2.0 API Gateway",
    version: "2.0.0",
    status: "active",
    environment: env.NODE_ENV,
    apiBase: "/api/v1",
    documentation: "https://github.com/abhisheksharma-github/OnlyFlix2.0",
  });
});

app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "healthy", database: "connected", timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(503).json({ status: "unhealthy", database: err.message, timestamp: new Date().toISOString() });
  }
});

// API v1 Routes
app.use("/api/v1", apiRouter);

// 404 & Central Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

const server = app.listen(env.PORT, () => {
  console.log(`[OnlyFlix Server] Listening on port ${env.PORT} in ${env.NODE_ENV} mode`);
});

// Process event handlers
process.on("unhandledRejection", (err) => {
  console.error("[Unhandled Rejection]:", err);
});

process.on("uncaughtException", (err) => {
  console.error("[Uncaught Exception]:", err);
  process.exit(1);
});

const shutdown = () => {
  console.log("[OnlyFlix Server] Gracefully shutting down...");
  server.close(async () => {
    await prisma.$disconnect();
    console.log("[OnlyFlix Server] Prisma disconnected. Process terminated.");
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

export default app;
