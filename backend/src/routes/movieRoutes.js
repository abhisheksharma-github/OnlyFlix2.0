import express from "express";
import {
  getNowPlayingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getTrendingMovies,
  getMovieDetails,
  getMovieVideos,
  searchMovies,
} from "../controllers/movieController.js";

const router = express.Router();

router.get("/now-playing", getNowPlayingMovies);
router.get("/popular", getPopularMovies);
router.get("/top-rated", getTopRatedMovies);
router.get("/upcoming", getUpcomingMovies);
router.get("/trending", getTrendingMovies);
router.get("/search", searchMovies);
router.get("/:id", getMovieDetails);
router.get("/:id/videos", getMovieVideos);

export default router;
