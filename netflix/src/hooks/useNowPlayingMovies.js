import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { moviesApi } from "../api/client";
import { setNowPlaying } from "../redux/movieSlice";

const useNowPlayingMovies = () => {
  const dispatch = useDispatch();
  const nowPlaying = useSelector((state) => state.movie.nowPlaying);

  useEffect(() => {
    if (nowPlaying?.length > 0) return;

    const fetchNowPlaying = async () => {
      try {
        const res = await moviesApi.getNowPlaying();
        if (res?.data) {
          dispatch(setNowPlaying(res.data));
        }
      } catch (err) {
        console.warn("Failed to load now playing:", err);
      }
    };

    fetchNowPlaying();
  }, [dispatch, nowPlaying?.length]);
};

export default useNowPlayingMovies;