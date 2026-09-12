import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Body from "./components/Body";
import UniversalPlayerModal from "./components/movie/UniversalPlayerModal";
import { Toaster } from "react-hot-toast";
import { checkSession } from "./redux/authSlice";
import { hydrateWatchlistIds } from "./redux/watchlistSlice";

function App() {
  const dispatch = useDispatch();

  // Restore session and hydrate watchlist Set on mount
  useEffect(() => {
    dispatch(checkSession()).then((action) => {
      if (checkSession.fulfilled.match(action)) {
        dispatch(hydrateWatchlistIds());
      }
    });
  }, [dispatch]);

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--bg-base)", fontFamily: "'Inter', sans-serif" }}
    >
      <Body />
      {/* Modal is rendered at the root so it's always above everything */}
      <UniversalPlayerModal />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "var(--surface-2)",
            color: "var(--text-primary)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            fontSize: "13px",
            fontWeight: 500,
            boxShadow: "0 10px 30px -10px rgba(0,0,0,0.8)",
          },
          success: {
            iconTheme: { primary: "var(--brand)", secondary: "#fff" },
          },
          error: {
            iconTheme: { primary: "#EF4444", secondary: "#fff" },
          },
        }}
      />
    </div>
  );
}

export default App;
