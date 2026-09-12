import { WatchHistory } from "../models/historyModel.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getHistory = asyncHandler(async (req, res) => {
  const history = await WatchHistory.find({ userId: req.user._id })
    .sort({ lastWatchedAt: -1 })
    .limit(20);

  return ApiResponse.success(res, history, "Watch history retrieved.");
});

export const recordHistory = asyncHandler(async (req, res) => {
  const { movieId, title, posterPath, backdropPath, progressSeconds, durationSeconds } = req.body;

  const item = await WatchHistory.findOneAndUpdate(
    { userId: req.user._id, movieId },
    {
      title,
      posterPath,
      backdropPath,
      progressSeconds,
      durationSeconds,
      lastWatchedAt: new Date(),
    },
    { upsert: true, new: true }
  );

  return ApiResponse.success(res, item, "Playback progress recorded.");
});

export const clearHistory = asyncHandler(async (req, res) => {
  await WatchHistory.deleteMany({ userId: req.user._id });
  return ApiResponse.success(res, null, "Watch history cleared.");
});
