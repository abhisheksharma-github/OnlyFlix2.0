import React from "react";
import { Film } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[#060608] py-12 px-4 sm:px-8 text-zinc-400 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-brand flex items-center justify-center">
            <Film className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-extrabold text-white tracking-tight">ONLYFLIX</span>
          <span className="text-zinc-400">© {new Date().getFullYear()} • Premium Streaming</span>
        </div>

        <div className="flex items-center gap-6 text-zinc-400">
          <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
          <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
          <span className="hover:text-white transition-colors cursor-pointer">API Proxy</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
