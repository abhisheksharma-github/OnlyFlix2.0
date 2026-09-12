import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { moviesApi } from "../api/client";
import { setPopular } from "../redux/movieSlice";

const usePopularMovies = () => {
  const dispatch = useDispatch();
  const popular = useSelector((state) => state.movie.popular);

  useEffect(() => {
    if (popular?.length > 0) return;

    const fetchPopular = async () => {
      try {
        const res = await moviesApi.getPopular();
        if (res?.data) {
          dispatch(setPopular(res.data));
        }
      } catch (err) {
        console.warn("Failed to load popular movies:", err);
      }
    };

    fetchPopular();
  }, [dispatch, popular?.length]);
};

export default usePopularMovies;