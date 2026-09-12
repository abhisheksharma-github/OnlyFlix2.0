import { Watchlist } from "../models/watchlistModel.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getWatchlist = asyncHandler(async (req, res) => {
  const items = await Watchlist.find({ userId: req.user._id }).sort({ createdAt: -1 });
  return ApiResponse.success(res, items, "Watchlist fetched successfully.");
});

export const addToWatchlist = asyncHandler(async (req, res) => {
  const { movieId, title, posterPath, backdropPath, overview, voteAverage, releaseDate } = req.body;

  const existing = await Watchlist.findOne({ userId: req.user._id, movieId });
  if (existing) {
    return ApiResponse.success(res, existing, "Movie is already in your watchlist.");
  }

  const item = await Watchlist.create({
    userId: req.user._id,
    movieId,
    title,
    posterPath,
    backdropPath,
    overview,
    voteAverage,
    releaseDate,
  });

  return ApiResponse.created(res, item, "Movie added to your watchlist.");
});

export const removeFromWatchlist = asyncHandler(async (req, res) => {
  const { movieId } = req.params;

  const deleted = await Watchlist.findOneAndDelete({
    userId: req.user._id,
    movieId: Number(movieId),
  });

  if (!deleted) {
    throw ApiError.notFound("Movie not found in your watchlist.");
  }

  return ApiResponse.success(res, { movieId: Number(movieId) }, "Movie removed from your watchlist.");
});

export const checkWatchlistStatus = asyncHandler(async (req, res) => {
  const { movieId } = req.params;

  const exists = await Watchlist.exists({
    userId: req.user._id,
    movieId: Number(movieId),
  });

  return ApiResponse.success(res, { inWatchlist: Boolean(exists) });
});
