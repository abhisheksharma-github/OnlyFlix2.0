import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  fetchWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  optimisticAdd,
  optimisticRemove,
  selectIsInWatchlist,
} from "../redux/watchlistSlice";

export const useWatchlist = () => {
  const dispatch = useDispatch();
  const { items, isLoading, isMutating } = useSelector((state) => state.watchlist);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Fetch full watchlist items (for the Watchlist page)
  const refreshWatchlist = useCallback(() => {
    if (!isAuthenticated) return;
    dispatch(fetchWatchlist());
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    refreshWatchlist();
  }, [refreshWatchlist]);

  // O(1) membership check via the idSet
  const isInWatchlist = useCallback(
    (mediaId, mediaType = "movie") => {
      return selectIsInWatchlist(mediaId, mediaType)({ watchlist: { idSet: [] } });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items]
  );

  const toggleWatchlist = async (movie, mediaType = "movie") => {
    if (!isAuthenticated) {
      toast.error("Please sign in to add titles to your watchlist.");
      return;
    }

    const mediaId = Number(movie.id || movie.mediaId);
    const payload = {
      mediaId,
      mediaType,
      title: movie.title || movie.name || "Untitled",
      posterPath: movie.poster_path || movie.posterPath || null,
      backdropPath: movie.backdrop_path || movie.backdropPath || null,
      overview: movie.overview || "",
      voteAverage: movie.vote_average || movie.voteAverage || 0,
      releaseDate: movie.release_date || movie.releaseDate || "",
    };

    // Check membership directly from redux state via the hook's selector
    const key = `${mediaId}::${mediaType}`;
    const inList = items.some(
      (item) => item.mediaId === mediaId && item.mediaType === mediaType
    );

    if (inList) {
      // Optimistic remove then network request
      dispatch(optimisticRemove({ mediaId, mediaType }));
      const result = await dispatch(removeFromWatchlist({ mediaId, mediaType }));
      if (removeFromWatchlist.rejected.match(result)) {
        // Rollback — re-add the item
        dispatch(optimisticAdd(payload));
      } else {
        toast.success("Removed from Watchlist");
      }
    } else {
      // Optimistic add then network request
      dispatch(optimisticAdd(payload));
      const result = await dispatch(addToWatchlist(payload));
      if (addToWatchlist.rejected.match(result)) {
        // Rollback — remove the optimistically added item
        dispatch(optimisticRemove({ mediaId, mediaType }));
      } else {
        toast.success("Added to Watchlist");
      }
    }
  };

  return {
    items,
    isLoading,
    isMutating,
    toggleWatchlist,
    refreshWatchlist,
  };
};
