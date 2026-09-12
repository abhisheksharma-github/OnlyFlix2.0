import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSearchOpen: false,
  searchQuery: "",
  searchResults: [],
  isSearching: false,
  activeTab: "home", // 'home' | 'movies' | 'series' | 'watchlist'
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSearch: (state) => {
      state.isSearchOpen = !state.isSearchOpen;
    },
    setSearchOpen: (state, action) => {
      state.isSearchOpen = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload || [];
      state.isSearching = false;
    },
    setIsSearching: (state, action) => {
      state.isSearching = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
      if (action.payload !== "search") {
        state.isSearchOpen = false;
      }
    },
  },
});

export const {
  toggleSearch,
  setSearchOpen,
  setSearchQuery,
  setSearchResults,
  setIsSearching,
  setActiveTab,
} = uiSlice.actions;

export default uiSlice.reducer;
