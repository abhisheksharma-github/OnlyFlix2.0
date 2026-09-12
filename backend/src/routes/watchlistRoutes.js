import express from "express";
import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  checkWatchlistStatus,
} from "../controllers/watchlistController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { addToWatchlistSchema } from "../validators/watchlistValidators.js";

const router = express.Router();

router.use(authenticate);

router.get("/", getWatchlist);
router.post("/", validate(addToWatchlistSchema), addToWatchlist);
router.get("/check/:movieId", checkWatchlistStatus);
router.delete("/:movieId", removeFromWatchlist);

export default router;
