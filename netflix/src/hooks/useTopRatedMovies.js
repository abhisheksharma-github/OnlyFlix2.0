import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { moviesApi } from "../api/client";
import { setTopRated } from "../redux/movieSlice";

const useTopRatedMovies = () => {
  const dispatch = useDispatch();
  const topRated = useSelector((state) => state.movie.topRated);

  useEffect(() => {
    if (topRated?.length > 0) return;

    const fetchTopRated = async () => {
      try {
        const res = await moviesApi.getTopRated();
        if (res?.data) {
          dispatch(setTopRated(res.data));
        }
      } catch (err) {
        console.warn("Failed to load top rated movies:", err);
      }
    };

    fetchTopRated();
  }, [dispatch, topRated?.length]);
};

export default useTopRatedMovies;