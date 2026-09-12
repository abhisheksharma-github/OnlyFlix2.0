import express from "express";
import {
  getWatchlist,
  getWatchlistIds,
  addToWatchlist,
  removeFromWatchlist,
  checkWatchlistStatus,
} from "../controllers/watchlistController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticate);

router.get("/", getWatchlist);
router.get("/ids", getWatchlistIds);                     // O(1) Set hydration endpoint
router.post("/", addToWatchlist);
router.get("/check/:mediaId", checkWatchlistStatus);
router.delete("/:mediaId", removeFromWatchlist);

export default router;
