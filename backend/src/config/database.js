import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("[MongoDB] Connection Error:", error.message);
    // In dev mode, we log but avoid crashing immediately so local mock fallbacks can still function
    if (env.NODE_ENV === "production") {
      process.exit(1);
    }
  }
};

mongoose.connection.on("disconnected", () => {
  console.warn("[MongoDB] Disconnected from database");
});

mongoose.connection.on("reconnected", () => {
  console.log("[MongoDB] Reconnected to database");
});
