import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  X,
  Bookmark,
  LogOut,
  ChevronDown,
  Sparkles,
  Flame,
  Star,
  Clock,
  Home,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import {
  setActiveTab,
  toggleSearch,
  setSearchQuery,
  setIsSearching,
  setSearchResults,
} from "../../redux/uiSlice";
import { moviesApi } from "../../api/client";
import OnlyFlixLogo from "./OnlyFlixLogo";

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isSearchOpen, searchQuery, activeTab } = useSelector((state) => state.ui);
  const watchlistCount = useSelector((state) => state.watchlist.items.length);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Scroll detection for navbar blur transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = async (e) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;

    if (location.pathname !== "/browse") {
      navigate("/browse");
    }
    dispatch(setActiveTab("search"));
    dispatch(setIsSearching(true));

    try {
      const res = await moviesApi.search(searchQuery.trim());
      dispatch(setSearchResults(res.data || []));
    } catch (err) {
      console.warn("Search failed:", err);
      dispatch(setSearchResults([]));
    } finally {
      dispatch(setIsSearching(false));
    }
  };

  const handleTabClick = (tab) => {
    dispatch(setActiveTab(tab));
    if (location.pathname !== "/browse") {
      navigate("/browse");
    }
    if (tab !== "search") {
      dispatch(setSearchQuery(""));
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-[#08080A]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/80 py-3"
          : "bg-gradient-to-b from-[#08080A]/95 via-[#08080A]/60 to-transparent py-4 sm:py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between gap-4">
        {/* Left: Brand & Navigation */}
        <div className="flex items-center gap-8">
          <Link
            to={isAuthenticated ? "/browse" : "/"}
            onClick={() => handleTabClick("home")}
            className="flex items-center group cursor-pointer"
          >
            <OnlyFlixLogo size="default" />
          </Link>

          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1.5 bg-white/5 border border-white/10 p-1 rounded-2xl backdrop-blur-md">
              <button
                onClick={() => handleTabClick("home")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === "home"
                    ? "text-white bg-brand shadow-glow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Home size={14} />
                <span>Home</span>
              </button>

              <button
                onClick={() => handleTabClick("popular")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === "popular"
                    ? "text-white bg-brand shadow-glow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Sparkles size={14} />
                <span>Popular</span>
              </button>

              <button
                onClick={() => handleTabClick("top-rated")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === "top-rated"
                    ? "text-white bg-brand shadow-glow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Star size={14} />
                <span>Top Rated</span>
              </button>

              <button
                onClick={() => handleTabClick("upcoming")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === "upcoming"
                    ? "text-white bg-brand shadow-glow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Clock size={14} />
                <span>Upcoming</span>
              </button>

              <button
                onClick={() => handleTabClick("watchlist")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === "watchlist"
                    ? "text-white bg-brand shadow-glow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Bookmark size={14} />
                <span>Watchlist</span>
                {watchlistCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-white text-black ml-0.5">
                    {watchlistCount}
                  </span>
                )}
              </button>
            </nav>
          )}
        </div>

        {/* Right: Search & Profile */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {/* Search Bar */}
              <form
                onSubmit={handleSearchSubmit}
                className={`relative flex items-center transition-all duration-300 ${
                  isSearchOpen
                    ? "w-52 sm:w-80 bg-zinc-900/95 border border-brand/50 rounded-2xl pl-3.5 pr-2 py-1.5 shadow-2xl shadow-black/80"
                    : "w-10 h-10"
                }`}
              >
                {isSearchOpen ? (
                  <>
                    <Search size={16} className="text-brand mr-2.5 flex-shrink-0" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search movies, actors, trailers..."
                      value={searchQuery}
                      onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                      className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-zinc-500 outline-none"
                      autoFocus
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => dispatch(setSearchQuery(""))}
                        className="p-1 hover:text-white text-zinc-400 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => dispatch(toggleSearch())}
                      className="p-1 text-zinc-400 hover:text-white ml-1 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => dispatch(toggleSearch())}
                    className="w-10 h-10 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-300 hover:text-white border border-white/10 transition-colors"
                    aria-label="Open search"
                  >
                    <Search size={18} />
                  </button>
                )}
              </form>

              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-2.5 pr-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200"
                >
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-brand to-rose-600 flex items-center justify-center text-xs font-black text-white shadow-glow-sm">
                    {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="hidden sm:inline text-xs font-semibold text-zinc-200 max-w-[110px] truncate">
                    {user?.fullName?.split(" ")[0] || "Cinephile"}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-zinc-400 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-60 bg-[#12131A]/95 backdrop-blur-2xl border border-white/15 rounded-2xl p-2.5 z-50 shadow-2xl shadow-black animate-scale-in">
                    <div className="px-3 py-2.5 border-b border-white/10 mb-1">
                      <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                        Active Account
                      </p>
                      <p className="text-sm font-bold text-white truncate">{user?.fullName || "OnlyFlix User"}</p>
                      <p className="text-xs text-zinc-400 truncate">{user?.email || "demo@onlyflix.com"}</p>
                    </div>

                    <div className="py-1 space-y-1">
                      <button
                        onClick={() => {
                          handleTabClick("watchlist");
                          setIsDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors text-left"
                      >
                        <div className="flex items-center gap-2.5">
                          <Bookmark size={15} className="text-brand" />
                          <span>My Watchlist</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-zinc-300">
                          {watchlistCount}
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          handleTabClick("search");
                          setIsDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors text-left"
                      >
                        <Flame size={15} className="text-amber-400" />
                        <span>Discover Catalog</span>
                      </button>
                    </div>

                    <div className="pt-1.5 border-t border-white/10">
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors text-left"
                      >
                        <LogOut size={15} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link
              to="/"
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-brand hover:bg-brand-hover text-white shadow-glow-sm hover:shadow-glow-lg transition-all duration-200"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
