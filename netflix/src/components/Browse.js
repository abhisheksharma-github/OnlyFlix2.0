import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useMovies } from "../hooks/useMovies";
import Navbar from "./common/Navbar";
import HeroSpotlight from "./movie/HeroSpotlight";
import MovieContainer from "./MovieContainer";
import SearchMovie from "./search/SearchMovie";
import WatchlistView from "./watchlist/WatchlistView";
import MovieDetailModal from "./common/MovieDetailModal";
import Footer from "./common/Footer";
import { Film } from "lucide-react";

export const Browse = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isCheckingAuth } = useAuth();
  const { activeTab } = useSelector((state) => state.ui);

  // Initialize movie catalog
  useMovies();

  useEffect(() => {
    if (!isCheckingAuth && !isAuthenticated) {
      navigate("/");
    }
  }, [isCheckingAuth, isAuthenticated, navigate]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-canvas-base flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-brand flex items-center justify-center animate-pulse shadow-glow-lg">
          <Film className="w-6 h-6 text-white" />
        </div>
        <p className="text-xs text-zinc-400 font-medium tracking-wide">
          Loading OnlyFlix Experience...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas-base text-zinc-100 flex flex-col justify-between selection:bg-brand selection:text-white">
      {/* Fixed Glass Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow">
        {activeTab === "search" && <SearchMovie />}
        {activeTab === "watchlist" && <WatchlistView />}
        {activeTab !== "search" && activeTab !== "watchlist" && (
          <>
            <HeroSpotlight />
            <MovieContainer />
          </>
        )}
      </main>

      {/* Global Cinematic Movie Trailer / Details Modal */}
      <MovieDetailModal />

      {/* Editorial Footer */}
      <Footer />
    </div>
  );
};

export default Browse;