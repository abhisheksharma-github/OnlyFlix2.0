/**
 * @file netflix/src/hooks/useMediaDetails.js
 * @description Fetches full media details, trailer, and watch providers
 * for a given TMDB ID + type. Handles loading, error, and stale-while-revalidate.
 */

import { useState, useEffect, useRef } from "react";
import { moviesApi } from "../api/client";

/**
 * @param {number | string | null} mediaId
 * @param {"movie" | "tv"} mediaType
 * @returns {{
 *   details: unknown | null;
 *   trailer: unknown | null;
 *   providers: unknown | null;
 *   isLoading: boolean;
 *   error: string | null;
 * }}
 */
export function useMediaDetails(mediaId, mediaType = "movie") {
  const [details, setDetails] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [providers, setProviders] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Abort controller ref to cancel stale requests
  const abortRef = useRef(null);

  useEffect(() => {
    if (!mediaId) {
      setDetails(null);
      setTrailer(null);
      setProviders(null);
      return;
    }

    // Cancel any in-flight fetch from a previous render
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    setError(null);

    Promise.all([
      moviesApi.getDetails(mediaId, mediaType),
      moviesApi.getTrailer(mediaId, mediaType),
      moviesApi.getProviders(mediaId, mediaType),
    ])
      .then(([detailsRes, trailerRes, providersRes]) => {
        if (controller.signal.aborted) return;
        setDetails(detailsRes.data);
        setTrailer(trailerRes.data);
        setProviders(providersRes.data);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setError(err.message || "Failed to load media details.");
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [mediaId, mediaType]);

  return { details, trailer, providers, isLoading, error };
}
