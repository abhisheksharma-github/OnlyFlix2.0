import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { moviesApi } from "../api/client";
import { setUpcoming } from "../redux/movieSlice";

const useUpcomingMovies = () => {
  const dispatch = useDispatch();
  const upcoming = useSelector((state) => state.movie.upcoming);

  useEffect(() => {
    if (upcoming?.length > 0) return;

    const fetchUpcoming = async () => {
      try {
        const res = await moviesApi.getUpcoming();
        if (res?.data) {
          dispatch(setUpcoming(res.data));
        }
      } catch (err) {
        console.warn("Failed to load upcoming movies:", err);
      }
    };

    fetchUpcoming();
  }, [dispatch, upcoming?.length]);
};

export default useUpcomingMovies;