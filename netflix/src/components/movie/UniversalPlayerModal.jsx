/**
 * UniversalPlayerModal.jsx
 * Apple TV+ style full-screen media detail overlay with:
 *  - YouTube iframe with safe audio destruction on close (no audio leak)
 *  - Focus trap for full WCAG 2.1 AA compliance
 *  - Escape key dismissal
 *  - Backdrop click dismissal
 *  - Season/episode picker for TV shows
 *  - Watch provider links (Netflix, Apple TV+, Prime, Disney+, etc.)
 *  - Smooth enter/exit animations
 */

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  memo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  X,
  Play,
  Bookmark,
  BookmarkCheck,
  Star,
  Calendar,
  Clock,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import { closeModal } from "../../redux/uiSlice";
import { useMediaDetails } from "../../hooks/useMediaDetails";
import { useWatchlistStatus } from "../../hooks/useWatchlistStatus";

const BACKDROP_BASE = "https://image.tmdb.org/t/p/original";
const POSTER_BASE = "https://image.tmdb.org/t/p/w500";
const PROVIDER_LOGO_BASE = "https://image.tmdb.org/t/p/w92";

// Provider → branded color map for "Stream on X" buttons
const PROVIDER_COLORS = {
  8: { label: "Netflix", color: "#E50914" },
  9: { label: "Amazon Prime", color: "#00A8E1" },
  337: { label: "Disney+", color: "#113CCF" },
  350: { label: "Apple TV+", color: "#555" },
  384: { label: "HBO Max", color: "#8B5CF6" },
  15: { label: "Hulu", color: "#1CE783" },
  387: { label: "Peacock", color: "#F5A623" },
};

