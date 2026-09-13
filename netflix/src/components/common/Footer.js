import React from "react";
import OnlyFlixLogo from "./OnlyFlixLogo";

export const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[#060608] py-12 px-4 sm:px-8 text-zinc-400 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <OnlyFlixLogo size="small" showBadge={false} />
          <span className="text-zinc-500 hidden sm:inline">•</span>
          <span className="text-zinc-400 text-xs">
            © {new Date().getFullYear()} OnlyFlix 2.0. Premier 4K Cinema & Trailers.
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs text-zinc-400">
          <span className="hover:text-white transition-colors cursor-pointer">Explore Catalog</span>
          <span className="hover:text-white transition-colors cursor-pointer">TMDB Metadata</span>
          <span className="hover:text-white transition-colors cursor-pointer">Watchlist Sync</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
