import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Play, Plus, Check, Star } from "lucide-react";
import { setSelectedMovie, setModalOpen } from "../../redux/movieSlice";
import { useWatchlist } from "../../hooks/useWatchlist";
import { getImage } from "../../utils/constant";

export const MovieCard = ({ movie, posterPath, movieId }) => {
  const dispatch = useDispatch();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const [imageLoaded, setImageLoaded] = useState(false);

  // Normalize props for backward compatibility
  const item = movie || {
    id: movieId,
    movieId: movieId,
    poster_path: posterPath,
    posterPath: posterPath,
    title: "Featured Title",
    vote_average: 7.5,
  };

  const id = item.id || item.movieId;
  const inList = isInWatchlist(id);
  const poster = item.poster_path || item.posterPath || posterPath;
  const rating = item.vote_average || item.voteAverage || 7.5;
  const title = item.title || item.name || "Movie";

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
      className="group relative flex-none w-36 sm:w-44 md:w-52 aspect-[2/3] rounded-xl overflow-hidden cursor-pointer bg-canvas-card border border-white/5 transition-all duration-300 hover:scale-[1.04] hover:shadow-tactile hover:border-white/20 hover:z-20"
    >
      {/* Poster Image */}
      <img
        src={getImage(poster, "w500")}
        alt={title}
        onLoad={() => setImageLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          imageLoaded ? "opacity-100" : "opacity-0"
        }`}
        loading="lazy"
      />

      {!imageLoaded && (
        <div className="absolute inset-0 skeleton-shimmer" />
      )}

      {/* Floating Rating Badge (Always visible) */}
      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[11px] font-bold text-amber-400 border border-white/10 flex items-center gap-1 z-10 shadow-sm">
        <Star size={11} className="fill-amber-400 text-amber-400" />
        {Number(rating).toFixed(1)}
      </div>

      {/* Hover Overlay with Action Buttons */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3 sm:p-4 z-10">
        <h4 className="text-sm font-bold text-white line-clamp-1 mb-2 drop-shadow-md">
          {title}
        </h4>

        <div className="flex items-center gap-2">
          {/* Play Trailer Action */}
          <button
            onClick={handleCardClick}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-brand hover:bg-brand-hover text-white text-xs font-bold transition-all shadow-glow-sm"
          >
            <Play size={13} className="fill-white" />
            <span>Trailer</span>
          </button>

          {/* Quick Watchlist Toggle */}
          <button
            onClick={handleWatchlistClick}
            className={`p-1.5 rounded-lg border text-xs transition-colors ${
              inList
                ? "bg-zinc-800 text-brand border-brand/50 hover:bg-zinc-700"
                : "bg-black/60 text-white border-white/20 hover:bg-black/90 hover:text-brand"
            }`}
            title={inList ? "Remove from Watchlist" : "Add to Watchlist"}
          >
            {inList ? <Check size={14} /> : <Plus size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
