import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("8080").transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),
  JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters long").default("onlyflix_super_secure_jwt_secret_key_2026"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  CLIENT_URL: z.string().default("http://localhost:3000"),
  TMDB_API_KEY: z.string().optional().default(""),
  TMDB_READ_ACCESS_TOKEN: z.string().optional().default("eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZGJlZjViMDUzNWE3OGYwMjllMTQ0NDE5NTQ4MjM4MCIsInN1YiI6IjY1MDRhMjNkNTllOGE5MDExZWNhYTVjZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.LTBaAb_2NPRGPr2HeGszyFDP-onLh-fiL7fzmnOFZUg"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Environment Configuration Validation Failed:");
  console.error(JSON.stringify(parsedEnv.error.format(), null, 2));
  process.exit(1);
}

export const env = parsedEnv.data;
