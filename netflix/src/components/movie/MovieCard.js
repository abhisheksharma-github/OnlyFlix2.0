import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Play, Plus, Check, Star } from "lucide-react";
import { setSelectedMovie, setModalOpen } from "../../redux/movieSlice";
import { useWatchlist } from "../../hooks/useWatchlist";
import { getImage } from "../../utils/constant";

export const MovieCard = ({ movie, posterPath, movieId }) => {
  const dispatch = useDispatch();
  const { toggleWatchlist, items } = useWatchlist();
  const [imageLoaded, setImageLoaded] = useState(false);

  // Normalize props
  const item = movie || {
    id: movieId,
    movieId: movieId,
    poster_path: posterPath,
    posterPath: posterPath,
    title: "Featured Title",
    vote_average: 7.8,
  };

  const id = item.id || item.movieId;
  const inList = items.some(
    (w) => Number(w.movieId || w.id) === Number(id)
  );
  const poster = item.poster_path || item.posterPath || posterPath;
  const rating = item.vote_average || item.voteAverage || 7.5;
  const title = item.title || item.name || "Movie Title";
  const releaseYear = item.release_date
    ? new Date(item.release_date).getFullYear()
    : item.releaseDate
    ? new Date(item.releaseDate).getFullYear()
    : null;

  const handleCardClick = () => {
    dispatch(setSelectedMovie(item));
    dispatch(setModalOpen(true));
  };

  const handleWatchlistClick = (e) => {
    e.stopPropagation();
    toggleWatchlist(item);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex-none w-36 sm:w-44 md:w-52 aspect-[2/3] rounded-2xl overflow-hidden cursor-pointer bg-[#12131A] border border-white/5 transition-all duration-300 hover:scale-[1.05] hover:shadow-2xl hover:shadow-black hover:border-brand/50 hover:z-20 select-none"
    >
      {/* Poster Image */}
      <img
        src={getImage(poster, "w500")}
        alt={title}
        onLoad={() => setImageLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
          imageLoaded ? "opacity-100" : "opacity-0"
        }`}
        loading="lazy"
      />

      {/* Shimmer Placeholder when loading */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 animate-pulse" />
      )}

      {/* Floating Rating Badge */}
      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur-md text-[11px] font-bold text-amber-400 border border-white/10 flex items-center gap-1 z-10 shadow-md">
        <Star size={11} className="fill-amber-400 text-amber-400" />
        {Number(rating).toFixed(1)}
      </div>

      {/* 4K Pill Badge */}
      <div className="absolute top-2.5 right-2.5 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[9px] font-extrabold text-zinc-300 border border-white/10 z-10">
        4K
      </div>

      {/* Hover Overlay with Action Buttons */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3.5 sm:p-4 z-10">
        {releaseYear && (
          <span className="text-[10px] font-semibold text-zinc-400 mb-0.5">
            {releaseYear}
          </span>
        )}
        <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1 mb-2.5 drop-shadow-md">
          {title}
        </h4>

        <div className="flex items-center gap-2">
          {/* Play Trailer Action */}
          <button
            onClick={handleCardClick}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-gradient-to-r from-brand to-rose-600 hover:from-brand-hover hover:to-rose-500 text-white text-xs font-bold transition-all shadow-glow-sm active:scale-95"
          >
            <Play size={13} className="fill-white" />
            <span>Trailer</span>
          </button>

          {/* Quick Watchlist Toggle */}
          <button
            onClick={handleWatchlistClick}
            className={`p-2 rounded-xl border text-xs transition-all active:scale-90 ${
              inList
                ? "bg-zinc-800 text-brand border-brand/60 hover:bg-zinc-700"
                : "bg-black/70 text-white border-white/20 hover:bg-black hover:text-brand hover:border-brand/40"
            }`}
            title={inList ? "Remove from Watchlist" : "Add to Watchlist"}
            aria-label={inList ? "Remove from Watchlist" : "Add to Watchlist"}
          >
            {inList ? <Check size={14} className="text-brand" /> : <Plus size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
