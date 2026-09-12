import express from "express";
import authRoutes from "./authRoutes.js";
import movieRoutes from "./movieRoutes.js";
import watchlistRoutes from "./watchlistRoutes.js";
import historyRoutes from "./historyRoutes.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { prisma } from "../config/prisma.js";

const apiRouter = express.Router();

apiRouter.get("/health", async (req, res) => {
  let dbStatus = "unknown";
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = "healthy";
  } catch {
    dbStatus = "degraded";
  }
  return ApiResponse.success(
    res,
    { status: "healthy", db: dbStatus, timestamp: new Date().toISOString() },
    "OnlyFlix 2.0 API is operational."
  );
});

apiRouter.use("/auth", authRoutes);
apiRouter.use("/movies", movieRoutes);
apiRouter.use("/watchlist", watchlistRoutes);
apiRouter.use("/history", historyRoutes);

export default apiRouter;
