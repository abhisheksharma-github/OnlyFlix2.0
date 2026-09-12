import mongoose from "mongoose";

const watchlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    movieId: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    posterPath: {
      type: String,
      default: null,
    },
    backdropPath: {
      type: String,
      default: null,
    },
    overview: {
      type: String,
      default: "",
    },
    voteAverage: {
      type: Number,
      default: 0,
    },
    releaseDate: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Ensure user cannot add same movie multiple times
watchlistSchema.index({ userId: 1, movieId: 1 }, { unique: true });

export const Watchlist = mongoose.model("Watchlist", watchlistSchema);
