import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "./MovieCard";
import { MovieCardSkeleton } from "../common/Skeleton";

export const MovieRow = ({ title, movies = [], icon: Icon, isLoading = false }) => {
  const rowRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScrollPosition = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftArrow(scrollLeft > 20);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  useEffect(() => {
    checkScrollPosition();
  }, [movies]);

  const handleScroll = (direction) => {
    if (rowRef.current) {
      const scrollAmount = rowRef.current.clientWidth * 0.8;
      rowRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScrollPosition, 350);
    }
  };

  if (!isLoading && (!movies || movies.length === 0)) {
    return null;
  }

  return (
    <section className="relative group px-4 sm:px-8 md:px-12 py-3 sm:py-5">
      {/* Row Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="flex items-center gap-2.5 text-lg sm:text-2xl font-black tracking-tight text-white font-sans">
          {Icon && (
            <div className="w-7 h-7 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center">
              <Icon className="w-4 h-4 text-brand" />
            </div>
          )}
          <span>{title}</span>
        </h3>
        <span className="text-xs font-semibold text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer hidden sm:block">
          Explore All →
        </span>
      </div>

      {/* Horizontal Scroll Track Container */}
      <div className="relative">
        {/* Left Arrow Button */}
        {showLeftArrow && (
          <button
            onClick={() => handleScroll("left")}
            className="absolute left-0 top-0 bottom-0 z-30 w-10 sm:w-12 bg-black/80 hover:bg-black/95 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white transition-all opacity-0 group-hover:opacity-100 rounded-r-2xl border-r border-white/10 shadow-2xl"
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* Card Scroll Track */}
        <div
          ref={rowRef}
          onScroll={checkScrollPosition}
          className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-2.5 px-1 scroll-smooth"
        >
          {isLoading
            ? Array.from({ length: 6 }).map((_, idx) => <MovieCardSkeleton key={idx} />)
            : movies.map((movie) => (
                <MovieCard key={movie.id || movie.movieId} movie={movie} />
              ))}
        </div>

        {/* Right Arrow Button */}
        {showRightArrow && (
          <button
            onClick={() => handleScroll("right")}
            className="absolute right-0 top-0 bottom-0 z-30 w-10 sm:w-12 bg-black/80 hover:bg-black/95 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white transition-all opacity-0 group-hover:opacity-100 rounded-l-2xl border-l border-white/10 shadow-2xl"
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </section>
  );
};

export default MovieRow;
