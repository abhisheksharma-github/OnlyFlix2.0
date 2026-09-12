import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, Plus, Check, Star, Calendar, Clock } from "lucide-react";
import { setModalOpen } from "../../redux/movieSlice";
import { moviesApi } from "../../api/client";
import { useWatchlist } from "../../hooks/useWatchlist";
import { getBackdrop, GENRE_MAP } from "../../utils/constant";

export const MovieDetailModal = () => {
  const dispatch = useDispatch();
  const { isModalOpen, selectedMovie } = useSelector((state) => state.movie);
  const [movieDetails, setMovieDetails] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  const movieId = selectedMovie?.id || selectedMovie?.movieId;

  useEffect(() => {
    if (!isModalOpen || !movieId) return;

    let isMounted = true;

    const loadDetailsAndTrailer = async () => {
      try {
        const [detailsRes, videosRes] = await Promise.allSettled([
          moviesApi.getDetails(movieId),
          moviesApi.getVideos(movieId),
        ]);

        if (isMounted) {
          if (detailsRes.status === "fulfilled" && detailsRes.value?.data) {
            setMovieDetails(detailsRes.value.data);
          } else {
            setMovieDetails(selectedMovie);
          }

          if (videosRes.status === "fulfilled" && videosRes.value?.data?.key) {
            setTrailerKey(videosRes.value.data.key);
          } else {
            setTrailerKey(null);
          }
        }
      } catch (err) {
        console.warn("Failed to load modal details:", err);
      }
    };

    loadDetailsAndTrailer();

    // Keydown handler for Escape key
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        dispatch(setModalOpen(false));
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // Prevent background scrolling when modal is open
    document.body.style.overflow = "hidden";

    return () => {
      isMounted = false;
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen, movieId, selectedMovie, dispatch]);

  if (!isModalOpen) return null;

  const movie = movieDetails || selectedMovie;
  const inWatchlist = isInWatchlist(movieId);

  const releaseYear = movie?.release_date
    ? new Date(movie.release_date).getFullYear()
    : movie?.releaseDate
    ? new Date(movie.releaseDate).getFullYear()
    : "2024";

  const rating = movie?.vote_average || movie?.voteAverage || 7.8;
  const genres =
    movie?.genres?.map((g) => g.name) ||
    movie?.genre_ids?.map((id) => GENRE_MAP[id]).filter(Boolean) ||
    ["Feature", "Streaming"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      {/* Dark blur backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-300"
        onClick={() => dispatch(setModalOpen(false))}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-canvas-card border border-white/10 rounded-2xl shadow-modal z-10 no-scrollbar animate-scale-in">
        {/* Close Button */}
        <button
          onClick={() => dispatch(setModalOpen(false))}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white/80 hover:text-white border border-white/10 transition-colors"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Video / Backdrop Player Header */}
        <div className="relative w-full aspect-video bg-black rounded-t-2xl overflow-hidden">
          {trailerKey ? (
            <iframe
              className="w-full h-full object-cover scale-[1.02]"
              src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1`}
              title={movie?.title || "Movie Trailer"}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="relative w-full h-full">
              <img
                src={getBackdrop(movie?.backdrop_path || movie?.backdropPath)}
                alt={movie?.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-canvas-card via-transparent to-black/40" />
            </div>
          )}
        </div>

        {/* Details Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Title & Actions Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {movie?.title || movie?.name || "Movie Details"}
              </h2>
              {movie?.tagline && (
                <p className="text-sm sm:text-base text-zinc-400 italic mt-1 font-medium">
                  "{movie.tagline}"
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleWatchlist(movie)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  inWatchlist
                    ? "bg-zinc-800 text-white border border-brand/50 hover:bg-zinc-700"
                    : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                }`}
              >
                {inWatchlist ? (
                  <>
                    <Check size={18} className="text-brand" />
                    <span>In Watchlist</span>
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    <span>Add to Watchlist</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-semibold">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              {Number(rating).toFixed(1)}
            </span>

            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-300 border border-white/5">
              <Calendar size={14} />
              {releaseYear}
            </span>

            {movie?.runtime && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-300 border border-white/5">
                <Clock size={14} />
                {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
              </span>
            )}

            <span className="px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-brand/20 text-brand border border-brand/30">
              Ultra HD 4K
            </span>
          </div>

          {/* Synopsis */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase font-bold text-zinc-400 tracking-wider">
              Synopsis
            </h3>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              {movie?.overview || "No extended overview available for this title."}
            </p>
          </div>

          {/* Genres Chips */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase font-bold text-zinc-400 tracking-wider">
              Genres
            </h3>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-zinc-800/80 text-zinc-300 border border-white/5"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailModal;
