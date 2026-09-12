/**
 * @file netflix/src/redux/uiSlice.js
 * @description UI state: modal lifecycle, search, active filters, media type tabs.
 */

import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    // Search
    isSearchOpen: false,
    searchQuery: "",
    /** @type {unknown[]} */
    searchResults: [],
    isSearching: false,
    searchFilter: "all", // "all" | "movie" | "tv"

    // Navigation
    activeTab: "home", // "home" | "movies" | "series" | "watchlist"

    // Media detail modal
    isModalOpen: false,
    /** @type {{ id: number; type: "movie" | "tv" } | null} */
    modalMedia: null,

    // Global loading overlay (for page transitions)
    isPageLoading: false,
  },
  reducers: {
    // Search
    toggleSearch: (state) => {
      state.isSearchOpen = !state.isSearchOpen;
      if (!state.isSearchOpen) {
        state.searchQuery = "";
        state.searchResults = [];
      }
    },
    setSearchOpen: (state, action) => {
      state.isSearchOpen = action.payload;
      if (!action.payload) {
        state.searchQuery = "";
        state.searchResults = [];
      }
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload ?? [];
      state.isSearching = false;
    },
    setIsSearching: (state, action) => {
      state.isSearching = action.payload;
    },
    setSearchFilter: (state, action) => {
      state.searchFilter = action.payload;
    },

    // Navigation
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
      if (action.payload !== "search") {
        state.isSearchOpen = false;
        state.searchQuery = "";
        state.searchResults = [];
      }
    },

    // Modal
    openModal: (state, action) => {
      state.isModalOpen = true;
      state.modalMedia = action.payload; // { id, type }
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.modalMedia = null;
    },

    // Page loading
    setPageLoading: (state, action) => {
      state.isPageLoading = action.payload;
    },
  },
});

export const {
  toggleSearch,
  setSearchOpen,
  setSearchQuery,
  setSearchResults,
  setIsSearching,
  setSearchFilter,
  setActiveTab,
  openModal,
  closeModal,
  setPageLoading,
} = uiSlice.actions;

export default uiSlice.reducer;
