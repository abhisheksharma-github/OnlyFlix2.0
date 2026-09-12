/**
 * @file netflix/src/hooks/useWatchlistStatus.js
 * @description O(1) watchlist status hook using the Redux Set cache.
 * Provides instant bookmark status without any network request.
 * Exposes optimistic toggle action with auto-rollback on failure.
 */

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  optimisticAdd,
  optimisticRemove,
  addToWatchlist,
  removeFromWatchlist,
  selectIsInWatchlist,
} from "../redux/watchlistSlice";

/**
 * @param {number | string} mediaId
 * @param {"MOVIE" | "TV"} mediaType
 * @param {{
 *   title: string;
 *   posterPath?: string;
 *   backdropPath?: string;
 *   overview?: string;
 *   voteAverage?: number;
 *   releaseDate?: string;
 * }} [metadata] — required when toggling ON (adding to watchlist)
 */
export function useWatchlistStatus(mediaId, mediaType = "MOVIE", metadata = {}) {
  const dispatch = useDispatch();
  const isInWatchlist = useSelector(selectIsInWatchlist(mediaId, mediaType));
  const isMutating = useSelector((state) => state.watchlist.isMutating);

  const toggle = useCallback(async () => {
    if (isInWatchlist) {
      // Optimistic remove
      dispatch(optimisticRemove({ mediaId, mediaType }));
      const result = await dispatch(removeFromWatchlist({ mediaId: Number(mediaId), mediaType }));

      if (removeFromWatchlist.rejected.match(result)) {
        // Rollback
        dispatch(optimisticAdd({ mediaId: Number(mediaId), mediaType, ...metadata }));
      } else {
        toast.success("Removed from your watchlist.");
      }
    } else {
      // Optimistic add
      const item = {
        mediaId: Number(mediaId),
        mediaType,
        title: metadata.title || "Unknown",
        posterPath: metadata.posterPath ?? null,
        backdropPath: metadata.backdropPath ?? null,
        overview: metadata.overview ?? "",
        voteAverage: metadata.voteAverage ?? 0,
        releaseDate: metadata.releaseDate ?? "",
      };
      dispatch(optimisticAdd(item));
      const result = await dispatch(addToWatchlist(item));

      if (addToWatchlist.rejected.match(result)) {
        // Rollback
        dispatch(optimisticRemove({ mediaId: Number(mediaId), mediaType }));
      } else {
        toast.success("Added to your watchlist.");
      }
    }
  }, [dispatch, isInWatchlist, mediaId, mediaType, metadata]);

  return { isInWatchlist, toggle, isMutating };
}
