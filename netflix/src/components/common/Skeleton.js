import React from "react";

export const MovieCardSkeleton = () => {
  return (
    <div className="flex-none w-36 sm:w-44 md:w-52 aspect-[2/3] rounded-xl overflow-hidden skeleton-shimmer border border-white/5" />
  );
};

export const MovieRowSkeleton = ({ title = "Loading Collection..." }) => {
  return (
    <div className="space-y-3 px-4 sm:px-8 md:px-12 py-4">
      <div className="h-6 w-48 rounded-md skeleton-shimmer" />
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

export const HeroSkeleton = () => {
  return (
    <div className="relative w-full h-[70vh] min-h-[550px] skeleton-shimmer flex flex-col justify-end p-8 md:p-16 border-b border-white/5">
      <div className="max-w-2xl space-y-4">
        <div className="h-10 w-3/4 rounded-lg bg-white/10" />
        <div className="h-4 w-full rounded bg-white/5" />
        <div className="h-4 w-2/3 rounded bg-white/5" />
        <div className="flex gap-3 pt-4">
          <div className="h-11 w-32 rounded-lg bg-white/15" />
          <div className="h-11 w-36 rounded-lg bg-white/10" />
        </div>
      </div>
    </div>
  );
};
