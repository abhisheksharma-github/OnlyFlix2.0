/**
 * @file netflix/src/redux/watchlistSlice.js
 * @description Watchlist state with O(1) Set-based status lookups and
 * optimistic add/remove mutations with automatic rollback on failure.
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { watchlistApi } from "../api/client";
import toast from "react-hot-toast";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Generates the Set key for a media item.
 * @param {number | string} mediaId
 * @param {string} mediaType
 * @returns {string}
 */
const makeKey = (mediaId, mediaType) => `${mediaId}::${mediaType}`;

// ---------------------------------------------------------------------------
// Async thunks
// ---------------------------------------------------------------------------

/**
 * Hydrate the O(1) lookup Set from the compact /watchlist/ids endpoint.
 * Called once on session boot.
 */
export const hydrateWatchlistIds = createAsyncThunk(
  "watchlist/hydrateIds",
  async (_, { rejectWithValue }) => {
    try {
      const response = await watchlistApi.getIds();
      return response.data; // [{ mediaId, mediaType }, ...]
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/** Fetch full watchlist items (for the Watchlist page). */
export const fetchWatchlist = createAsyncThunk(
  "watchlist/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await watchlistApi.getWatchlist();
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/**
 * Add to watchlist with optimistic update + rollback.
 * @param {{ mediaId: number; mediaType: string; title: string; posterPath?: string; [key: string]: unknown }} payload
 */
export const addToWatchlist = createAsyncThunk(
  "watchlist/add",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await watchlistApi.add(payload);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/**
 * Remove from watchlist with optimistic update + rollback.
 * @param {{ mediaId: number; mediaType: string }} param
 */
export const removeFromWatchlist = createAsyncThunk(
  "watchlist/remove",
  async ({ mediaId, mediaType }, { rejectWithValue }) => {
    try {
      await watchlistApi.remove(mediaId, mediaType);
      return { mediaId, mediaType };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ---------------------------------------------------------------------------
// Slice
// ---------------------------------------------------------------------------

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState: {
    /** Full item objects (for watchlist page rendering) */
    items: [],
    /**
     * O(1) lookup Set stored as an array of keys ("mediaId::mediaType").
     * Converted to a real Set in selectors.
     * @type {string[]}
     */
    idSet: [],
    isLoading: false,
    isMutating: false,
    error: null,
  },
  reducers: {
    clearWatchlist: (state) => {
      state.items = [];
      state.idSet = [];
    },
    // Optimistic add (called before the network request)
    optimisticAdd: (state, action) => {
      const key = makeKey(action.payload.mediaId, action.payload.mediaType);
      if (!state.idSet.includes(key)) {
        state.idSet.push(key);
        state.items.unshift(action.payload);
      }
    },
    // Optimistic remove (called before the network request)
    optimisticRemove: (state, action) => {
      const key = makeKey(action.payload.mediaId, action.payload.mediaType);
      state.idSet = state.idSet.filter((k) => k !== key);
      state.items = state.items.filter(
        (item) =>
          !(item.mediaId === action.payload.mediaId &&
            item.mediaType === action.payload.mediaType)
      );
    },
  },
  extraReducers: (builder) => {
    // hydrateWatchlistIds
    builder
      .addCase(hydrateWatchlistIds.fulfilled, (state, action) => {
        state.idSet = action.payload.map((item) =>
          makeKey(item.mediaId, item.mediaType)
        );
      });

    // fetchWatchlist
    builder
      .addCase(fetchWatchlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchWatchlist.fulfilled, (state, action) => {
        state.items = action.payload;
        state.idSet = action.payload.map((item) =>
          makeKey(item.mediaId, item.mediaType)
        );
        state.isLoading = false;
      })
      .addCase(fetchWatchlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // addToWatchlist — rollback on failure
    builder
      .addCase(addToWatchlist.pending, (state) => {
        state.isMutating = true;
      })
      .addCase(addToWatchlist.fulfilled, (state) => {
        state.isMutating = false;
      })
      .addCase(addToWatchlist.rejected, (state, action) => {
        state.isMutating = false;
        toast.error(action.payload || "Failed to add to watchlist.");
      });

    // removeFromWatchlist — rollback on failure
    builder
      .addCase(removeFromWatchlist.pending, (state) => {
        state.isMutating = true;
      })
      .addCase(removeFromWatchlist.fulfilled, (state) => {
        state.isMutating = false;
      })
      .addCase(removeFromWatchlist.rejected, (state, action) => {
        state.isMutating = false;
        toast.error(action.payload || "Failed to remove from watchlist.");
      });
  },
});

export const { clearWatchlist, optimisticAdd, optimisticRemove } =
  watchlistSlice.actions;

// ---------------------------------------------------------------------------
// Selectors
// ---------------------------------------------------------------------------

/** Returns the idSet as a native Set for O(1) lookups in components. */
export const selectWatchlistSet = (state) => new Set(state.watchlist.idSet);

/**
 * Returns true if the given media item is in the watchlist.
 * @param {number | string} mediaId
 * @param {string} mediaType
 */
export const selectIsInWatchlist = (mediaId, mediaType) => (state) =>
  state.watchlist.idSet.includes(makeKey(mediaId, mediaType));

export default watchlistSlice.reducer;
