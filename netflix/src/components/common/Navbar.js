import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  X,
  Bookmark,
  LogOut,
  ChevronDown,
  Film,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { setActiveTab, toggleSearch, setSearchQuery, setIsSearching, setSearchResults } from "../../redux/uiSlice";
import { moviesApi } from "../../api/client";

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
          ? "bg-[#08080A]/90 backdrop-blur-md border-b border-white/10 shadow-lg py-3"
          : "bg-gradient-to-b from-black/90 via-black/40 to-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between gap-4">
        {/* Left: Brand & Navigation */}
        <div className="flex items-center gap-8">
          <Link
            to={isAuthenticated ? "/browse" : "/"}
            onClick={() => handleTabClick("home")}
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand to-rose-700 flex items-center justify-center shadow-glow-sm group-hover:scale-105 transition-transform duration-200">
              <Film className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-tighter text-white font-sans">
              ONLY<span className="text-brand">FLIX</span>
            </span>
          </Link>

          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => handleTabClick("home")}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "home"
                    ? "text-white bg-white/10 shadow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Home
              </button>
              <button
                onClick={() => handleTabClick("popular")}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "popular"
                    ? "text-white bg-white/10 shadow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Popular
              </button>
              <button
                onClick={() => handleTabClick("top-rated")}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "top-rated"
                    ? "text-white bg-white/10 shadow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Top Rated
              </button>
              <button
                onClick={() => handleTabClick("upcoming")}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "upcoming"
                    ? "text-white bg-white/10 shadow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => handleTabClick("watchlist")}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
                  activeTab === "watchlist"
                    ? "text-white bg-white/10 shadow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Bookmark size={15} />
                <span>My List</span>
                {watchlistCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[11px] font-bold bg-brand text-white">
                    {watchlistCount}
                  </span>
                )}
              </button>
            </nav>
          )}
        </div>

        {/* Right: Search Bar & Profile / Auth */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {/* Search Bar */}
              <form
                onSubmit={handleSearchSubmit}
                className={`relative flex items-center transition-all duration-300 ${
                  isSearchOpen
                    ? "w-48 sm:w-72 bg-zinc-900/90 border border-white/20 rounded-full pl-3 pr-2 py-1.5 shadow-lg"
                    : "w-9 h-9"
                }`}
              >
                {isSearchOpen ? (
                  <>
                    <Search size={16} className="text-zinc-400 mr-2 flex-shrink-0" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search titles, actors, genres..."
                      value={searchQuery}
                      onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                      className="w-full bg-transparent text-sm text-white placeholder-zinc-500 outline-none"
                      autoFocus
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => dispatch(setSearchQuery(""))}
                        className="p-1 hover:text-white text-zinc-400"
                      >
                        <X size={14} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => dispatch(toggleSearch())}
                      className="p-1 text-zinc-400 hover:text-white ml-1"
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => dispatch(toggleSearch())}
                    className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-300 hover:text-white border border-white/10 transition-colors"
                    aria-label="Open search"
                  >
                    <Search size={17} />
                  </button>
                )}
              </form>

              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  <img
                    src={
                      user?.avatar ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80"
                    }
                    alt={user?.fullName || "User avatar"}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-brand/50"
                  />
                  <span className="hidden sm:inline text-xs font-semibold text-zinc-200 max-w-[100px] truncate">
                    {user?.fullName?.split(" ")[0]}
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
                  <div className="absolute right-0 mt-3 w-56 glass-dropdown rounded-2xl p-2 z-50 animate-scale-in">
                    <div className="px-3 py-2.5 border-b border-white/10">
                      <p className="text-xs text-zinc-400 font-medium">Signed in as</p>
                      <p className="text-sm font-bold text-white truncate">{user?.fullName}</p>
                      <p className="text-xs text-zinc-400 truncate">{user?.email}</p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          handleTabClick("watchlist");
                          setIsDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors text-left"
                      >
                        <Bookmark size={16} className="text-brand" />
                        <span>My Watchlist ({watchlistCount})</span>
                      </button>
                    </div>

                    <div className="pt-1 border-t border-white/10">
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors text-left"
                      >
                        <LogOut size={16} />
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
              className="px-5 py-2 rounded-xl text-sm font-bold bg-brand hover:bg-brand-hover text-white shadow-glow-sm hover:shadow-glow-lg transition-all duration-200"
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
