import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, Plus, Check, Star, Calendar, Clock, Sparkles, Film } from "lucide-react";
import { setModalOpen } from "../../redux/movieSlice";
import { moviesApi } from "../../api/client";
import { useWatchlist } from "../../hooks/useWatchlist";
import { getBackdrop, GENRE_MAP } from "../../utils/constant";

export const MovieDetailModal = () => {
  const dispatch = useDispatch();
  const { isModalOpen, selectedMovie } = useSelector((state) => state.movie);
  const [movieDetails, setMovieDetails] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isLoadingTrailer, setIsLoadingTrailer] = useState(true);
  const { toggleWatchlist, items } = useWatchlist();

  const movieId = selectedMovie?.id || selectedMovie?.movieId;
  const inWatchlist = items.some(
    (w) => Number(w.movieId || w.id) === Number(movieId)
  );

  useEffect(() => {
    if (!isModalOpen || !movieId) return;

    let isMounted = true;
    setIsLoadingTrailer(true);

    const loadDetailsAndTrailer = async () => {
      try {
        const [detailsRes, videosRes] = await Promise.allSettled([
          moviesApi.getDetails(movieId),
          moviesApi.getTrailer(movieId),
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
      } finally {
        if (isMounted) setIsLoadingTrailer(false);
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

  const releaseYear = movie?.release_date
    ? new Date(movie.release_date).getFullYear()
    : movie?.releaseDate
    ? new Date(movie.releaseDate).getFullYear()
    : "2025";

  const rating = movie?.vote_average || movie?.voteAverage || 8.0;
  const genres =
    movie?.genres?.map((g) => g.name) ||
    movie?.genre_ids?.map((id) => GENRE_MAP[id]).filter(Boolean) ||
    ["Action", "Cinematic Feature"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      {/* Dark Blur Backdrop */}
      <div
        className="fixed inset-0 bg-black/90 backdrop-blur-xl transition-opacity duration-300"
        onClick={() => dispatch(setModalOpen(false))}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#12131A] border border-white/15 rounded-3xl shadow-2xl shadow-black z-10 no-scrollbar animate-scale-in">
        {/* Close Button */}
        <button
          onClick={() => dispatch(setModalOpen(false))}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/70 hover:bg-black text-white/80 hover:text-white border border-white/15 transition-all shadow-lg active:scale-95"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Video / Backdrop Player Header */}
        <div className="relative w-full aspect-video bg-black rounded-t-3xl overflow-hidden">
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
                alt={movie?.title || "Movie Backdrop"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12131A] via-transparent to-black/50" />
              {isLoadingTrailer ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                  <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-black/80 border border-white/10 text-white text-xs font-semibold">
                    <div className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                    <span>Loading Official Trailer...</span>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10 text-zinc-300 text-xs font-medium">
                    <Film size={16} className="text-brand" />
                    <span>Trailer stream preview active</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Details Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Title & Actions Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-brand text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles size={13} />
                <span>OnlyFlix Spotlight</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {movie?.title || movie?.name || "Movie Details"}
              </h2>
              {movie?.tagline && (
                <p className="text-xs sm:text-sm text-zinc-400 italic mt-1 font-medium">
                  "{movie.tagline}"
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => toggleWatchlist(movie)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-200 border shadow-lg ${
                  inWatchlist
                    ? "bg-zinc-800 text-brand border-brand/50 hover:bg-zinc-700"
                    : "bg-gradient-to-r from-brand to-rose-600 text-white border-transparent hover:from-brand-hover hover:to-rose-500 shadow-glow-sm"
                }`}
              >
                {inWatchlist ? (
                  <>
                    <Check size={16} className="text-brand" />
                    <span>Saved in Watchlist</span>
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    <span>Add to Watchlist</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm font-semibold">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold">
              <Star size={13} className="fill-amber-400 text-amber-400" />
              {Number(rating).toFixed(1)} IMDb
            </span>

            <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-zinc-900 text-zinc-300 border border-white/10">
              <Calendar size={13} />
              {releaseYear}
            </span>

            {movie?.runtime && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-zinc-900 text-zinc-300 border border-white/10">
                <Clock size={13} />
                {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
              </span>
            )}

            <span className="px-2.5 py-1 rounded-xl text-[10px] font-extrabold tracking-wider uppercase bg-brand/20 text-brand border border-brand/30">
              4K ULTRA HD
            </span>

            <span className="px-2.5 py-1 rounded-xl text-[10px] font-extrabold tracking-wider uppercase bg-white/10 text-zinc-300 border border-white/10">
              DOLBY ATMOS
            </span>
          </div>

          {/* Synopsis */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase font-extrabold text-zinc-400 tracking-wider">
              Synopsis & Storyline
            </h3>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-normal">
              {movie?.overview || "No extended overview available for this title."}
            </p>
          </div>

          {/* Genres Chips */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase font-extrabold text-zinc-400 tracking-wider">
              Categories & Genres
            </h3>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1 rounded-xl text-xs font-semibold bg-zinc-900 text-zinc-300 border border-white/10"
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
