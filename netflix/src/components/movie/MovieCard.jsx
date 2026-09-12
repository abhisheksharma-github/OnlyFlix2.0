/**
 * MovieCard.jsx
 * Aspect-ratio locked, hardware-accelerated media card with:
 *  - CSS contain: paint layout for carousel performance (60fps)
 *  - Media type badge (Movie / TV / 4K)
 *  - Instant O(1) bookmark toggle via useWatchlistStatus
 *  - Hover reveal with rating, overview excerpt, and actions
 */

import React, { useState, useCallback, memo } from "react";
import { useDispatch } from "react-redux";
import { Bookmark, BookmarkCheck, Play, Star, Tv, Film, Info } from "lucide-react";
import { openModal } from "../../redux/uiSlice";
import { useWatchlistStatus } from "../../hooks/useWatchlistStatus";

const POSTER_BASE = "https://image.tmdb.org/t/p/w500";
const FALLBACK_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='450' viewBox='0 0 300 450'%3E%3Crect width='300' height='450' fill='%2312131A'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='14' fill='%23555' text-anchor='middle' dy='.3em'%3ENo Poster%3C/text%3E%3C/svg%3E";

/**
 * @param {{
 *   media: {
 *     id: number;
 *     displayTitle?: string;
 *     title?: string;
 *     name?: string;
 *     poster_path?: string;
 *     backdrop_path?: string;
 *     vote_average?: number;
 *     overview?: string;
 *     release_date?: string;
 *     first_air_date?: string;
 *     displayDate?: string;
 *     media_type?: string;
 *   };
 * }} props
 */
function MovieCard({ media }) {
  const dispatch = useDispatch();
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const mediaType = media.media_type === "tv" ? "TV" : "MOVIE";
  const title = media.displayTitle || media.title || media.name || "Unknown";
  const rating = media.vote_average ? media.vote_average.toFixed(1) : null;
  const year = (media.displayDate || media.release_date || media.first_air_date || "").slice(0, 4);
  const posterSrc = !imgError && media.poster_path
    ? `${POSTER_BASE}${media.poster_path}`
    : FALLBACK_IMG;

  const { isInWatchlist, toggle, isMutating } = useWatchlistStatus(
    media.id,
    mediaType,
    {
      title,
      posterPath: media.poster_path,
      backdropPath: media.backdrop_path,
      overview: media.overview,
      voteAverage: media.vote_average,
      releaseDate: media.displayDate || media.release_date || media.first_air_date,
    }
  );

  const handleCardClick = useCallback(() => {
    dispatch(openModal({ id: media.id, type: media.media_type || "movie" }));
  }, [dispatch, media.id, media.media_type]);

  const handleBookmark = useCallback(
    (e) => {
      e.stopPropagation();
      toggle();
    },
    [toggle]
  );

  return (
    <article
      className="movie-card"
      style={{ contain: "paint layout", willChange: "transform" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleCardClick()}
      aria-label={`View details for ${title}`}
    >
      {/* Poster */}
      <div className="movie-card__poster">
        <img
          src={posterSrc}
          alt={title}
          loading="lazy"
          onError={() => setImgError(true)}
          className="movie-card__img"
        />

        {/* Gradient overlay on hover */}
        <div
          className="movie-card__overlay"
          style={{ opacity: isHovered ? 1 : 0 }}
        />

        {/* Media type badge */}
        <span className="movie-card__badge">
          {media.media_type === "tv" ? (
            <><Tv size={9} /> TV</>
          ) : (
            <><Film size={9} /> Movie</>
          )}
        </span>

        {/* Rating chip */}
        {rating && (
          <span className="movie-card__rating">
            <Star size={9} fill="currentColor" />
            {rating}
          </span>
        )}

        {/* Bookmark button */}
        <button
          className={`movie-card__bookmark ${isInWatchlist ? "movie-card__bookmark--active" : ""}`}
          onClick={handleBookmark}
          disabled={isMutating}
          aria-label={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
          title={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
        >
          {isInWatchlist ? (
            <BookmarkCheck size={15} strokeWidth={2.5} />
          ) : (
            <Bookmark size={15} strokeWidth={2.5} />
          )}
        </button>

        {/* Hover actions */}
        <div
          className="movie-card__actions"
          style={{
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? "translateY(0)" : "translateY(6px)",
          }}
        >
          <button className="movie-card__play" aria-label={`Play ${title}`}>
            <Play size={13} fill="currentColor" strokeWidth={0} />
            Play
          </button>
          <button
            className="movie-card__info"
            onClick={handleCardClick}
            aria-label={`More info about ${title}`}
          >
            <Info size={13} />
          </button>
        </div>
      </div>

      {/* Card footer */}
      <div className="movie-card__footer">
        <p className="movie-card__title" title={title}>{title}</p>
        {year && <span className="movie-card__year">{year}</span>}
      </div>
    </article>
  );
}

export default memo(MovieCard);
