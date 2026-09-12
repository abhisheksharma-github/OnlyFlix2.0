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
      const scrollAmount = rowRef.current.clientWidth * 0.75;
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
    <section className="relative group px-4 sm:px-8 md:px-12 py-4 sm:py-6">
      {/* Row Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="flex items-center gap-2.5 text-lg sm:text-2xl font-bold tracking-tight text-white font-sans">
          {Icon && <Icon className="w-5 h-5 text-brand" />}
          <span>{title}</span>
        </h3>
      </div>

      {/* Horizontal Scroll Area */}
      <div className="relative">
        {/* Left Arrow Button */}
        {showLeftArrow && (
          <button
            onClick={() => handleScroll("left")}
            className="absolute left-0 top-0 bottom-0 z-30 w-10 sm:w-12 bg-black/70 hover:bg-black/90 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white transition-all opacity-0 group-hover:opacity-100 rounded-r-xl border-r border-white/10"
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* Card Scroll Track */}
        <div
          ref={rowRef}
          onScroll={checkScrollPosition}
          className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-2 px-1 scroll-smooth"
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
            className="absolute right-0 top-0 bottom-0 z-30 w-10 sm:w-12 bg-black/70 hover:bg-black/90 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white transition-all opacity-0 group-hover:opacity-100 rounded-l-xl border-l border-white/10"
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