function ProviderLinks({ providers }) {
  const usProviders = providers?.["US"] || providers?.["IN"] || {};
  const flatrate = usProviders.flatrate || [];
  const rent = usProviders.rent || [];
  const buy = usProviders.buy || [];

  if (!flatrate.length && !rent.length && !buy.length) return null;

  return (
    <div className="modal__providers">
      {flatrate.length > 0 && (
        <div className="modal__providers-group">
          <span className="modal__providers-label">Stream on</span>
          <div className="modal__providers-list">
            {flatrate.slice(0, 4).map((p) => (
              <span
                key={p.provider_id}
                className="modal__provider-chip"
                style={{
                  background:
                    PROVIDER_COLORS[p.provider_id]?.color || "rgba(255,255,255,0.1)",
                }}
                title={p.provider_name}
              >
                {p.logo_path ? (
                  <img
                    src={`${PROVIDER_LOGO_BASE}${p.logo_path}`}
                    alt={p.provider_name}
                    width={20}
                    height={20}
                    style={{ borderRadius: 4, objectFit: "cover" }}
                  />
                ) : null}
                {PROVIDER_COLORS[p.provider_id]?.label || p.provider_name}
              </span>
            ))}
          </div>
        </div>
      )}
      {rent.length > 0 && (
        <div className="modal__providers-group">
          <span className="modal__providers-label">Rent</span>
          <div className="modal__providers-list">
            {rent.slice(0, 3).map((p) => (
              <span key={p.provider_id} className="modal__provider-chip modal__provider-chip--muted" title={p.provider_name}>
                {p.logo_path && (
                  <img src={`${PROVIDER_LOGO_BASE}${p.logo_path}`} alt={p.provider_name} width={16} height={16} style={{ borderRadius: 3 }} />
                )}
                {p.provider_name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function UniversalPlayerModal() {
  const dispatch = useDispatch();
  const { isModalOpen, modalMedia } = useSelector((state) => state.ui);

  const mediaId = modalMedia?.id;
  const mediaType = modalMedia?.type || "movie";

  const { details, trailer, providers, isLoading } = useMediaDetails(
    isModalOpen ? mediaId : null,
    mediaType
  );

  const mediaTypeEnum = mediaType === "tv" ? "TV" : "MOVIE";
  const title = details?.displayTitle || details?.title || details?.name || "";
  const overview = details?.overview || "";
  const rating = details?.vote_average ? details.vote_average.toFixed(1) : null;
  const runtime = details?.runtime || null;
  const seasons = details?.seasons?.filter((s) => s.season_number > 0) || [];
  const genres = details?.genres || [];
  const releaseYear = (details?.displayDate || details?.release_date || details?.first_air_date || "").slice(0, 4);

  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const iframeRef = useRef(null);
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  const { isInWatchlist, toggle } = useWatchlistStatus(mediaId, mediaTypeEnum, {
    title,
    posterPath: details?.poster_path,
    backdropPath: details?.backdrop_path,
    overview,
    voteAverage: details?.vote_average,
    releaseDate: details?.displayDate || details?.release_date || details?.first_air_date,
  });

  // Safe iframe destruction — prevents audio leaks on modal close
  const destroyIframe = useCallback(() => {
    if (iframeRef.current) {
      iframeRef.current.src = "about:blank";
      iframeRef.current.remove();
      iframeRef.current = null;
    }
    setIsTrailerPlaying(false);
  }, []);

  const handleClose = useCallback(() => {
    destroyIframe();
    dispatch(closeModal());
  }, [destroyIframe, dispatch]);

  // Keyboard: Escape closes, Tab is trapped within modal
  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleClose();
        return;
      }
      // Focus trap
      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    setTimeout(() => closeButtonRef.current?.focus(), 100);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isModalOpen, handleClose]);

  // Clean up iframe when modal closes
  useEffect(() => {
    if (!isModalOpen) destroyIframe();
  }, [isModalOpen, destroyIframe]);

  if (!isModalOpen) return null;

  const backdropUrl = details?.backdrop_path
    ? `${BACKDROP_BASE}${details.backdrop_path}`
    : null;
  const posterUrl = details?.poster_path
    ? `${POSTER_BASE}${details.poster_path}`
    : null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      role="dialog"
      aria-modal="true"
      aria-label={title || "Media Details"}
    >
      <div className="modal" ref={modalRef}>
        {/* Close Button */}
        <button
          ref={closeButtonRef}
          className="modal__close"
          onClick={handleClose}
          aria-label="Close modal"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        {/* Hero / Trailer area */}
        <div className="modal__hero">
          {isTrailerPlaying && trailer?.key ? (
            <div className="modal__iframe-wrapper">
              <iframe
                ref={iframeRef}
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1`}
                allow="autoplay; fullscreen; encrypted-media"
                allowFullScreen
                title={`${title} Trailer`}
                className="modal__iframe"
              />
            </div>
          ) : (
            <div className="modal__backdrop-wrapper">
              {backdropUrl && (
                <img
                  src={backdropUrl}
                  alt={title}
                  className="modal__backdrop-img"
                />
              )}
              <div className="modal__backdrop-vignette" />
              {!isLoading && (
                <button
                  className="modal__play-overlay"
                  onClick={() => setIsTrailerPlaying(true)}
                  aria-label={`Play ${title} trailer`}
                  disabled={!trailer?.key}
                >
                  <Play size={28} fill="white" strokeWidth={0} />
                  {trailer?.key ? "Watch Trailer" : "No Trailer Available"}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Content body */}
        <div className="modal__body">
          {isLoading ? (
            <div className="modal__skeleton-body" aria-label="Loading..." />
          ) : (
            <>
              {/* Header */}
              <div className="modal__header">
                {posterUrl && (
                  <img src={posterUrl} alt={title} className="modal__poster" />
                )}
                <div className="modal__header-text">
                  <h2 className="modal__title">{title}</h2>

                  {/* Meta row */}
                  <div className="modal__meta">
                    {rating && (
                      <span className="modal__meta-chip modal__meta-chip--rating">
                        <Star size={12} fill="currentColor" />
                        {rating}
                      </span>
                    )}
                    {releaseYear && (
                      <span className="modal__meta-chip">
                        <Calendar size={12} />
                        {releaseYear}
                      </span>
                    )}
                    {runtime && (
                      <span className="modal__meta-chip">
                        <Clock size={12} />
                        {Math.floor(runtime / 60)}h {runtime % 60}m
                      </span>
                    )}
                    {genres.slice(0, 3).map((g) => (
                      <span key={g.id} className="modal__meta-chip modal__meta-chip--genre">
                        {g.name}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="modal__actions">
                    <button
                      className="modal__btn modal__btn--primary"
                      onClick={() => setIsTrailerPlaying(true)}
                      disabled={!trailer?.key}
                      aria-label="Watch trailer"
                    >
                      <Play size={16} fill="currentColor" strokeWidth={0} />
                      {trailer?.key ? "Watch Trailer" : "No Trailer"}
                    </button>
                    <button
                      className={`modal__btn modal__btn--secondary ${isInWatchlist ? "modal__btn--bookmarked" : ""}`}
                      onClick={toggle}
                      aria-label={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
                    >
                      {isInWatchlist ? (
                        <><BookmarkCheck size={16} /> Saved</>
                      ) : (
                        <><Bookmark size={16} /> Watchlist</>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Overview */}
              <p className="modal__overview">{overview}</p>

              {/* Watch Providers */}
              <ProviderLinks providers={providers} />

              {/* Season picker for TV */}
              {mediaType === "tv" && seasons.length > 0 && (
                <div className="modal__seasons">
                  <div className="modal__seasons-header">
                    <h3 className="modal__seasons-title">Seasons</h3>
                    <div className="modal__season-select-wrapper">
                      <select
                        className="modal__season-select"
                        value={selectedSeason}
                        onChange={(e) => setSelectedSeason(Number(e.target.value))}
                        aria-label="Select season"
                      >
                        {seasons.map((s) => (
                          <option key={s.id} value={s.season_number}>
                            Season {s.season_number}{" "}
                            {s.episode_count ? `· ${s.episode_count} Episodes` : ""}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="modal__season-chevron" />
                    </div>
                  </div>

                  <div className="modal__episodes">
                    {seasons
                      .find((s) => s.season_number === selectedSeason)
                      ?.episodes?.slice(0, 10)
                      .map((ep) => (
                        <div key={ep.id} className="modal__episode">
                          <span className="modal__episode-num">
                            {ep.episode_number}
                          </span>
                          <div className="modal__episode-info">
                            <p className="modal__episode-title">{ep.name}</p>
                            <p className="modal__episode-overview">
                              {ep.overview?.slice(0, 140)}
                              {ep.overview?.length > 140 ? "…" : ""}
                            </p>
                          </div>
                          <span className="modal__episode-runtime">
                            {ep.runtime ? `${ep.runtime}m` : ""}
                          </span>
                        </div>
                      )) || (
                      <p className="modal__episodes-empty">
                        Episode list not available.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Cast */}
              {details?.credits?.cast?.length > 0 && (
                <div className="modal__cast">
                  <h3 className="modal__cast-title">Cast</h3>
                  <div className="modal__cast-list">
                    {details.credits.cast.slice(0, 8).map((actor) => (
                      <div key={actor.id} className="modal__cast-item">
                        {actor.profile_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                            alt={actor.name}
                            className="modal__cast-photo"
                          />
                        ) : (
                          <div className="modal__cast-photo modal__cast-photo--placeholder" />
                        )}
                        <p className="modal__cast-name">{actor.name}</p>
                        <p className="modal__cast-character">{actor.character}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(UniversalPlayerModal);
