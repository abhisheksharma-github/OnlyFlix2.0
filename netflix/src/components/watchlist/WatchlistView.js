import React from "react";
import { useDispatch } from "react-redux";
import { Bookmark, Compass } from "lucide-react";
import { useWatchlist } from "../../hooks/useWatchlist";
import { setActiveTab } from "../../redux/uiSlice";
import MovieCard from "../movie/MovieCard";
import { MovieCardSkeleton } from "../common/Skeleton";

export const WatchlistView = () => {
  const dispatch = useDispatch();
  const { items, isLoading } = useWatchlist();

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-1">
          <h2 className="flex items-center gap-3 text-2xl sm:text-4xl font-black text-white tracking-tight">
            <Bookmark className="w-7 h-7 text-brand fill-brand" />
            <span>My Watchlist</span>
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm">
            Saved titles to watch next on any device.
          </p>
        </div>

        <div className="text-xs sm:text-sm font-semibold text-zinc-400">
          <span className="text-white font-bold text-base sm:text-lg mr-1">{items.length}</span>
          {items.length === 1 ? "saved title" : "saved titles"}
        </div>
      </div>

      {/* Grid Content */}
      <div>
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {Array.from({ length: 5 }).map((_, idx) => (
              <MovieCardSkeleton key={idx} />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {items.map((item) => (
              <MovieCard key={item.movieId} movie={item} />
            ))}
          </div>
        ) : (
          /* Empty Watchlist State */
          <div className="text-center py-20 space-y-5 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mx-auto text-zinc-500">
              <Bookmark size={28} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Your watchlist is empty</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Explore popular and trending titles and click the "+" icon to save them to your personal watchlist.
              </p>
            </div>
            <button
              onClick={() => dispatch(setActiveTab("home"))}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-sm shadow-glow-sm transition-all"
            >
              <Compass size={18} />
              <span>Explore Titles</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchlistView;
