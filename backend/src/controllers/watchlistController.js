/**
 * @file backend/src/controllers/watchlistController.js
 * @description Watchlist CRUD using Prisma with:
 *  - Bulk ID array endpoint for O(1) client-side Set hydration
 *  - Compound unique constraint for race-condition safety
 *  - mediaType (MOVIE | TV) support for universal media
 */

import { prisma } from "../config/prisma.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ---------------------------------------------------------------------------

/**
 * GET /api/v1/watchlist
 * Full watchlist for the authenticated user, newest first.
 */
export const getWatchlist = asyncHandler(async (req, res) => {
  const items = await prisma.watchlist.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" },
  });
  return ApiResponse.success(res, items, "Watchlist retrieved.");
});

// ---------------------------------------------------------------------------

/**
 * GET /api/v1/watchlist/ids
 * Returns a compact { mediaId, mediaType }[] array.
 * The frontend hydrates an O(1) Set from this on session boot.
 */
export const getWatchlistIds = asyncHandler(async (req, res) => {
  const ids = await prisma.watchlist.findMany({
    where: { userId: req.user.id },
    select: { mediaId: true, mediaType: true },
  });
  return ApiResponse.success(res, ids, "Watchlist IDs retrieved.");
});

// ---------------------------------------------------------------------------

/**
 * POST /api/v1/watchlist
 * Add a media item. Idempotent — returns existing record if already bookmarked.
 */
export const addToWatchlist = asyncHandler(async (req, res) => {
  const {
    mediaId,
    mediaType,
    title,
    posterPath,
    backdropPath,
    overview,
    voteAverage,
    releaseDate,
  } = req.body;

  const existing = await prisma.watchlist.findUnique({
    where: {
      userId_mediaId_mediaType: {
        userId: req.user.id,
        mediaId: Number(mediaId),
        mediaType,
      },
    },
  });

  if (existing) {
    return ApiResponse.success(res, existing, "Already in your watchlist.");
  }

  const item = await prisma.watchlist.create({
    data: {
      userId: req.user.id,
      mediaId: Number(mediaId),
      mediaType,
      title,
      posterPath: posterPath ?? null,
      backdropPath: backdropPath ?? null,
      overview: overview ?? "",
      voteAverage: Number(voteAverage) || 0,
      releaseDate: releaseDate ?? "",
    },
  });

  return ApiResponse.created(res, item, `"${title}" added to your watchlist.`);
});

// ---------------------------------------------------------------------------

/**
 * DELETE /api/v1/watchlist/:mediaId?type=MOVIE
 * Remove a specific media item from the watchlist.
 */
export const removeFromWatchlist = asyncHandler(async (req, res) => {
  const { mediaId } = req.params;
  const mediaType = req.query.type || "MOVIE";

  const deleted = await prisma.watchlist.deleteMany({
    where: {
      userId: req.user.id,
      mediaId: Number(mediaId),
      mediaType,
    },
  });

  if (deleted.count === 0) {
    throw ApiError.notFound("Item not found in your watchlist.");
  }

  return ApiResponse.success(
    res,
    { mediaId: Number(mediaId), mediaType },
    "Removed from your watchlist."
  );
});

// ---------------------------------------------------------------------------

/**
 * GET /api/v1/watchlist/check/:mediaId?type=MOVIE
 * Single item status check.
 */
export const checkWatchlistStatus = asyncHandler(async (req, res) => {
  const { mediaId } = req.params;
  const mediaType = req.query.type || "MOVIE";

  const exists = await prisma.watchlist.findUnique({
    where: {
      userId_mediaId_mediaType: {
        userId: req.user.id,
        mediaId: Number(mediaId),
        mediaType,
      },
    },
    select: { id: true },
  });

  return ApiResponse.success(res, { inWatchlist: Boolean(exists) });
});
