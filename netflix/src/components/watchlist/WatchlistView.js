import React from "react";
import { useDispatch } from "react-redux";
import { Bookmark, Compass, Sparkles } from "lucide-react";
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles size={13} />
            <span>Personal Collection</span>
          </div>
          <h2 className="flex items-center gap-3 text-2xl sm:text-4xl font-black text-white tracking-tight">
            <Bookmark className="w-7 h-7 text-brand fill-brand" />
            <span>My Watchlist</span>
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm">
            Saved movies & trailers synchronized across all your devices.
          </p>
        </div>

        <div className="text-xs sm:text-sm font-semibold text-zinc-400 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl w-fit">
          <span className="text-white font-extrabold text-base mr-1.5">{items.length}</span>
          {items.length === 1 ? "Saved Title" : "Saved Titles"}
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
              <MovieCard key={item.movieId || item.id} movie={item} />
            ))}
          </div>
        ) : (
          /* Empty Watchlist State */
          <div className="text-center py-20 space-y-5 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mx-auto text-brand shadow-glow-sm">
              <Bookmark size={28} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-white">Your watchlist is waiting</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Discover trending premieres or search titles, then tap the bookmark icon to start building your personal OnlyFlix collection.
              </p>
            </div>
            <button
              onClick={() => dispatch(setActiveTab("home"))}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-brand to-rose-600 hover:from-brand-hover hover:to-rose-500 text-white font-bold text-sm shadow-glow-sm hover:shadow-glow-lg transition-all"
            >
              <Compass size={18} />
              <span>Explore Premieres</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchlistView;
