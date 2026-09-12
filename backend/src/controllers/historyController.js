/**
 * @file backend/src/controllers/historyController.js
 * @description Watch history controller using Prisma.
 * Tracks per-episode progress for TV shows and per-movie progress.
 * Provides a "continue watching" feed ordered by most recent activity.
 */

import { prisma } from "../config/prisma.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ---------------------------------------------------------------------------

/**
 * GET /api/v1/history
 * Returns the 24 most recently updated history records.
 * Frontend "Continue Watching" row consumes this.
 */
export const getHistory = asyncHandler(async (req, res) => {
  const history = await prisma.watchHistory.findMany({
    where: { userId: req.user.id },
    orderBy: { updatedAt: "desc" },
    take: 24,
  });
  return ApiResponse.success(res, history, "Watch history retrieved.");
});

// ---------------------------------------------------------------------------

/**
 * GET /api/v1/history/incomplete
 * In-progress items only — useful for "Resume Watching" carousels.
 */
export const getIncompleteHistory = asyncHandler(async (req, res) => {
  const history = await prisma.watchHistory.findMany({
    where: { userId: req.user.id, completed: false },
    orderBy: { updatedAt: "desc" },
    take: 12,
  });
  return ApiResponse.success(res, history, "In-progress items retrieved.");
});

// ---------------------------------------------------------------------------

/**
 * POST /api/v1/history
 * Upsert progress for a movie or TV episode.
 * The compound unique constraint on (userId, mediaId, mediaType, season, episode)
 * ensures exactly one progress record per user per content unit.
 */
export const recordHistory = asyncHandler(async (req, res) => {
  const {
    mediaId,
    mediaType,
    title,
    posterPath,
    seasonNumber,
    episodeNumber,
    progressSeconds,
    durationSeconds,
  } = req.body;

  const completed =
    durationSeconds > 0
      ? progressSeconds / durationSeconds >= 0.9
      : false;

  const record = await prisma.watchHistory.upsert({
    where: {
      userId_mediaId_mediaType_seasonNumber_episodeNumber: {
        userId: req.user.id,
        mediaId: Number(mediaId),
        mediaType,
        seasonNumber: seasonNumber ?? null,
        episodeNumber: episodeNumber ?? null,
      },
    },
    update: {
      progressSeconds: Number(progressSeconds),
      durationSeconds: Number(durationSeconds),
      completed,
      title: title ?? undefined,
      posterPath: posterPath ?? undefined,
    },
    create: {
      userId: req.user.id,
      mediaId: Number(mediaId),
      mediaType,
      title: title ?? "",
      posterPath: posterPath ?? null,
      seasonNumber: seasonNumber ?? null,
      episodeNumber: episodeNumber ?? null,
      progressSeconds: Number(progressSeconds),
      durationSeconds: Number(durationSeconds),
      completed,
    },
  });

  return ApiResponse.success(res, record, "Playback progress saved.");
});

// ---------------------------------------------------------------------------

/**
 * DELETE /api/v1/history/:mediaId?type=MOVIE
 * Remove all history records for a specific media item.
 */
export const removeFromHistory = asyncHandler(async (req, res) => {
  const { mediaId } = req.params;
  const mediaType = req.query.type || "MOVIE";

  await prisma.watchHistory.deleteMany({
    where: {
      userId: req.user.id,
      mediaId: Number(mediaId),
      mediaType,
    },
  });

  return ApiResponse.success(res, null, "History entries removed.");
});

// ---------------------------------------------------------------------------

/**
 * DELETE /api/v1/history
 * Wipe all history for the authenticated user.
 */
export const clearHistory = asyncHandler(async (req, res) => {
  await prisma.watchHistory.deleteMany({ where: { userId: req.user.id } });
  return ApiResponse.success(res, null, "Watch history cleared.");
});
