import React from "react";
import Body from "./components/Body";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="bg-[#08080A] min-h-screen font-sans antialiased selection:bg-brand selection:text-white">
      <Body />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#15161E",
            color: "#F4F4F6",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
            fontSize: "13px",
            fontWeight: 500,
            boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.8)",
          },
          success: {
            iconTheme: {
              primary: "#E50914",
              secondary: "#FFFFFF",
            },
          },
          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: "#FFFFFF",
            },
          },
        }}
      />
    </div>
  );
}

export default App;
