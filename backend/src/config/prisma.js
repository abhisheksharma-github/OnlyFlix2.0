/**
 * @file backend/src/config/prisma.js
 * @description Singleton Prisma Client configured for Neon Serverless PostgreSQL.
 *
 * Architecture:
 *  - Uses @neondatabase/serverless WebSocket adapter for HTTP/WebSocket connections
 *    that survive cold starts in serverless/edge runtimes (Vercel, Render free tier).
 *  - Single exported `prisma` instance (module-level singleton) prevents connection
 *    pool exhaustion under hot-reload (dev) or concurrent Lambda invocations (prod).
 *  - Production logging is restricted to "warn" and "error" to avoid leaking
 *    raw SQL statements into log pipelines.
 */

import { PrismaClient } from "@prisma/client";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// Wire the WebSocket constructor so Prisma's @neondatabase driver can open
// pooled connections over WebSocket in non-browser environments.
neonConfig.webSocketConstructor = ws;

/**
 * Build a PrismaClient configured for the current runtime environment.
 * @returns {PrismaClient}
 */
function buildPrismaClient() {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? [
            { emit: "stdout", level: "query" },
            { emit: "stdout", level: "info" },
            { emit: "stdout", level: "warn" },
            { emit: "stdout", level: "error" },
          ]
        : [
            { emit: "stdout", level: "warn" },
            { emit: "stdout", level: "error" },
          ],
    errorFormat: "pretty",
  });
}

// ---------------------------------------------------------------------------
// Module-level singleton
// In development, attach to `global` to survive HMR reloads without spawning
// new connection pools per module reload cycle.
// ---------------------------------------------------------------------------

const globalWithPrisma = /** @type {typeof globalThis & { _prisma?: PrismaClient }} */ (
  globalThis
);

export const prisma =
  globalWithPrisma._prisma ?? buildPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalWithPrisma._prisma = prisma;
}

export default prisma;
