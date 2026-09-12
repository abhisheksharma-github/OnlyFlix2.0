import express from "express";
import {
  getHistory,
  getIncompleteHistory,
  recordHistory,
  removeFromHistory,
  clearHistory,
} from "../controllers/historyController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticate);

router.get("/", getHistory);
router.get("/incomplete", getIncompleteHistory);  // "Continue Watching" feed
router.post("/", recordHistory);
router.delete("/", clearHistory);
router.delete("/:mediaId", removeFromHistory);

export default router;
