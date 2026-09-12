import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { watchlistApi } from "../api/client";
import {
  setWatchlist,
  addToWatchlistLocal,
  removeFromWatchlistLocal,
  setWatchlistLoading,
} from "../redux/watchlistSlice";

export const useWatchlist = () => {
  const dispatch = useDispatch();
  const { items, isLoading } = useSelector((state) => state.watchlist);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const fetchWatchlist = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      dispatch(setWatchlistLoading(true));
      const res = await watchlistApi.getWatchlist();
      if (res?.data) {
        dispatch(setWatchlist(res.data));
      }
    } catch (err) {
      console.warn("Failed to fetch watchlist:", err);
    } finally {
      dispatch(setWatchlistLoading(false));
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  const isInWatchlist = useCallback(
    (movieId) => {
      return items.some((item) => Number(item.movieId) === Number(movieId));
    },
    [items]
  );

  const toggleWatchlist = async (movie) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to add titles to your watchlist.");
      return;
    }

    const movieId = Number(movie.id || movie.movieId);
    const inList = isInWatchlist(movieId);

    if (inList) {
      // Optimistic removal
      dispatch(removeFromWatchlistLocal(movieId));
      try {
        await watchlistApi.remove(movieId);
        toast.success("Removed from Watchlist");
      } catch (err) {
        // Rollback
        fetchWatchlist();
        toast.error("Failed to remove title");
      }
    } else {
      // Prepare payload
      const payload = {
        movieId,
        title: movie.title || movie.name || "Untitled",
        posterPath: movie.poster_path || movie.posterPath || null,
        backdropPath: movie.backdrop_path || movie.backdropPath || null,
        overview: movie.overview || "",
        voteAverage: movie.vote_average || movie.voteAverage || 0,
        releaseDate: movie.release_date || movie.releaseDate || "",
      };

      // Optimistic add
      dispatch(addToWatchlistLocal(payload));
      try {
        await watchlistApi.add(payload);
        toast.success("Added to Watchlist");
      } catch (err) {
        // Rollback
        fetchWatchlist();
        toast.error("Failed to add title");
      }
    }
  };

  return {
    items,
    isLoading,
    isInWatchlist,
    toggleWatchlist,
    refreshWatchlist: fetchWatchlist,
  };
};
