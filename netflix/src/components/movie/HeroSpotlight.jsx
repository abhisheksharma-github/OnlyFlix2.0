/**
 * HeroSpotlight.jsx
 * Full-bleed billboard hero with:
 *  - Dynamic TMDB backdrop with multi-layer gradient vignette
 *  - Rating display (vote average mapped to star display)
 *  - Trailer trigger → opens UniversalPlayerModal
 *  - Watchlist bookmark action
 *  - Animated text entrance
 *  - Auto-cycles through trending items every 8 seconds
 */

import React, { useState, useEffect, useCallback, memo } from "react";
import { useDispatch } from "react-redux";
import { Play, Bookmark, BookmarkCheck, Info, Star } from "lucide-react";
import { openModal } from "../../redux/uiSlice";
import { useWatchlistStatus } from "../../hooks/useWatchlistStatus";

const BACKDROP_BASE = "https://image.tmdb.org/t/p/original";
const CYCLE_INTERVAL_MS = 8000;

/**
 * @param {{
 *   items: unknown[];
 *   isLoading?: boolean;
 * }} props
 */
function HeroSpotlight({ items = [], isLoading = false }) {
  const dispatch = useDispatch();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const featured = items[activeIndex];
  const mediaType = featured?.media_type === "tv" ? "TV" : "MOVIE";
  const title = featured?.displayTitle || featured?.title || featured?.name || "";
  const overview = featured?.overview || "";
  const rating = featured?.vote_average ? featured.vote_average.toFixed(1) : null;
  const year = (featured?.displayDate || featured?.release_date || featured?.first_air_date || "").slice(0, 4);
  const backdropUrl = featured?.backdrop_path
    ? `${BACKDROP_BASE}${featured.backdrop_path}`
    : null;

  const { isInWatchlist, toggle } = useWatchlistStatus(
    featured?.id,
    mediaType,
    {
      title,
      posterPath: featured?.poster_path,
      backdropPath: featured?.backdrop_path,
      overview,
      voteAverage: featured?.vote_average,
      releaseDate: featured?.displayDate || featured?.release_date || featured?.first_air_date,
    }
  );

  // Auto-cycle
  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % items.length);
        setIsTransitioning(false);
      }, 400);
    }, CYCLE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [items.length]);

  const handleOpenModal = useCallback(() => {
    if (!featured) return;
    dispatch(openModal({ id: featured.id, type: featured.media_type || "movie" }));
  }, [dispatch, featured]);

  if (isLoading || !featured) {
    return (
      <div className="hero-spotlight hero-spotlight--skeleton" aria-hidden="true">
        <div className="hero-spotlight__shimmer" />
      </div>
    );
  }

  return (
    <section className="hero-spotlight" aria-label={`Featured: ${title}`}>
      {/* Background */}
      <div className="hero-spotlight__bg">
        {backdropUrl && (
          <img
            key={backdropUrl}
            src={backdropUrl}
            alt=""
            className="hero-spotlight__backdrop"
            style={{ opacity: isTransitioning ? 0 : 1 }}
          />
        )}
        {/* Vignette masks */}
        <div className="hero-spotlight__vignette-bottom" />
        <div className="hero-spotlight__vignette-left" />
        <div className="hero-spotlight__vignette-top" />
      </div>

      {/* Content */}
      <div
        className="hero-spotlight__content"
        style={{ opacity: isTransitioning ? 0 : 1 }}
      >
        {/* Meta chips */}
        <div className="hero-spotlight__meta">
          {rating && (
            <span className="hero-spotlight__chip hero-spotlight__chip--rating">
              <Star size={12} fill="currentColor" />
              {rating}
            </span>
          )}
          {year && (
            <span className="hero-spotlight__chip">{year}</span>
          )}
          <span className="hero-spotlight__chip">
            {featured.media_type === "tv" ? "TV Series" : "Film"}
          </span>
        </div>

        {/* Title */}
        <h1 className="hero-spotlight__title">{title}</h1>

        {/* Overview */}
        <p className="hero-spotlight__overview">{overview}</p>

        {/* CTA Buttons */}
        <div className="hero-spotlight__actions">
          <button
            className="hero-spotlight__btn hero-spotlight__btn--primary"
            onClick={handleOpenModal}
            aria-label={`Watch ${title}`}
          >
            <Play size={18} fill="currentColor" strokeWidth={0} />
            Watch Now
          </button>

          <button
            className="hero-spotlight__btn hero-spotlight__btn--secondary"
            onClick={handleOpenModal}
            aria-label={`More info about ${title}`}
          >
            <Info size={18} />
            More Info
          </button>

          <button
            className={`hero-spotlight__btn hero-spotlight__btn--ghost ${isInWatchlist ? "hero-spotlight__btn--bookmarked" : ""}`}
            onClick={toggle}
            aria-label={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
          >
            {isInWatchlist ? (
              <BookmarkCheck size={18} />
            ) : (
              <Bookmark size={18} />
            )}
          </button>
        </div>

        {/* Dot indicators */}
        {items.length > 1 && (
          <div className="hero-spotlight__indicators" role="tablist" aria-label="Spotlight navigation">
            {items.slice(0, 8).map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`Go to spotlight ${i + 1}`}
                className={`hero-spotlight__dot ${i === activeIndex ? "hero-spotlight__dot--active" : ""}`}
                onClick={() => {
                  setIsTransitioning(true);
                  setTimeout(() => {
                    setActiveIndex(i);
                    setIsTransitioning(false);
                  }, 300);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default memo(HeroSpotlight);
