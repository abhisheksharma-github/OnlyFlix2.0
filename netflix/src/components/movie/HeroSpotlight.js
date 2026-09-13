import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Play, Plus, Check, Star, Info, Sparkles, ChevronRight, Clapperboard } from "lucide-react";
import { setSelectedMovie, setModalOpen, setHeroMovie } from "../../redux/movieSlice";
import { useWatchlist } from "../../hooks/useWatchlist";
import { getBackdrop, GENRE_MAP } from "../../utils/constant";
import { HeroSkeleton } from "../common/Skeleton";

export const HeroSpotlight = () => {
  const dispatch = useDispatch();
  const { heroMovie, nowPlaying, isLoadingMovies } = useSelector((state) => state.movie);
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const [backdropLoaded, setBackdropLoaded] = useState(false);

  const movie = heroMovie || (nowPlaying?.length > 0 ? nowPlaying[0] : null);

  if (isLoadingMovies || !movie) {
    return <HeroSkeleton />;
  }

  const movieId = movie.id || movie.movieId;
  const inWatchlist = isInWatchlist(movieId);
  const rating = movie.vote_average || movie.voteAverage || 8.4;
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "2025";

  const genres =
    movie.genres?.map((g) => g.name) ||
    movie.genre_ids?.map((id) => GENRE_MAP[id]).filter(Boolean).slice(0, 3) ||
    ["Action", "Cinematic Premiere"];

  const handlePlayTrailer = () => {
    dispatch(setSelectedMovie(movie));
    dispatch(setModalOpen(true));
  };

  const handleNextHero = () => {
    if (!nowPlaying || nowPlaying.length === 0) return;
    const currentIndex = nowPlaying.findIndex((m) => m.id === movie.id);
    const nextIndex = (currentIndex + 1) % Math.min(nowPlaying.length, 6);
    setBackdropLoaded(false);
    dispatch(setHeroMovie(nowPlaying[nextIndex]));
  };

  return (
    <div className="relative w-full h-[80vh] min-h-[620px] max-h-[880px] overflow-hidden flex items-end">
      {/* Background Cinematic Backdrop Image */}
      <div className="absolute inset-0 z-0 bg-[#08080A]">
        <img
          src={getBackdrop(movie.backdrop_path || movie.backdropPath)}
          alt={movie.title || "Movie Backdrop"}
          onLoad={() => setBackdropLoaded(true)}
          className={`w-full h-full object-cover object-center transition-all duration-1000 scale-105 ${
            backdropLoaded ? "opacity-95" : "opacity-0"
          }`}
        />
        {/* Multilayered Atmospheric Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080A] via-[#08080A]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08080A] via-[#08080A]/70 to-transparent w-full md:w-3/4" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(229,9,20,0.12),transparent_70%)]" />
      </div>

      {/* Hero Content Information */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 md:px-12 pb-16 sm:pb-24 w-full flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-2xl space-y-4">
          {/* Metadata Chips */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-brand to-rose-600 text-white text-[11px] font-black tracking-wider uppercase shadow-glow-sm">
              <Sparkles size={12} className="animate-spin" style={{ animationDuration: "5s" }} />
              OnlyFlix Premiere
            </span>

            <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-amber-400 border border-amber-400/20 font-bold">
              <Star size={13} className="fill-amber-400 text-amber-400" />
              {Number(rating).toFixed(1)}
            </span>

            <span className="text-zinc-300 px-2.5 py-1 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 font-medium">
              {releaseYear}
            </span>

            <span className="text-zinc-300 px-2.5 py-1 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 font-bold text-[10px] tracking-wider uppercase">
              4K ULTRA HD
            </span>

            <div className="hidden sm:flex items-center gap-1.5 text-zinc-400">
              {genres.map((genre, idx) => (
                <span key={idx} className="after:content-['•'] last:after:content-none after:ml-1.5 font-medium text-zinc-300">
                  {genre}
                </span>
              ))}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight font-sans drop-shadow-2xl leading-none">
            {movie.title || movie.name}
          </h1>

          {/* Synopsis */}
          <p className="text-zinc-300 text-sm sm:text-base line-clamp-3 leading-relaxed drop-shadow-lg max-w-xl font-normal">
            {movie.overview}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 pt-3">
            <button
              onClick={handlePlayTrailer}
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-brand to-rose-600 hover:from-brand-hover hover:to-rose-500 text-white font-extrabold text-sm sm:text-base shadow-glow-sm hover:shadow-glow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <Play size={18} className="fill-white" />
              <span>Watch Trailer</span>
            </button>

            <button
              onClick={() => toggleWatchlist(movie)}
              className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl font-bold text-sm sm:text-base backdrop-blur-xl transition-all duration-200 border ${
                inWatchlist
                  ? "bg-zinc-800/90 text-brand border-brand/50 hover:bg-zinc-700/90"
                  : "bg-black/60 hover:bg-black/85 text-white border-white/20 hover:border-white/40"
              }`}
            >
              {inWatchlist ? (
                <>
                  <Check size={18} className="text-brand" />
                  <span>Saved in List</span>
                </>
              ) : (
                <>
                  <Plus size={18} />
                  <span>Add to List</span>
                </>
              )}
            </button>

            <button
              onClick={handlePlayTrailer}
              className="flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-zinc-200 hover:text-white text-sm font-semibold border border-white/10 backdrop-blur-md transition-all"
            >
              <Info size={18} />
              <span className="hidden sm:inline">Details</span>
            </button>
          </div>
        </div>

        {/* Next Spotlight Switcher Carousel */}
        {nowPlaying?.length > 1 && (
          <div className="hidden md:flex flex-col items-end gap-2.5">
            <button
              onClick={handleNextHero}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-black/70 hover:bg-black/95 backdrop-blur-xl border border-white/15 text-xs font-bold text-zinc-300 hover:text-white transition-all group shadow-xl"
            >
              <Clapperboard size={14} className="text-brand" />
              <span>Next Premiere</span>
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform text-zinc-400 group-hover:text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSpotlight;
