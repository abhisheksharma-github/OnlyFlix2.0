import React from "react";
import { useSelector } from "react-redux";
import useMovieById from "../hooks/useMovieById";

export const VideoBackground = ({ movieId, bool }) => {
  const trailerKey = useSelector((state) => state.movie.trailerKey);
  useMovieById(movieId);

  if (!trailerKey) return null;

  return (
    <div className="w-full overflow-hidden aspect-video rounded-xl">
      <iframe
        className="w-full h-full"
        src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&mute=1&controls=1`}
        title="Movie Trailer"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default VideoBackground;