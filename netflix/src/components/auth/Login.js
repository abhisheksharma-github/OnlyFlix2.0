import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Film, Lock, Mail, User, Eye, EyeOff, Sparkles, ArrowRight } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export const Login = () => {
  const navigate = useNavigate();
  const { login, register, isAuthenticated, isLoading } = useAuth();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");

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

  const handleQuickDemo = async () => {
    setEmail("demo@onlyflix.com");
    setPassword("demo123456");
    await login({ email: "demo@onlyflix.com", password: "demo123456" });
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden bg-canvas-base">
      {/* Cinematic Backdrop Image with Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=2000&q=80"
          alt="Cinematic Background"
          className="w-full h-full object-cover opacity-25 scale-105 filter blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-canvas-base via-canvas-base/80 to-transparent" />
        <div className="absolute inset-0 bg-hero-radial opacity-60" />
      </div>

      {/* Auth Card */}
      <div className="relative z-10 w-full max-w-md bg-canvas-card/85 backdrop-blur-xl border border-white/10 rounded-2xl p-7 sm:p-9 shadow-modal animate-scale-in">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6 space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand to-rose-700 flex items-center justify-center shadow-glow-sm mb-1">
            <Film className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-sans">
            ONLY<span className="text-brand">FLIX</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            {isLoginMode
              ? "Sign in to stream premier movies and trailers"
              : "Create an account to start curating your watchlist"}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-zinc-900/90 rounded-xl border border-white/10 mb-6">
          <button
            type="button"
            onClick={() => {
              setIsLoginMode(true);
              setFormError("");
            }}
            className={`py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
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
            className={`py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              !isLoginMode
                ? "bg-brand text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error message */}
        {formError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
            {formError}
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginMode && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300">Full Name</label>
              <div className="relative flex items-center">
                <User size={18} className="absolute left-3.5 text-zinc-500" />
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

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">Email Address</label>
            <div className="relative flex items-center">
              <Mail size={18} className="absolute left-3.5 text-zinc-500" />
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

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">Password</label>
            <div className="relative flex items-center">
              <Lock size={18} className="absolute left-3.5 text-zinc-500" />
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
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-sm shadow-glow-sm hover:shadow-glow-lg transition-all duration-200 mt-2 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{isLoginMode ? "Sign In" : "Create Account"}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Button */}
        {isLoginMode && (
          <div className="mt-5 pt-5 border-t border-white/10 text-center">
            <button
              type="button"
              onClick={handleQuickDemo}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-zinc-300 hover:text-white transition-colors"
            >
              <Sparkles size={14} className="text-amber-400" />
              <span>Fill Quick Demo Credentials</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
