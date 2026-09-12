/**
 * @file backend/src/services/tmdbService.js
 * @description Hardened TMDB API proxy with:
 *  - Promise Coalescing (anti-stampede / thundering-herd protection)
 *  - Multi-tier in-memory TTL cache (Static 24h, Dynamic 30m, Search 15m)
 *  - Graceful fallback to stale cache on TMDB 5xx / 429
 *  - Normalized unified schema across Movie and TV responses
 *  - Watch Provider integration for streaming platform attribution
 */

import axios from "axios";
import NodeCache from "node-cache";
import { env } from "../config/env.js";

// ---------------------------------------------------------------------------
// Cache tiers (seconds)
// ---------------------------------------------------------------------------
const TTL = {
  STATIC: 86400,   // 24h — details, credits, providers, season metadata
  DYNAMIC: 1800,   // 30m — trending, popular, now_playing
  SEARCH: 900,     // 15m — search queries
};

const cache = new NodeCache({ checkperiod: 300, useClones: false });

/**
 * In-flight promise map for request coalescing.
 * Key = cache key, Value = pending Promise.
 * @type {Map<string, Promise<unknown>>}
 */
const inFlight = new Map();

// ---------------------------------------------------------------------------
// HTTP client
// ---------------------------------------------------------------------------
const tmdbClient = axios.create({
  baseURL: env.TMDB_BASE_URL,
  timeout: 8000,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${env.TMDB_READ_ACCESS_TOKEN}`,
  },
  params: { language: "en-US" },
});

// ---------------------------------------------------------------------------
// Stale-cache store (populated on every successful fetch)
// @type {Map<string, unknown>}
// ---------------------------------------------------------------------------
const staleCache = new Map();

// ---------------------------------------------------------------------------
// Fallback dataset — returned when TMDB is unreachable and no stale cache exists
// ---------------------------------------------------------------------------
const FALLBACK_MEDIA = [
  {
    id: 693134, media_type: "movie", title: "Dune: Part Two", name: undefined,
    overview: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    poster_path: "/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    backdrop_path: "/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg",
    release_date: "2024-02-28", first_air_date: undefined,
    vote_average: 8.3, genre_ids: [878, 12], trailer_key: "Way9Dexny3w",
  },
  {
    id: 872585, media_type: "movie", title: "Oppenheimer", name: undefined,
    overview: "The story of J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    poster_path: "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    backdrop_path: "/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg",
    release_date: "2023-07-19", first_air_date: undefined,
    vote_average: 8.2, genre_ids: [18, 36], trailer_key: "uYPbbksJxIg",
  },
  {
    id: 157336, media_type: "movie", title: "Interstellar", name: undefined,
    overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop_path: "/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
    release_date: "2014-11-05", first_air_date: undefined,
    vote_average: 8.4, genre_ids: [12, 18, 878], trailer_key: "zSWdZVtXT7E",
  },
  {
    id: 136315, media_type: "tv", title: undefined, name: "The Bear",
    overview: "A young chef from the fine-dining world returns to Chicago to run his family's sandwich shop.",
    poster_path: "/sHFlbKS3WLqMnp9t2ghADIJFnuQ.jpg",
    backdrop_path: "/4qe8nUMR4h7gGHHqBFQ3bFCKQaw.jpg",
    release_date: undefined, first_air_date: "2022-06-23",
    vote_average: 8.8, genre_ids: [35, 18], trailer_key: "o9kJBrSF6Jc",
  },
  {
    id: 95396, media_type: "tv", title: undefined, name: "Severance",
    overview: "Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives.",
    poster_path: "/9sVbVM3QWyFMBGUkEeVKhHbfFpA.jpg",
    backdrop_path: "/Jnuk6qbblbnOJjpJsOlkPzZjHvU.jpg",
    release_date: undefined, first_air_date: "2022-02-18",
    vote_average: 8.7, genre_ids: [18, 9648], trailer_key: "xEQPDhEfMDs",
  },
  {
    id: 100088, media_type: "tv", title: undefined, name: "The Last of Us",
    overview: "Joel, a hardened survivor, is hired to smuggle Ellie out of an oppressive quarantine zone.",
    poster_path: "/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg",
    backdrop_path: "/uDgy6hyPd7qg6aCc6g4bRB2HVCO.jpg",
    release_date: undefined, first_air_date: "2023-01-15",
    vote_average: 8.8, genre_ids: [10765, 18], trailer_key: "uLtkt5a53XU",
  },
];

// ---------------------------------------------------------------------------
// Media normalizer — unified schema across movie and TV
// ---------------------------------------------------------------------------

/**
 * Normalize a raw TMDB result to a consistent shape.
 * @param {Record<string, unknown>} item
 * @param {"movie" | "tv"} [hint]
 * @returns {Record<string, unknown>}
 */
function normalizeMedia(item, hint) {
  const mediaType = item.media_type || hint || (item.title ? "movie" : "tv");
  return {
    ...item,
    media_type: mediaType,
    // Unify title field
    displayTitle: item.title || item.name || "Unknown Title",
    // Unify release date field
    displayDate: item.release_date || item.first_air_date || null,
  };
}

// ---------------------------------------------------------------------------
// Core fetch with coalescing + multi-tier caching
// ---------------------------------------------------------------------------

/**
 * Fetch from TMDB with cache-aside + promise coalescing.
 * @param {string} endpoint
 * @param {Record<string, unknown>} params
 * @param {number} ttl - Cache TTL in seconds
 * @returns {Promise<unknown | null>}
 */
async function fetchTmdb(endpoint, params = {}, ttl = TTL.DYNAMIC) {
  const cacheKey = `${endpoint}::${JSON.stringify(params)}`;

  // 1. Hot cache hit
  const cached = cache.get(cacheKey);
  if (cached !== undefined) return cached;

  // 2. Request coalescing — if there's already a request in-flight, wait for it
  if (inFlight.has(cacheKey)) {
    return inFlight.get(cacheKey);
  }

  // 3. Launch upstream request and register in the in-flight map
  const promise = tmdbClient
    .get(endpoint, { params })
    .then((res) => {
      cache.set(cacheKey, res.data, ttl);
      staleCache.set(cacheKey, res.data);
      return res.data;
    })
    .catch((err) => {
      const status = err.response?.status;
      console.warn(`[TMDB] ${endpoint} failed — HTTP ${status ?? "network error"}`);

      // Return stale data on 5xx or 429 (TMDB rate limit)
      if (staleCache.has(cacheKey)) {
        console.info(`[TMDB] Serving stale cache for ${endpoint}`);
        return staleCache.get(cacheKey);
      }
      return null;
    })
    .finally(() => {
      inFlight.delete(cacheKey);
    });

  inFlight.set(cacheKey, promise);
  return promise;
}

// ---------------------------------------------------------------------------
// Service methods
// ---------------------------------------------------------------------------

class TmdbService {
  // ── Trending & Feeds ──────────────────────────────────────────────────────

  /** @param {"day" | "week"} timeWindow */
  async getTrendingAll(timeWindow = "week") {
    const data = await fetchTmdb(`/trending/all/${timeWindow}`, {}, TTL.DYNAMIC);
    const results = data?.results ?? FALLBACK_MEDIA;
    return results.map((item) => normalizeMedia(item));
  }

  /** @param {"day" | "week"} timeWindow */
  async getTrendingMovies(timeWindow = "week") {
    const data = await fetchTmdb(`/trending/movie/${timeWindow}`, {}, TTL.DYNAMIC);
    return (data?.results ?? FALLBACK_MEDIA.filter((m) => m.media_type === "movie"))
      .map((item) => normalizeMedia(item, "movie"));
  }

  async getPopularMovies(page = 1) {
    const data = await fetchTmdb("/movie/popular", { page }, TTL.DYNAMIC);
    return (data?.results ?? FALLBACK_MEDIA).map((item) => normalizeMedia(item, "movie"));
  }

  async getNowPlaying(page = 1) {
    const data = await fetchTmdb("/movie/now_playing", { page }, TTL.DYNAMIC);
    return (data?.results ?? FALLBACK_MEDIA).map((item) => normalizeMedia(item, "movie"));
  }

  async getTopRatedMovies(page = 1) {
    const data = await fetchTmdb("/movie/top_rated", { page }, TTL.DYNAMIC);
    return (data?.results ?? FALLBACK_MEDIA.filter((m) => m.vote_average >= 8.0))
      .map((item) => normalizeMedia(item, "movie"));
  }

  async getUpcomingMovies(page = 1) {
    const data = await fetchTmdb("/movie/upcoming", { page }, TTL.DYNAMIC);
    return (data?.results ?? FALLBACK_MEDIA.slice(0, 4)).map((item) => normalizeMedia(item, "movie"));
  }

  async getPopularTV(page = 1) {
    const data = await fetchTmdb("/tv/popular", { page }, TTL.DYNAMIC);
    return (data?.results ?? FALLBACK_MEDIA.filter((m) => m.media_type === "tv"))
      .map((item) => normalizeMedia(item, "tv"));
  }

  async getTopRatedTV(page = 1) {
    const data = await fetchTmdb("/tv/top_rated", { page }, TTL.DYNAMIC);
    return (data?.results ?? FALLBACK_MEDIA.filter((m) => m.media_type === "tv"))
      .map((item) => normalizeMedia(item, "tv"));
  }

  // ── Details ───────────────────────────────────────────────────────────────

  /**
   * @param {number | string} id
   * @param {"movie" | "tv"} type
   */
  async getDetails(id, type = "movie") {
    const endpoint = `/${type}/${id}`;
    const data = await fetchTmdb(
      endpoint,
      { append_to_response: "videos,credits,similar,recommendations" },
      TTL.STATIC
    );

    if (!data) {
      const fallback = FALLBACK_MEDIA.find((m) => m.id === Number(id));
      return fallback ? normalizeMedia(fallback, type) : null;
    }

    return normalizeMedia(data, type);
  }

  /**
   * Fetch watch providers for a media item.
   * Returns a simplified { [country]: { flatrate, rent, buy } } map.
   * @param {number | string} id
   * @param {"movie" | "tv"} type
   */
  async getWatchProviders(id, type = "movie") {
    const data = await fetchTmdb(`/${type}/${id}/watch/providers`, {}, TTL.STATIC);
    return data?.results ?? {};
  }

  /**
   * Fetch videos and return the best trailer or teaser.
   * @param {number | string} id
   * @param {"movie" | "tv"} type
   */
  async getBestTrailer(id, type = "movie") {
    const data = await fetchTmdb(`/${type}/${id}/videos`, {}, TTL.STATIC);
    const videos = data?.results ?? [];

    const trailer = videos.find(
      (v) => v.type === "Trailer" && v.site === "YouTube" && v.official
    ) ?? videos.find(
      (v) => (v.type === "Trailer" || v.type === "Teaser") && v.site === "YouTube"
    ) ?? videos[0];

    return trailer ?? null;
  }

  // ── TV Season & Episodes ──────────────────────────────────────────────────

  /**
   * @param {number | string} seriesId
   * @param {number} seasonNumber
   */
  async getSeasonDetails(seriesId, seasonNumber) {
    const data = await fetchTmdb(
      `/tv/${seriesId}/season/${seasonNumber}`,
      {},
      TTL.STATIC
    );
    return data ?? null;
  }

  /**
   * @param {number | string} seriesId
   * @param {number} seasonNumber
   * @param {number} episodeNumber
   */
  async getEpisodeDetails(seriesId, seasonNumber, episodeNumber) {
    const data = await fetchTmdb(
      `/tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}`,
      {},
      TTL.STATIC
    );
    return data ?? null;
  }

  // ── Search ────────────────────────────────────────────────────────────────

  /**
   * Unified multi-type search (movies + TV in one request via /search/multi).
   * @param {string} query
   * @param {number} page
   */
  async searchMulti(query, page = 1) {
    const q = query?.trim();
    if (!q) return [];

    const data = await fetchTmdb(
      "/search/multi",
      { query: q, include_adult: false, page },
      TTL.SEARCH
    );

    const results = data?.results ?? [];
    return results
      .filter((item) => item.media_type === "movie" || item.media_type === "tv")
      .map((item) => normalizeMedia(item));
  }

  /**
   * Movie-only search.
   * @param {string} query
   * @param {number} page
   */
  async searchMovies(query, page = 1) {
    const q = query?.trim();
    if (!q) return [];

    const data = await fetchTmdb(
      "/search/movie",
      { query: q, include_adult: false, page },
      TTL.SEARCH
    );

    const results = data?.results ?? [];
    if (!results.length) {
      const ql = q.toLowerCase();
      return FALLBACK_MEDIA.filter(
        (m) =>
          m.media_type === "movie" &&
          ((m.title ?? "").toLowerCase().includes(ql) ||
            m.overview.toLowerCase().includes(ql))
      ).map((item) => normalizeMedia(item, "movie"));
    }

    return results.map((item) => normalizeMedia(item, "movie"));
  }

  /**
   * TV-only search.
   * @param {string} query
   * @param {number} page
   */
  async searchTV(query, page = 1) {
    const q = query?.trim();
    if (!q) return [];

    const data = await fetchTmdb(
      "/search/tv",
      { query: q, include_adult: false, page },
      TTL.SEARCH
    );

    return (data?.results ?? []).map((item) => normalizeMedia(item, "tv"));
  }

  // ── Genres ────────────────────────────────────────────────────────────────

  async getMovieGenres() {
    const data = await fetchTmdb("/genre/movie/list", {}, TTL.STATIC);
    return data?.genres ?? [];
  }

  async getTVGenres() {
    const data = await fetchTmdb("/genre/tv/list", {}, TTL.STATIC);
    return data?.genres ?? [];
  }
}

export const tmdbService = new TmdbService();
