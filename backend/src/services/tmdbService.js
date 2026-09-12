import axios from "axios";
import NodeCache from "node-cache";
import { env } from "../config/env.js";

// 15-minute TTL cache for movie data
const cache = new NodeCache({ stdTTL: 900, checkperiod: 120 });

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const getHeaders = () => {
  return {
    accept: "application/json",
    Authorization: `Bearer ${env.TMDB_READ_ACCESS_TOKEN}`,
  };
};

// Rich, high-fidelity fallback dataset for high-availability offline resilience
const FALLBACK_MOVIES = [
  {
    id: 693134,
    title: "Dune: Part Two",
    original_title: "Dune: Part Two",
    overview: "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
    poster_path: "/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    backdrop_path: "/xOMo8BRK7PfcJv9JCnx7s520b4q.jpg",
    release_date: "2024-02-27",
    vote_average: 8.3,
    vote_count: 4820,
    genre_ids: [878, 12],
    trailer_key: "Way9Dexny3w",
  },
  {
    id: 872585,
    title: "Oppenheimer",
    original_title: "Oppenheimer",
    overview: "The story of J. Robert Oppenheimer’s role in the development of the atomic bomb during World War II, examining the moral weight of technological breakthrough.",
    poster_path: "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    backdrop_path: "/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg",
    release_date: "2023-07-19",
    vote_average: 8.1,
    vote_count: 8120,
    genre_ids: [18, 36],
    trailer_key: "uYPbbksJxIg",
  },
  {
    id: 157336,
    title: "Interstellar",
    original_title: "Interstellar",
    overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop_path: "/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
    release_date: "2014-11-05",
    vote_average: 8.4,
    vote_count: 34200,
    genre_ids: [12, 18, 878],
    trailer_key: "zSWdZVtXT7E",
  },
  {
    id: 335984,
    title: "Blade Runner 2049",
    original_title: "Blade Runner 2049",
    overview: "Thirty years after the events of the first film, a new blade runner, LAPD Officer K, unearths a long-buried secret that has the potential to plunge what's left of society into chaos.",
    poster_path: "/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
    backdrop_path: "/ilRyAZwxi2x9uyq4VaAdzgmuTeY.jpg",
    release_date: "2017-10-04",
    vote_average: 7.6,
    vote_count: 13000,
    genre_ids: [878, 18, 9648],
    trailer_key: "gCcx85zbxz4",
  },
  {
    id: 27205,
    title: "Inception",
    original_title: "Inception",
    overview: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life in exchange for a nearly impossible task: inception.",
    poster_path: "/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    backdrop_path: "/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
    release_date: "2010-07-15",
    vote_average: 8.4,
    vote_count: 35800,
    genre_ids: [28, 878, 12],
    trailer_key: "YoHD9XEInc0",
  },
  {
    id: 438631,
    title: "Dune",
    original_title: "Dune",
    overview: "Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding, must travel to the most dangerous planet in the universe to ensure the future of his family and his people.",
    poster_path: "/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    backdrop_path: "/eeijXm355uP96ix55neIcuq0Uo2.jpg",
    release_date: "2021-09-15",
    vote_average: 7.8,
    vote_count: 11400,
    genre_ids: [878, 12],
    trailer_key: "8g18jFHCLXk",
  },
  {
    id: 550,
    title: "Fight Club",
    original_title: "Fight Club",
    overview: "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.",
    poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    backdrop_path: "/hZkgoQYus5vegHoetLkCJzb17zJ.jpg",
    release_date: "1999-10-15",
    vote_average: 8.4,
    vote_count: 28400,
    genre_ids: [18],
    trailer_key: "qtRKdV9EIJU",
  },
  {
    id: 155,
    title: "The Dark Knight",
    original_title: "The Dark Knight",
    overview: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdrop_path: "/dqK9Hag1054tghRQSqLSfrkvQnA.jpg",
    release_date: "2008-07-16",
    vote_average: 8.5,
    vote_count: 32000,
    genre_ids: [18, 28, 80, 53],
    trailer_key: "EXeTwQWrcwY",
  }
];

class TmdbService {
  async fetchFromTmdb(endpoint, params = {}) {
    const cacheKey = `${endpoint}_${JSON.stringify(params)}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await axios.get(`${TMDB_BASE_URL}${endpoint}`, {
        headers: getHeaders(),
        params: {
          language: "en-US",
          ...params,
        },
        timeout: 6000,
      });

      cache.set(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.warn(`[TMDB Proxy] Request to ${endpoint} failed (${error.message}). Checking cache or fallback.`);
      return null;
    }
  }

  async getNowPlaying(page = 1) {
    const data = await this.fetchFromTmdb("/movie/now_playing", { page });
    if (data?.results?.length) return data.results;
    return FALLBACK_MOVIES;
  }

  async getPopular(page = 1) {
    const data = await this.fetchFromTmdb("/movie/popular", { page });
    if (data?.results?.length) return data.results;
    return [...FALLBACK_MOVIES].reverse();
  }

  async getTopRated(page = 1) {
    const data = await this.fetchFromTmdb("/movie/top_rated", { page });
    if (data?.results?.length) return data.results;
    return FALLBACK_MOVIES.filter((m) => m.vote_average >= 8.0);
  }

  async getUpcoming(page = 1) {
    const data = await this.fetchFromTmdb("/movie/upcoming", { page });
    if (data?.results?.length) return data.results;
    return FALLBACK_MOVIES.slice(0, 4);
  }

  async getTrending(timeWindow = "day") {
    const data = await this.fetchFromTmdb(`/trending/movie/${timeWindow}`);
    if (data?.results?.length) return data.results;
    return FALLBACK_MOVIES;
  }

  async getMovieDetails(movieId) {
    const data = await this.fetchFromTmdb(`/movie/${movieId}`, {
      append_to_response: "videos,credits,similar",
    });
    if (data) return data;

    const fallback = FALLBACK_MOVIES.find((m) => m.id === Number(movieId)) || FALLBACK_MOVIES[0];
    return {
      ...fallback,
      genres: [{ id: 18, name: "Drama" }, { id: 878, name: "Sci-Fi" }],
      runtime: 166,
      status: "Released",
      tagline: "Experience the cinematic spectacle.",
    };
  }

  async getMovieVideos(movieId) {
    const data = await this.fetchFromTmdb(`/movie/${movieId}/videos`);
    if (data?.results?.length) {
      // Prioritize official trailers
      const trailer = data.results.find(
        (v) => (v.type === "Trailer" || v.type === "Teaser") && v.site === "YouTube"
      );
      return trailer || data.results[0];
    }

    const fallback = FALLBACK_MOVIES.find((m) => m.id === Number(movieId));
    return {
      key: fallback?.trailer_key || "Way9Dexny3w",
      name: `${fallback?.title || "Movie"} Official Trailer`,
      site: "YouTube",
      type: "Trailer",
    };
  }

  async searchMovies(query, page = 1) {
    if (!query || !query.trim()) return [];

    const data = await this.fetchFromTmdb("/search/movie", {
      query: query.trim(),
      include_adult: false,
      page,
    });

    if (data?.results) return data.results;

    // Filter fallback
    const q = query.toLowerCase();
    return FALLBACK_MOVIES.filter(
      (m) => m.title.toLowerCase().includes(q) || m.overview.toLowerCase().includes(q)
    );
  }
}

export const tmdbService = new TmdbService();
