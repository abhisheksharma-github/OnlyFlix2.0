import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clapperboard,
  Tv,
  Film,
  Zap,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import OnlyFlixLogo from "../common/OnlyFlixLogo";

export const Login = () => {
  const navigate = useNavigate();
  const { login, register, isAuthenticated, isLoading } = useAuth();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/browse");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!email || !password) {
      setFormError("Please fill in all required fields.");
      return;
    }

    if (!isLoginMode && !fullName) {
      setFormError("Please enter your full name.");
      return;
    }

    if (password.length < 6) {
      setFormError("Password must be at least 6 characters long.");
      return;
    }

    if (isLoginMode) {
      await login({ email, password });
    } else {
      await register({ fullName, email, password });
    }
  };

  // 1-Click Instant Demo Login with intelligent auto-creation fallback
  const handleQuickDemo = async () => {
    setIsDemoLoading(true);
    setFormError("");
    const demoEmail = "demo@onlyflix.com";
    const demoPassword = "password123";

    setEmail(demoEmail);
    setPassword(demoPassword);

    try {
      // 1. Try to login
      const success = await login({ email: demoEmail, password: demoPassword });
      if (!success) {
        // 2. If login fails (user might not exist on backend yet), automatically register the demo user
        const regSuccess = await register({
          fullName: "Demo Cinephile",
          email: demoEmail,
          password: demoPassword,
        });

        if (!regSuccess) {
          // If network error/backend asleep, redirect to browse
          navigate("/browse");
        }
      }
    } catch {
      navigate("/browse");
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-[#08080A]">
      {/* Dynamic Ambient Glow Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-[400px] h-[400px] bg-rose-700/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-10 -left-20 w-[400px] h-[400px] bg-indigo-900/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Cinematic Grid Backdrop */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080A] via-[#08080A]/80 to-transparent" />
      </div>

      {/* Floating Category Badges Background (Decorative) */}
      <div className="hidden lg:flex absolute inset-0 items-center justify-between px-16 pointer-events-none opacity-40 z-0">
        <div className="space-y-6 -rotate-6">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-zinc-300">
            <Film className="text-brand w-5 h-5" />
            <span className="text-xs font-semibold">4K Ultra HD Streaming</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-zinc-300">
            <Clapperboard className="text-amber-400 w-5 h-5" />
            <span className="text-xs font-semibold">Official TMDB Trailers</span>
          </div>
        </div>

        <div className="space-y-6 rotate-6">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-zinc-300">
            <Tv className="text-indigo-400 w-5 h-5" />
            <span className="text-xs font-semibold">Personalized Watchlists</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-zinc-300">
            <ShieldCheck className="text-emerald-400 w-5 h-5" />
            <span className="text-xs font-semibold">Secure Cloud Sync</span>
          </div>
        </div>
      </div>

      {/* Main Glassmorphic Auth Card */}
      <div className="relative z-10 w-full max-w-md bg-[#12131A]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-9 shadow-2xl shadow-black/80 animate-scale-in">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6 space-y-2">
          <OnlyFlixLogo size="large" />
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xs pt-1">
            {isLoginMode
              ? "Sign in to stream premier movies, trailers, and curated lists"
              : "Create an account to start curating your personal cinema watchlist"}
          </p>
        </div>

        {/* ⚡ PROMINENT DEMO CREDENTIALS CALLOUT BOX */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-red-950/40 via-zinc-900/80 to-zinc-900/80 border border-brand/30 shadow-glow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Sparkles size={14} className="animate-spin" style={{ animationDuration: "4s" }} />
              <span>Instant Demo Access</span>
            </div>
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-brand/20 text-brand border border-brand/40">
              No Signup Required
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-300 mb-3 bg-black/40 p-2.5 rounded-xl border border-white/5">
            <div>
              <span className="text-zinc-500 block text-[10px]">Email</span>
              <span className="font-mono text-zinc-200">demo@onlyflix.com</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px]">Password</span>
              <span className="font-mono text-zinc-200">password123</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleQuickDemo}
            disabled={isLoading || isDemoLoading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand to-rose-600 hover:from-brand-hover hover:to-rose-500 text-white font-bold text-xs sm:text-sm shadow-glow-sm hover:shadow-glow-lg transition-all duration-200 active:scale-[0.98]"
          >
            {isDemoLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Zap size={15} className="fill-amber-300 text-amber-300" />
                <span>1-Click Instant Demo Login</span>
              </>
            )}
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-zinc-900/90 rounded-2xl border border-white/10 mb-5">
          <button
            type="button"
            onClick={() => {
              setIsLoginMode(true);
              setFormError("");
            }}
            className={`py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
              isLoginMode
                ? "bg-brand text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLoginMode(false);
              setFormError("");
            }}
            className={`py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
              !isLoginMode
                ? "bg-brand text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Error Alert */}
        {formError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium animate-fade-in">
            {formError}
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginMode && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Full Name</label>
              <div className="relative flex items-center">
                <User size={17} className="absolute left-3.5 text-zinc-500" />
                <input
                  type="text"
                  placeholder="e.g. Christopher Nolan"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-zinc-900/90 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-brand/70 focus:ring-1 focus:ring-brand/70 transition-all"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">Email Address</label>
            <div className="relative flex items-center">
              <Mail size={17} className="absolute left-3.5 text-zinc-500" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-900/90 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-brand/70 focus:ring-1 focus:ring-brand/70 transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">Password</label>
            <div className="relative flex items-center">
              <Lock size={17} className="absolute left-3.5 text-zinc-500" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-900/90 border border-white/10 rounded-xl pl-10 pr-11 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-brand/70 focus:ring-1 focus:ring-brand/70 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-zinc-500 hover:text-zinc-300 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || isDemoLoading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-sm shadow-glow-sm hover:shadow-glow-lg transition-all duration-200 mt-2 disabled:opacity-50 active:scale-[0.98]"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{isLoginMode ? "Sign In to OnlyFlix" : "Create My Account"}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-[11px] text-zinc-500">
            Powered by OnlyFlix 2.0 • TMDB Movie API Proxy • 4K HDR Trailers
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
