import React from "react";
import { Film, Sparkles } from "lucide-react";

export const OnlyFlixLogo = ({ size = "default", showBadge = true, className = "" }) => {
  const isLarge = size === "large";
  const isSmall = size === "small";

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Glowing Emblem Icon */}
      <div
        className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-brand via-rose-600 to-red-700 shadow-glow-sm transition-transform duration-300 group-hover:scale-105 ${
          isLarge
            ? "w-12 h-12 rounded-2xl shadow-glow-lg"
            : isSmall
            ? "w-7 h-7 rounded-lg"
            : "w-9 h-9 rounded-xl"
        }`}
      >
        <Film
          className={`text-white ${
            isLarge ? "w-6 h-6" : isSmall ? "w-4 h-4" : "w-5 h-5"
          }`}
        />
        <div className="absolute -top-1 -right-1">
          <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
        </div>
      </div>

      {/* Brand Typography */}
      <div className="flex items-baseline gap-1.5">
        <span
          className={`font-black tracking-tighter text-white font-sans ${
            isLarge
              ? "text-3xl sm:text-4xl"
              : isSmall
              ? "text-lg"
              : "text-2xl"
          }`}
        >
          ONLY<span className="text-brand bg-gradient-to-r from-red-500 via-rose-500 to-red-600 bg-clip-text text-transparent">FLIX</span>
        </span>

        {showBadge && (
          <span
            className={`font-mono font-bold uppercase tracking-widest text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 border border-white/10 backdrop-blur-sm ${
              isSmall ? "hidden" : "inline-block"
            }`}
          >
            2.0
          </span>
        )}
      </div>
    </div>
  );
};

export default OnlyFlixLogo;
