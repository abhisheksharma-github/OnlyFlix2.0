import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { moviesApi } from "../api/client";
import {
  setNowPlaying,
  setPopular,
  setTopRated,
  setUpcoming,
  setTrending,
  setLoadingMovies,
} from "../redux/movieSlice";

export const useMovies = () => {
  const dispatch = useDispatch();
  const { nowPlaying, popular, topRated, upcoming, trending, heroMovie, isLoadingMovies } = useSelector(
    (state) => state.movie
  );

  const fetchAllMovies = useCallback(async () => {
    // Avoid re-fetching if data is already populated
    if (nowPlaying.length > 0 && popular.length > 0) return;

    try {
      dispatch(setLoadingMovies(true));
      const [nowRes, popRes, topRes, upRes, trendRes] = await Promise.allSettled([
        moviesApi.getNowPlaying(),
        moviesApi.getPopular(),
        moviesApi.getTopRated(),
        moviesApi.getUpcoming(),
        moviesApi.getTrending("day"),
      ]);

      if (nowRes.status === "fulfilled" && nowRes.value?.data) {
        dispatch(setNowPlaying(nowRes.value.data));
      }
      if (popRes.status === "fulfilled" && popRes.value?.data) {
        dispatch(setPopular(popRes.value.data));
      }
      if (topRes.status === "fulfilled" && topRes.value?.data) {
        dispatch(setTopRated(topRes.value.data));
      }
      if (upRes.status === "fulfilled" && upRes.value?.data) {
        dispatch(setUpcoming(upRes.value.data));
      }
      if (trendRes.status === "fulfilled" && trendRes.value?.data) {
        dispatch(setTrending(trendRes.value.data));
      }
    } catch (err) {
      console.error("Failed to load catalog:", err);
    } finally {
      dispatch(setLoadingMovies(false));
    }
  }, [dispatch, nowPlaying.length, popular.length]);

  useEffect(() => {
    fetchAllMovies();
  }, [fetchAllMovies]);

  return {
    nowPlaying,
    popular,
    topRated,
    upcoming,
    trending,
    heroMovie,
    isLoadingMovies,
    refetch: fetchAllMovies,
  };
};
