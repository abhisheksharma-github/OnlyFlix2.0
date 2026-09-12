import React from "react";
import { Play, Info } from "lucide-react";

export const VideoTitle = ({ title, overview, onPlay, onInfo }) => {
  return (
    <div className="absolute z-10 text-white p-6 sm:p-12 max-w-xl space-y-4">
      <h1 className="text-3xl sm:text-5xl font-black tracking-tight">{title}</h1>
      <p className="text-zinc-300 text-sm sm:text-base line-clamp-3 leading-relaxed">
        {overview}
      </p>
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={onPlay}
          className="flex items-center gap-2 px-6 py-2.5 bg-brand hover:bg-brand-hover text-white rounded-xl font-bold text-sm shadow-glow-sm transition-all"
        >
          <Play size={16} className="fill-white" />
          <span>Play</span>
        </button>
        <button
          onClick={onInfo}
          className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold text-sm border border-white/10 transition-colors"
        >
          <Info size={16} />
          <span>More Info</span>
        </button>
      </div>
    </div>
  );
};

export default VideoTitle;