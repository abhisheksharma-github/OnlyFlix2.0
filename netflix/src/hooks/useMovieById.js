import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { moviesApi } from "../api/client";
import { setTrailerKey, setLoadingTrailer } from "../redux/movieSlice";

export const useMovieById = (movieId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!movieId) return;

    let isMounted = true;

    const fetchTrailer = async () => {
      try {
        dispatch(setLoadingTrailer(true));
        const res = await moviesApi.getVideos(movieId);
        if (isMounted && res?.data?.key) {
          dispatch(setTrailerKey(res.data.key));
        }
      } catch (err) {
        console.warn("Failed to fetch trailer:", err);
      } finally {
        if (isMounted) {
          dispatch(setLoadingTrailer(false));
        }
      }
    };

    fetchTrailer();

    return () => {
      isMounted = false;
    };
  }, [movieId, dispatch]);
};

export default useMovieById;