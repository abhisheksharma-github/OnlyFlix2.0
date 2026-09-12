/**
 * @file backend/src/config/env.js
 * @description Centralized, Zod-validated environment configuration.
 *
 * All process.env access in the application MUST be done through this module.
 * This ensures:
 *  1. The app crashes loudly at startup (fail-fast) if a required variable is missing.
 *  2. Types are coerced correctly (strings to numbers, booleans, URLs).
 *  3. Defaults are explicit and documented, not scattered across the codebase.
 */

import { z } from "zod";

// ---------------------------------------------------------------------------
// Schema definition
// ---------------------------------------------------------------------------

const envSchema = z.object({
  // Runtime
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(5000),

  // Neon PostgreSQL — dual-string pooling architecture
  DATABASE_URL: z
    .string()
    .url()
    .describe("Pooled PgBouncer URL for application runtime connections"),
  DIRECT_URL: z
    .string()
    .url()
    .describe("Direct (non-pooled) URL for Prisma CLI migrations and schema pushes"),

  // TMDB
  TMDB_API_KEY: z
    .string()
    .min(10)
    .describe("TMDB v3 API key — never exposed to the client"),
  TMDB_BASE_URL: z
    .string()
    .url()
    .default("https://api.themoviedb.org/3"),

  // Authentication
  JWT_SECRET: z
    .string()
    .min(32)
    .describe("Minimum 32-char secret for HS256 JWT signing"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  COOKIE_MAX_AGE_MS: z.coerce.number().int().positive().default(7 * 24 * 60 * 60 * 1000),

  // CORS
  CLIENT_URL: z
    .string()
    .url()
    .default("http://localhost:3000")
    .describe("Allowed frontend origin for CORS policy"),

  // Rate limiting
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(15 * 60 * 1000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(200),
});

// ---------------------------------------------------------------------------
// Parse and export
// Calling `safeParse` lets us produce a rich human-readable error message
// instead of Zod's default stack trace.
// ---------------------------------------------------------------------------

const result = envSchema.safeParse(process.env);

if (!result.success) {
  const missing = result.error.issues
    .map((issue) => `  • ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");

  console.error(
    `\n[OnlyFlix] ❌ Environment validation failed. Fix the following:\n${missing}\n`
  );
  process.exit(1);
}

/** @type {z.infer<typeof envSchema>} */
export const env = Object.freeze(result.data);

export default env;
