import { tmdbService } from "../services/tmdbService.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getNowPlayingMovies = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const movies = await tmdbService.getNowPlaying(page);
  return ApiResponse.success(res, movies, "Now playing movies fetched successfully.");
});

export const getPopularMovies = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const movies = await tmdbService.getPopular(page);
  return ApiResponse.success(res, movies, "Popular movies fetched successfully.");
});

export const getTopRatedMovies = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const movies = await tmdbService.getTopRated(page);
  return ApiResponse.success(res, movies, "Top rated movies fetched successfully.");
});

export const getUpcomingMovies = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const movies = await tmdbService.getUpcoming(page);
  return ApiResponse.success(res, movies, "Upcoming movies fetched successfully.");
});

export const getTrendingMovies = asyncHandler(async (req, res) => {
  const timeWindow = req.query.timeWindow || "day";
  const movies = await tmdbService.getTrending(timeWindow);
  return ApiResponse.success(res, movies, "Trending movies fetched successfully.");
});

export const getMovieDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const movie = await tmdbService.getMovieDetails(id);
  return ApiResponse.success(res, movie, "Movie details fetched successfully.");
});

export const getMovieVideos = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const video = await tmdbService.getMovieVideos(id);
  return ApiResponse.success(res, video, "Movie trailer fetched successfully.");
});

export const searchMovies = asyncHandler(async (req, res) => {
  const query = req.query.query || "";
  const page = parseInt(req.query.page, 10) || 1;
  const results = await tmdbService.searchMovies(query, page);
  return ApiResponse.success(res, results, "Movie search results fetched successfully.");
});
