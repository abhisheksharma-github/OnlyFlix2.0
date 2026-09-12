import express from "express";
import authRoutes from "./authRoutes.js";
import movieRoutes from "./movieRoutes.js";
import watchlistRoutes from "./watchlistRoutes.js";
import historyRoutes from "./historyRoutes.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const apiRouter = express.Router();

apiRouter.get("/health", (req, res) => {
  return ApiResponse.success(res, { status: "healthy", timestamp: new Date().toISOString() }, "OnlyFlix API is running smoothly.");
});

apiRouter.use("/auth", authRoutes);
apiRouter.use("/user", authRoutes); // Alias for backward compatibility
apiRouter.use("/movies", movieRoutes);
apiRouter.use("/watchlist", watchlistRoutes);
apiRouter.use("/history", historyRoutes);

export default apiRouter;
