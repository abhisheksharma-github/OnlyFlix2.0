/**
 * @file backend/src/controllers/movieController.js
 * @description TMDB proxy controller exposing unified movie + TV endpoints.
 * All methods call the hardened tmdbService (cached, coalesced, resilient).
 */

import { tmdbService } from "../services/tmdbService.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const parsePage = (query) => Math.max(1, parseInt(query?.page, 10) || 1);

// ── Movies ────────────────────────────────────────────────────────────────────

export const getTrendingMovies = asyncHandler(async (req, res) => {
  const timeWindow = ["day", "week"].includes(req.query.timeWindow)
    ? req.query.timeWindow
    : "week";
  const movies = await tmdbService.getTrendingMovies(timeWindow);
  return ApiResponse.success(res, movies, "Trending movies.");
});

export const getTrendingAll = asyncHandler(async (req, res) => {
  const timeWindow = req.query.timeWindow === "day" ? "day" : "week";
  const items = await tmdbService.getTrendingAll(timeWindow);
  return ApiResponse.success(res, items, "Trending content.");
});

export const getNowPlayingMovies = asyncHandler(async (req, res) => {
  const movies = await tmdbService.getNowPlaying(parsePage(req.query));
  return ApiResponse.success(res, movies, "Now playing.");
});

export const getPopularMovies = asyncHandler(async (req, res) => {
  const movies = await tmdbService.getPopularMovies(parsePage(req.query));
  return ApiResponse.success(res, movies, "Popular movies.");
});

export const getTopRatedMovies = asyncHandler(async (req, res) => {
  const movies = await tmdbService.getTopRatedMovies(parsePage(req.query));
  return ApiResponse.success(res, movies, "Top rated movies.");
});

export const getUpcomingMovies = asyncHandler(async (req, res) => {
  const movies = await tmdbService.getUpcomingMovies(parsePage(req.query));
  return ApiResponse.success(res, movies, "Upcoming movies.");
});

// ── TV ────────────────────────────────────────────────────────────────────────

export const getPopularTV = asyncHandler(async (req, res) => {
  const shows = await tmdbService.getPopularTV(parsePage(req.query));
  return ApiResponse.success(res, shows, "Popular TV shows.");
});

export const getTopRatedTV = asyncHandler(async (req, res) => {
  const shows = await tmdbService.getTopRatedTV(parsePage(req.query));
  return ApiResponse.success(res, shows, "Top rated TV shows.");
});

// ── Details (Movie + TV unified) ──────────────────────────────────────────────

export const getMediaDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const type = req.query.type === "tv" ? "tv" : "movie";
  const details = await tmdbService.getDetails(id, type);
  if (!details) throw ApiError.notFound(`No ${type} found with ID ${id}.`);
  return ApiResponse.success(res, details, "Media details.");
});

export const getWatchProviders = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const type = req.query.type === "tv" ? "tv" : "movie";
  const providers = await tmdbService.getWatchProviders(id, type);
  return ApiResponse.success(res, providers, "Watch providers.");
});

export const getBestTrailer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const type = req.query.type === "tv" ? "tv" : "movie";
  const trailer = await tmdbService.getBestTrailer(id, type);
  return ApiResponse.success(res, trailer, "Trailer.");
});

// ── TV Season & Episodes ──────────────────────────────────────────────────────

export const getSeasonDetails = asyncHandler(async (req, res) => {
  const { seriesId, seasonNumber } = req.params;
  const data = await tmdbService.getSeasonDetails(seriesId, Number(seasonNumber));
  if (!data) throw ApiError.notFound("Season not found.");
  return ApiResponse.success(res, data, "Season details.");
});

export const getEpisodeDetails = asyncHandler(async (req, res) => {
  const { seriesId, seasonNumber, episodeNumber } = req.params;
  const data = await tmdbService.getEpisodeDetails(
    seriesId,
    Number(seasonNumber),
    Number(episodeNumber)
  );
  if (!data) throw ApiError.notFound("Episode not found.");
  return ApiResponse.success(res, data, "Episode details.");
});

// ── Search ────────────────────────────────────────────────────────────────────

export const searchMulti = asyncHandler(async (req, res) => {
  const query = req.query.query?.trim() || "";
  if (!query) return ApiResponse.success(res, [], "No query provided.");
  const results = await tmdbService.searchMulti(query, parsePage(req.query));
  return ApiResponse.success(res, results, `Search results for "${query}".`);
});

export const searchMovies = asyncHandler(async (req, res) => {
  const query = req.query.query?.trim() || "";
  const results = await tmdbService.searchMovies(query, parsePage(req.query));
  return ApiResponse.success(res, results, "Movie search results.");
});

export const searchTV = asyncHandler(async (req, res) => {
  const query = req.query.query?.trim() || "";
  const results = await tmdbService.searchTV(query, parsePage(req.query));
  return ApiResponse.success(res, results, "TV search results.");
});

// ── Genres ────────────────────────────────────────────────────────────────────

export const getGenres = asyncHandler(async (req, res) => {
  const type = req.query.type === "tv" ? "tv" : "movie";
  const genres = type === "tv"
    ? await tmdbService.getTVGenres()
    : await tmdbService.getMovieGenres();
  return ApiResponse.success(res, genres, `${type} genres.`);
});
