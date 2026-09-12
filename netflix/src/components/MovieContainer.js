import React from "react";
import { useSelector } from "react-redux";
import { Flame, Star, Clock, Sparkles, Film } from "lucide-react";
import MovieRow from "./movie/MovieRow";

export const MovieContainer = () => {
  const { nowPlaying, popular, topRated, upcoming, trending, isLoadingMovies } = useSelector(
    (state) => state.movie
  );

  return (
    <div className="relative z-20 pb-20 -mt-12 sm:-mt-20 space-y-2 sm:space-y-4">
      {trending?.length > 0 && (
        <MovieRow
          title="Trending Today"
          icon={Flame}
          movies={trending}
          isLoading={isLoadingMovies}
        />
      )}

      {nowPlaying?.length > 0 && (
        <MovieRow
          title="Now Playing in Theaters"
          icon={Film}
          movies={nowPlaying}
          isLoading={isLoadingMovies}
        />
      )}

      {popular?.length > 0 && (
        <MovieRow
          title="Popular Worldwide"
          icon={Sparkles}
          movies={popular}
          isLoading={isLoadingMovies}
        />
      )}

      {topRated?.length > 0 && (
        <MovieRow
          title="Top Rated Masterpieces"
          icon={Star}
          movies={topRated}
          isLoading={isLoadingMovies}
        />
      )}

      {upcoming?.length > 0 && (
        <MovieRow
          title="Upcoming Releases"
          icon={Clock}
          movies={upcoming}
          isLoading={isLoadingMovies}
        />
      )}
    </div>
  );
};

export default MovieContainer;