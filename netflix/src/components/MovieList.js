import React from "react";
import MovieRow from "./movie/MovieRow";

export default function MovieList({ title, movies }) {
  return <MovieRow title={title} movies={movies} />;
}