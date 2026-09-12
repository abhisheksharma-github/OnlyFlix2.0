/**
 * @file netflix/src/api/client.js
 * @description Axios instance with:
 *  - HttpOnly cookie credential forwarding
 *  - Silent 401 interceptor with request queue drain on token refresh
 *  - Consistent data envelope unwrapping
 *  - Typed API method groups: auth, movies, watchlist, history
 */

import axios from "axios";

const BASE_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "/api/v1"
    : "http://localhost:8080/api/v1");

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  timeout: 12000,
});

// ---------------------------------------------------------------------------
// 401 refresh queue — prevents multiple simultaneous refresh attempts
// ---------------------------------------------------------------------------

let isRefreshing = false;
/** @type {Array<{ resolve: (value: unknown) => void; reject: (reason?: unknown) => void }>} */
let failedQueue = [];

function processQueue(error) {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve()));
  failedQueue = [];
}

// ---------------------------------------------------------------------------
// Request interceptor — attach nothing (cookies are sent automatically)
// ---------------------------------------------------------------------------

api.interceptors.request.use((config) => config);

// ---------------------------------------------------------------------------
// Response interceptor
// ---------------------------------------------------------------------------

api.interceptors.response.use(
  // Unwrap the data envelope so callers get { data, message } directly
  (response) => response.data,

  async (error) => {
    const originalRequest = error.config;

    // On 401, attempt a silent token refresh once
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/register")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((e) => Promise.reject(e));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt a GET /auth/me to check if the session cookie is still valid
        await api.get("/auth/me");
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        // Session fully expired — let the auth slice handle redirect
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const message =
      error.response?.data?.error?.message ||
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred.";

    return Promise.reject(new Error(message));
  }
);

// ---------------------------------------------------------------------------
// Typed API surface
// ---------------------------------------------------------------------------

export const authApi = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (payload) => api.post("/auth/register", payload),
  getMe: () => api.get("/auth/me"),
  logout: () => api.post("/auth/logout"),
  updateProfile: (payload) => api.patch("/auth/profile", payload),
  changePassword: (payload) => api.patch("/auth/password", payload),
};

export const moviesApi = {
  // Feeds
  getTrending: (timeWindow = "week") =>
    api.get(`/movies/trending?timeWindow=${timeWindow}`),
  getTrendingAll: (timeWindow = "week") =>
    api.get(`/movies/trending/all?timeWindow=${timeWindow}`),
  getNowPlaying: (page = 1) => api.get(`/movies/now-playing?page=${page}`),
  getPopular: (page = 1) => api.get(`/movies/popular?page=${page}`),
  getTopRated: (page = 1) => api.get(`/movies/top-rated?page=${page}`),
  getUpcoming: (page = 1) => api.get(`/movies/upcoming?page=${page}`),
  getPopularTV: (page = 1) => api.get(`/movies/tv/popular?page=${page}`),
  getTopRatedTV: (page = 1) => api.get(`/movies/tv/top-rated?page=${page}`),
  // Details
  getDetails: (id, type = "movie") =>
    api.get(`/movies/details/${id}?type=${type}`),
  getProviders: (id, type = "movie") =>
    api.get(`/movies/providers/${id}?type=${type}`),
  getTrailer: (id, type = "movie") =>
    api.get(`/movies/trailer/${id}?type=${type}`),
  // TV specifics
  getSeason: (seriesId, seasonNumber) =>
    api.get(`/movies/tv/${seriesId}/season/${seasonNumber}`),
  getEpisode: (seriesId, seasonNumber, episodeNumber) =>
    api.get(`/movies/tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}`),
  // Search
  searchMulti: (query, page = 1) =>
    api.get(`/movies/search?query=${encodeURIComponent(query)}&page=${page}`),
  searchMovies: (query, page = 1) =>
    api.get(`/movies/search/movies?query=${encodeURIComponent(query)}&page=${page}`),
  searchTV: (query, page = 1) =>
    api.get(`/movies/search/tv?query=${encodeURIComponent(query)}&page=${page}`),
  // Genres
  getGenres: (type = "movie") => api.get(`/movies/genres?type=${type}`),
};

export const watchlistApi = {
  getWatchlist: () => api.get("/watchlist"),
  getIds: () => api.get("/watchlist/ids"),                   // O(1) hydration
  add: (payload) => api.post("/watchlist", payload),
  remove: (mediaId, type = "MOVIE") =>
    api.delete(`/watchlist/${mediaId}?type=${type}`),
  check: (mediaId, type = "MOVIE") =>
    api.get(`/watchlist/check/${mediaId}?type=${type}`),
};

export const historyApi = {
  getHistory: () => api.get("/history"),
  getIncomplete: () => api.get("/history/incomplete"),
  record: (payload) => api.post("/history", payload),
  remove: (mediaId, type = "MOVIE") =>
    api.delete(`/history/${mediaId}?type=${type}`),
  clear: () => api.delete("/history"),
};
