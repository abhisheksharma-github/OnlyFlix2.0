import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, X, Film, AlertCircle } from "lucide-react";
import { moviesApi } from "../../api/client";
import { setSearchQuery, setSearchResults, setIsSearching } from "../../redux/uiSlice";
import { useDebounce } from "../../hooks/useDebounce";
import MovieCard from "../movie/MovieCard";
import { MovieCardSkeleton } from "../common/Skeleton";

const GENRES = ["All", "Action", "Sci-Fi", "Drama", "Comedy", "Thriller", "Horror", "Adventure"];

export const SearchMovie = () => {
  const dispatch = useDispatch();
  const { searchQuery, searchResults, isSearching } = useSelector((state) => state.ui);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [localInput, setLocalInput] = useState(searchQuery || "");

  const debouncedQuery = useDebounce(localInput, 350);

  useEffect(() => {
    dispatch(setSearchQuery(localInput));
  }, [localInput, dispatch]);

  useEffect(() => {
    const fetchSearch = async () => {
      if (!debouncedQuery.trim()) {
        dispatch(setSearchResults([]));
        return;
      }

      dispatch(setIsSearching(true));
      try {
        const res = await moviesApi.search(debouncedQuery.trim());
        dispatch(setSearchResults(res.data || []));
      } catch (err) {
        console.warn("Search failed:", err);
        dispatch(setSearchResults([]));
      } finally {
        dispatch(setIsSearching(false));
      }
    };

    fetchSearch();
  }, [debouncedQuery, dispatch]);

  const filteredResults = searchResults.filter((movie) => {
    if (selectedGenre === "All") return true;
    const genreLower = selectedGenre.toLowerCase();
    return (
      movie.title?.toLowerCase().includes(genreLower) ||
      movie.overview?.toLowerCase().includes(genreLower)
    );
  });

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header & Search Bar */}
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Explore <span className="text-brand">OnlyFlix</span> Catalog
        </h2>
        <p className="text-zinc-400 text-sm">
          Discover millions of movies, trailers, and hidden gems across all genres.
        </p>

        {/* Input Bar */}
        <div className="relative flex items-center bg-canvas-card border border-white/10 rounded-2xl shadow-tactile p-2 pl-4 focus-within:border-brand/60 focus-within:ring-1 focus-within:ring-brand/60 transition-all">
          <Search size={20} className="text-zinc-400 flex-shrink-0 mr-3" />
          <input
            type="text"
            value={localInput}
            onChange={(e) => setLocalInput(e.target.value)}
            placeholder="Search by title, director, or actor..."
            className="w-full bg-transparent text-white text-base placeholder-zinc-500 outline-none"
            autoFocus
          />
          {localInput && (
            <button
              onClick={() => setLocalInput("")}
              className="p-2 text-zinc-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Genre Filter Chips */}
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedGenre === genre
                  ? "bg-brand text-white shadow-glow-sm"
                  : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/5"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Results Content */}
      <div className="pt-6">
        {isSearching ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {Array.from({ length: 10 }).map((_, idx) => (
              <MovieCardSkeleton key={idx} />
            ))}
          </div>
        ) : localInput.trim() === "" ? (
          /* Empty Search Initial State */
          <div className="text-center py-20 space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mx-auto text-zinc-500">
              <Film size={28} />
            </div>
            <h3 className="text-lg font-bold text-white">Start searching above</h3>
            <p className="text-xs sm:text-sm text-zinc-400">
              Type movie titles like <span className="text-zinc-200 font-medium">"Oppenheimer"</span>,{" "}
              <span className="text-zinc-200 font-medium">"Interstellar"</span>, or{" "}
              <span className="text-zinc-200 font-medium">"Dune"</span>.
            </p>
          </div>
        ) : filteredResults.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs sm:text-sm text-zinc-400 px-1">
              <span>
                Found <strong className="text-white">{filteredResults.length}</strong> matching titles
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {filteredResults.map((movie) => (
                <MovieCard key={movie.id || movie.movieId} movie={movie} />
              ))}
            </div>
          </div>
        ) : (
          /* No Results Found State */
          <div className="text-center py-20 space-y-4 max-w-md mx-auto animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-brand">
              <AlertCircle size={28} />
            </div>
            <h3 className="text-lg font-bold text-white">No titles found for "{localInput}"</h3>
            <p className="text-xs sm:text-sm text-zinc-400">
              Try checking your spelling or searching for a different keyword.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchMovie;
