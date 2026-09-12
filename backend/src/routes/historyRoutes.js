import express from "express";
import { getHistory, recordHistory, clearHistory } from "../controllers/historyController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { historySchema } from "../validators/watchlistValidators.js";

const router = express.Router();

router.use(authenticate);

router.get("/", getHistory);
router.post("/", validate(historySchema), recordHistory);
router.delete("/", clearHistory);

export default router;
