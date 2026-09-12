/**
 * MediaRow.jsx
 * Horizontal smooth-scroll carousel with:
 *  - GPU-accelerated CSS scroll snapping
 *  - Directional prev/next chevron navigation
 *  - Shimmer skeleton fallback while loading
 *  - Title + optional "See All" link
 */

import React, { useRef, useState, useCallback, memo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "./MovieCard";

/**
 * @param {{
 *   title: string;
 *   items: unknown[];
 *   isLoading?: boolean;
 *   skeletonCount?: number;
 * }} props
 */
function MediaRow({ title, items = [], isLoading = false, skeletonCount = 6 }) {
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const syncScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  const scroll = useCallback((direction) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: direction === "right" ? amount : -amount, behavior: "smooth" });
    setTimeout(syncScrollState, 400);
  }, [syncScrollState]);

  const skeletons = Array.from({ length: skeletonCount });

  return (
    <section className="media-row" aria-label={title}>
      <div className="media-row__header">
        <h2 className="media-row__title">{title}</h2>
      </div>

      <div className="media-row__container">
        {/* Left chevron */}
        {canScrollLeft && (
          <button
            className="media-row__nav media-row__nav--left"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
          >
            <ChevronLeft size={22} strokeWidth={2.5} />
          </button>
        )}

        {/* Track */}
        <div
          ref={trackRef}
          className="media-row__track"
          onScroll={syncScrollState}
          style={{ scrollSnapType: "x mandatory" }}
        >
          {isLoading
            ? skeletons.map((_, i) => (
                <div
                  key={i}
                  className="media-row__skeleton"
                  style={{ scrollSnapAlign: "start" }}
                  aria-hidden="true"
                />
              ))
            : items.map((item) => (
                <div
                  key={`${item.id}-${item.media_type}`}
                  className="media-row__item"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <MovieCard media={item} />
                </div>
              ))}
        </div>

        {/* Right chevron */}
        {canScrollRight && items.length > 0 && (
          <button
            className="media-row__nav media-row__nav--right"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
          >
            <ChevronRight size={22} strokeWidth={2.5} />
          </button>
        )}
      </div>
    </section>
  );
}

export default memo(MediaRow);
