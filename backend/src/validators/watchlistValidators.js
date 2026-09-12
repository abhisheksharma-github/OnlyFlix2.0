import { z } from "zod";

export const addToWatchlistSchema = z.object({
  movieId: z.number({ required_error: "Movie ID is required" }),
  title: z.string({ required_error: "Movie title is required" }).min(1),
  posterPath: z.string().nullable().optional(),
  backdropPath: z.string().nullable().optional(),
  overview: z.string().optional().default(""),
  voteAverage: z.number().optional().default(0),
  releaseDate: z.string().optional().default(""),
});

export const historySchema = z.object({
  movieId: z.number({ required_error: "Movie ID is required" }),
  title: z.string({ required_error: "Movie title is required" }).min(1),
  posterPath: z.string().nullable().optional(),
  backdropPath: z.string().nullable().optional(),
  progressSeconds: z.number().nonnegative().default(0),
  durationSeconds: z.number().nonnegative().default(0),
});
