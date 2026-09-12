import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import movieReducer from "./movieSlice";
import watchlistReducer from "./watchlistSlice";
import uiReducer from "./uiSlice";

export const store = configureStore({
  reducer: {
    app: authReducer,
    auth: authReducer,
    movie: movieReducer,
    watchlist: watchlistReducer,
    ui: uiReducer,
    searchMovie: uiReducer, // For backward compatibility
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;