import React from "react";
import { useSelector } from "react-redux";
import { Flame, Star, Clock, Sparkles, Film } from "lucide-react";
import MovieRow from "./movie/MovieRow";

export const MovieContainer = () => {
  const { nowPlaying, popular, topRated, upcoming, trending, isLoadingMovies } = useSelector(
    (state) => state.movie
  );
  const { activeTab } = useSelector((state) => state.ui);

  return (
    <div className="relative z-20 pb-20 -mt-12 sm:-mt-24 space-y-4 sm:space-y-8 animate-fade-in">
      {/* Dynamic Tab Prioritization */}
      {activeTab === "popular" ? (
        <>
          {popular?.length > 0 && (
            <MovieRow
              title="Popular Worldwide"
              icon={Sparkles}
              movies={popular}
              isLoading={isLoadingMovies}
            />
          )}
          {trending?.length > 0 && (
            <MovieRow
              title="Trending Today"
              icon={Flame}
              movies={trending}
              isLoading={isLoadingMovies}
            />
          )}
        </>
      ) : activeTab === "top-rated" ? (
        <>
          {topRated?.length > 0 && (
            <MovieRow
              title="Top Rated Masterpieces"
              icon={Star}
              movies={topRated}
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
        </>
      ) : activeTab === "upcoming" ? (
        <>
          {upcoming?.length > 0 && (
            <MovieRow
              title="Upcoming Releases"
              icon={Clock}
              movies={upcoming}
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
        </>
      ) : (
        /* Home Default Feed */
        <>
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
        </>
      )}
    </div>
  );
};

export default MovieContainer;