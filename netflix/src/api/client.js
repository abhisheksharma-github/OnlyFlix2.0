import axios from "axios";
import { API_BASE_URL } from "../utils/constant";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Response interceptor to extract data envelope cleanly
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const customMessage =
      error.response?.data?.error?.message ||
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred.";

    return Promise.reject(new Error(customMessage));
  }
);

export const authApi = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (payload) => api.post("/auth/register", payload),
  getMe: () => api.get("/auth/me"),
  logout: () => api.post("/auth/logout"),
};

export const moviesApi = {
  getNowPlaying: (page = 1) => api.get(`/movies/now-playing?page=${page}`),
  getPopular: (page = 1) => api.get(`/movies/popular?page=${page}`),
  getTopRated: (page = 1) => api.get(`/movies/top-rated?page=${page}`),
  getUpcoming: (page = 1) => api.get(`/movies/upcoming?page=${page}`),
  getTrending: (timeWindow = "day") => api.get(`/movies/trending?timeWindow=${timeWindow}`),
  getDetails: (id) => api.get(`/movies/${id}`),
  getVideos: (id) => api.get(`/movies/${id}/videos`),
  search: (query, page = 1) => api.get(`/movies/search?query=${encodeURIComponent(query)}&page=${page}`),
};

export const watchlistApi = {
  getWatchlist: () => api.get("/watchlist"),
  add: (movie) => api.post("/watchlist", movie),
  remove: (movieId) => api.delete(`/watchlist/${movieId}`),
  check: (movieId) => api.get(`/watchlist/check/${movieId}`),
};

export const historyApi = {
  getHistory: () => api.get("/history"),
  record: (item) => api.post("/history", item),
  clear: () => api.delete("/history"),
};
