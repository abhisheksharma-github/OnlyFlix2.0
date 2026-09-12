import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Play, Plus, Check, Star, Info, ChevronRight } from "lucide-react";
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
  const rating = movie.vote_average || movie.voteAverage || 8.2;
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : "2024";

  const genres =
    movie.genres?.map((g) => g.name) ||
    movie.genre_ids?.map((id) => GENRE_MAP[id]).filter(Boolean).slice(0, 3) ||
    ["Action", "Sci-Fi"];

  const handlePlayTrailer = () => {
    dispatch(setSelectedMovie(movie));
    dispatch(setModalOpen(true));
  };

  const handleNextHero = () => {
    if (!nowPlaying || nowPlaying.length === 0) return;
    const currentIndex = nowPlaying.findIndex((m) => m.id === movie.id);
    const nextIndex = (currentIndex + 1) % Math.min(nowPlaying.length, 5);
    setBackdropLoaded(false);
    dispatch(setHeroMovie(nowPlaying[nextIndex]));
  };

  return (
    <div className="relative w-full h-[75vh] min-h-[580px] max-h-[820px] overflow-hidden flex items-end">
      {/* Background Backdrop Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={getBackdrop(movie.backdrop_path || movie.backdropPath)}
          alt={movie.title}
          onLoad={() => setBackdropLoaded(true)}
          className={`w-full h-full object-cover object-center transition-all duration-700 scale-105 ${
            backdropLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
        {/* Multilayered Cinematic Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080A] via-[#08080A]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08080A] via-[#08080A]/60 to-transparent w-full md:w-3/4" />
        <div className="absolute inset-0 bg-radial-vignette opacity-70" />
      </div>

      {/* Hero Content Information */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 md:px-12 pb-14 sm:pb-20 w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl space-y-4">
          {/* Metadata Chips */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold">
            <span className="px-2.5 py-0.5 rounded-full bg-brand text-white text-[11px] font-extrabold tracking-wider uppercase shadow-glow-sm">
              Featured Premiere
            </span>

            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-amber-400 border border-white/10">
              <Star size={12} className="fill-amber-400" />
              {Number(rating).toFixed(1)}
            </span>

            <span className="text-zinc-300 px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-md border border-white/10">
              {releaseYear}
            </span>

            <div className="hidden sm:flex items-center gap-1.5 text-zinc-400">
              {genres.map((genre, idx) => (
                <span key={idx} className="after:content-['•'] last:after:content-none after:ml-1.5">
                  {genre}
                </span>
              ))}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight font-sans drop-shadow-lg leading-none">
            {movie.title || movie.name}
          </h1>

          {/* Synopsis */}
          <p className="text-zinc-300 text-sm sm:text-base line-clamp-3 leading-relaxed drop-shadow-md max-w-xl font-normal">
            {movie.overview}
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handlePlayTrailer}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-sm sm:text-base shadow-glow-sm hover:shadow-glow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Play size={18} className="fill-white" />
              <span>Watch Trailer</span>
            </button>

            <button
              onClick={() => toggleWatchlist(movie)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm sm:text-base backdrop-blur-md transition-all duration-200 border ${
                inWatchlist
                  ? "bg-zinc-800/90 text-brand border-brand/40 hover:bg-zinc-700"
                  : "bg-black/60 hover:bg-black/80 text-white border-white/20 hover:border-white/40"
              }`}
            >
              {inWatchlist ? (
                <>
                  <Check size={18} />
                  <span>In My List</span>
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
              className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-200 hover:text-white text-sm font-medium border border-white/10 transition-colors"
            >
              <Info size={18} />
              <span className="hidden sm:inline">Details</span>
            </button>
          </div>
        </div>

        {/* Right Side: Quick Carousel Switcher */}
        {nowPlaying?.length > 1 && (
          <div className="hidden md:flex flex-col items-end gap-2">
            <button
              onClick={handleNextHero}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white transition-all group"
            >
              <span>Next Spotlight</span>
              <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSpotlight;
