import React from "react";

export const MovieCardSkeleton = () => {
  return (
    <div
      className="flex-none w-36 sm:w-44 md:w-52 aspect-[2/3] rounded-2xl overflow-hidden bg-zinc-900/80 border border-white/5 relative"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 animate-pulse" />
      <div className="absolute bottom-4 left-3 right-3 space-y-2">
        <div className="h-3 w-3/4 bg-white/10 rounded-full" />
        <div className="h-2 w-1/2 bg-white/5 rounded-full" />
      </div>
    </div>
  );
};

export const MovieRowSkeleton = ({ title = "Curating Titles..." }) => {
  return (
    <div className="space-y-4 px-4 sm:px-8 md:px-12 py-5" aria-hidden="true">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-lg bg-white/10 animate-pulse" />
        <div className="h-6 w-52 rounded-xl bg-white/10 animate-pulse" />
      </div>
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
    <div
      className="relative w-full h-[80vh] min-h-[620px] max-h-[880px] bg-[#08080A] flex flex-col justify-end p-6 sm:p-12 md:p-20 overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/90 via-zinc-900/40 to-transparent animate-pulse" />
      <div className="relative z-10 max-w-2xl space-y-4">
        <div className="flex gap-2">
          <div className="h-6 w-28 rounded-full bg-white/15 animate-pulse" />
          <div className="h-6 w-16 rounded-xl bg-white/10 animate-pulse" />
        </div>
        <div className="h-12 sm:h-16 w-4/5 rounded-2xl bg-white/15 animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-full rounded-lg bg-white/10 animate-pulse" />
          <div className="h-4 w-3/4 rounded-lg bg-white/10 animate-pulse" />
        </div>
        <div className="flex gap-3 pt-4">
          <div className="h-12 w-40 rounded-2xl bg-white/20 animate-pulse" />
          <div className="h-12 w-36 rounded-2xl bg-white/10 animate-pulse" />
        </div>
      </div>
    </div>
  );
};
