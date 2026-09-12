import express from "express";
import {
  getTrendingMovies,
  getTrendingAll,
  getNowPlayingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getPopularTV,
  getTopRatedTV,
  getMediaDetails,
  getWatchProviders,
  getBestTrailer,
  getSeasonDetails,
  getEpisodeDetails,
  searchMulti,
  searchMovies,
  searchTV,
  getGenres,
} from "../controllers/movieController.js";

const router = express.Router();

// Feeds — Movies
router.get("/trending", getTrendingMovies);
router.get("/trending/all", getTrendingAll);
router.get("/now-playing", getNowPlayingMovies);
router.get("/popular", getPopularMovies);
router.get("/top-rated", getTopRatedMovies);
router.get("/upcoming", getUpcomingMovies);

// Feeds — TV
router.get("/tv/popular", getPopularTV);
router.get("/tv/top-rated", getTopRatedTV);

// Details (unified — pass ?type=tv for TV shows)
router.get("/details/:id", getMediaDetails);
router.get("/providers/:id", getWatchProviders);
router.get("/trailer/:id", getBestTrailer);

// TV Season & Episodes
router.get("/tv/:seriesId/season/:seasonNumber", getSeasonDetails);
router.get("/tv/:seriesId/season/:seasonNumber/episode/:episodeNumber", getEpisodeDetails);

// Search
router.get("/search", searchMulti);
router.get("/search/movies", searchMovies);
router.get("/search/tv", searchTV);

// Genres
router.get("/genres", getGenres);

export default router;
