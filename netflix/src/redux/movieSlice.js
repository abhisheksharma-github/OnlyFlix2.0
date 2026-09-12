import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  nowPlaying: [],
  popular: [],
  topRated: [],
  upcoming: [],
  trending: [],
  heroMovie: null,
  selectedMovie: null,
  trailerKey: null,
  isModalOpen: false,
  isLoadingTrailer: false,
  isLoadingMovies: true,
  error: null,
};

const movieSlice = createSlice({
  name: "movie",
  initialState,
  reducers: {
    setNowPlaying: (state, action) => {
      state.nowPlaying = action.payload || [];
      if (!state.heroMovie && action.payload?.length > 0) {
        state.heroMovie = action.payload[0];
      }
    },
    setPopular: (state, action) => {
      state.popular = action.payload || [];
    },
    setTopRated: (state, action) => {
      state.topRated = action.payload || [];
    },
    setUpcoming: (state, action) => {
      state.upcoming = action.payload || [];
    },
    setTrending: (state, action) => {
      state.trending = action.payload || [];
    },
    setHeroMovie: (state, action) => {
      state.heroMovie = action.payload;
    },
    setSelectedMovie: (state, action) => {
      state.selectedMovie = action.payload;
    },
    setTrailerKey: (state, action) => {
      state.trailerKey = action.payload;
    },
    setModalOpen: (state, action) => {
      state.isModalOpen = action.payload;
      if (!action.payload) {
        state.trailerKey = null;
      }
    },
    setLoadingTrailer: (state, action) => {
      state.isLoadingTrailer = action.payload;
    },
    setLoadingMovies: (state, action) => {
      state.isLoadingMovies = action.payload;
    },
    // Backward compatibility aliases
    getNowPlayingMovies: (state, action) => {
      state.nowPlaying = action.payload || [];
      if (!state.heroMovie && action.payload?.length > 0) {
        state.heroMovie = action.payload[0];
      }
    },
    getPopularMovie: (state, action) => {
      state.popular = action.payload || [];
    },
    getTopRatedMovie: (state, action) => {
      state.topRated = action.payload || [];
    },
    getUpcomingMovie: (state, action) => {
      state.upcoming = action.payload || [];
    },
    getTrailerMovie: (state, action) => {
      state.trailerKey = action.payload?.key || action.payload;
    },
    setOpen: (state, action) => {
      state.isModalOpen = action.payload;
    },
    getId: (state, action) => {
      state.selectedMovie = { id: action.payload };
    },
  },
});

export const {
  setNowPlaying,
  setPopular,
  setTopRated,
  setUpcoming,
  setTrending,
  setHeroMovie,
  setSelectedMovie,
  setTrailerKey,
  setModalOpen,
  setLoadingTrailer,
  setLoadingMovies,
  getNowPlayingMovies,
  getPopularMovie,
  getTopRatedMovie,
  getUpcomingMovie,
  getTrailerMovie,
  setOpen,
  getId,
} = movieSlice.actions;

export default movieSlice.reducer;