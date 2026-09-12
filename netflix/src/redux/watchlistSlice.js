import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState,
  reducers: {
    setWatchlist: (state, action) => {
      state.items = action.payload || [];
      state.isLoading = false;
    },
    addToWatchlistLocal: (state, action) => {
      const exists = state.items.some((item) => item.movieId === action.payload.movieId);
      if (!exists) {
        state.items.unshift(action.payload);
      }
    },
    removeFromWatchlistLocal: (state, action) => {
      state.items = state.items.filter((item) => item.movieId !== action.payload);
    },
    setWatchlistLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    clearWatchlist: (state) => {
      state.items = [];
    },
  },
});

export const {
  setWatchlist,
  addToWatchlistLocal,
  removeFromWatchlistLocal,
  setWatchlistLoading,
  clearWatchlist,
} = watchlistSlice.actions;

export default watchlistSlice.reducer;
