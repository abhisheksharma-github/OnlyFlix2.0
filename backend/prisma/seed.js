/**
 * @file backend/prisma/seed.js
 * @description Production-quality seed script for OnlyFlix 2.0.
 *
 * Populates:
 *   - 3 realistic demo users (1 admin, 2 regular)
 *   - Multi-season TV show watchlist entries (The Bear, Succession, Severance, etc.)
 *   - Popular movie watchlist entries (Oppenheimer, Dune: Part Two, etc.)
 *   - Watch history records with realistic progress + completion states
 *
 * Usage:
 *   npx prisma db seed
 *   (or: node prisma/seed.js directly with dotenv/config loaded)
 *
 * The script is idempotent: it uses upsert operations so re-running it will
 * update existing records rather than throw duplicate key errors.
 */

import { PrismaClient, MediaType, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  log: ["warn", "error"],
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Hash a plain-text password with bcrypt cost factor 12.
 * @param {string} plain
 * @returns {Promise<string>}
 */
async function hashPassword(plain) {
  return bcrypt.hash(plain, 12);
}

// ---------------------------------------------------------------------------
// Seed data definitions
// ---------------------------------------------------------------------------

/**
 * @typedef {{ email: string; fullName: string; password: string; avatarUrl?: string; role: UserRole }} SeedUser
 */

/** @type {SeedUser[]} */
const SEED_USERS = [
  {
    email: "admin@onlyflix.dev",
    fullName: "Alex Rivera",
    password: "Admin@2024!",
    avatarUrl: "https://api.dicebear.com/7.x/lorelei/svg?seed=AlexRivera",
    role: UserRole.ADMIN,
  },
  {
    email: "sarah@onlyflix.dev",
    fullName: "Sarah Chen",
    password: "Demo@2024!",
    avatarUrl: "https://api.dicebear.com/7.x/lorelei/svg?seed=SarahChen",
    role: UserRole.USER,
  },
  {
    email: "marcus@onlyflix.dev",
    fullName: "Marcus Webb",
    password: "Demo@2024!",
    avatarUrl: "https://api.dicebear.com/7.x/lorelei/svg?seed=MarcusWebb",
    role: UserRole.USER,
  },
];

/**
 * @typedef {{
 *   mediaId: number;
 *   mediaType: MediaType;
 *   title: string;
 *   posterPath: string;
 *   backdropPath: string;
 *   overview: string;
 *   voteAverage: number;
 *   releaseDate: string;
 * }} SeedMedia
 */

/** @type {SeedMedia[]} */
const SEED_TV_SHOWS = [
  {
    mediaId: 136315,
    mediaType: MediaType.TV,
    title: "The Bear",
    posterPath: "/sHFlbKS3WLqMnp9t2ghADIJFnuQ.jpg",
    backdropPath: "/4qe8nUMR4h7gGHHqBFQ3bFCKQaw.jpg",
    overview:
      "A young chef from the fine-dining world returns to Chicago to run his family's sandwich shop after the death of his brother.",
    voteAverage: 8.8,
    releaseDate: "2022-06-23",
  },
  {
    mediaId: 82856,
    mediaType: MediaType.TV,
    title: "The Mandalorian",
    posterPath: "/sWgBv7LV2rebbvy2DSvABqghOls.jpg",
    backdropPath: "/9ijMGlJKqcslswWUzTEwScm82Gs.jpg",
    overview:
      "A lone gunfighter makes his way through the outer reaches of the lawless galaxy.",
    voteAverage: 8.5,
    releaseDate: "2019-11-12",
  },
  {
    mediaId: 63174,
    mediaType: MediaType.TV,
    title: "Succession",
    posterPath: "/e2X8xG4C2sCBSmFBGFAO4QpJkBu.jpg",
    backdropPath: "/nbc2yZqjUXuZYJSBOEWCpHlhIKu.jpg",
    overview:
      "The Roy family, owners of Waystar RoyCo, struggle for control of their media empire.",
    voteAverage: 8.7,
    releaseDate: "2018-06-03",
  },
  {
    mediaId: 95396,
    mediaType: MediaType.TV,
    title: "Severance",
    posterPath: "/9sVbVM3QWyFMBGUkEeVKhHbfFpA.jpg",
    backdropPath: "/Jnuk6qbblbnOJjpJsOlkPzZjHvU.jpg",
    overview:
      "Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives.",
    voteAverage: 8.7,
    releaseDate: "2022-02-18",
  },
  {
    mediaId: 100088,
    mediaType: MediaType.TV,
    title: "The Last of Us",
    posterPath: "/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg",
    backdropPath: "/uDgy6hyPd7qg6aCc6g4bRB2HVCO.jpg",
    overview:
      "Joel, a hardened survivor, is hired to smuggle Ellie out of an oppressive quarantine zone.",
    voteAverage: 8.8,
    releaseDate: "2023-01-15",
  },
  {
    mediaId: 84958,
    mediaType: MediaType.TV,
    title: "Loki",
    posterPath: "/voHUmluYmKyleFkTu3lOXQG702u.jpg",
    backdropPath: "/x61DPAiKrEsFkJF1YPfF7KCNBfe.jpg",
    overview:
      "The mercurial villain Loki resumes his role as the God of Mischief in a new TVA-set adventure.",
    voteAverage: 8.2,
    releaseDate: "2021-06-09",
  },
];

/** @type {SeedMedia[]} */
const SEED_MOVIES = [
  {
    mediaId: 872585,
    mediaType: MediaType.MOVIE,
    title: "Oppenheimer",
    posterPath: "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    backdropPath: "/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg",
    overview:
      "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    voteAverage: 8.2,
    releaseDate: "2023-07-19",
  },
  {
    mediaId: 693134,
    mediaType: MediaType.MOVIE,
    title: "Dune: Part Two",
    posterPath: "/czembW0Rk1Ke7lCJGahbOhdCuhx.jpg",
    backdropPath: "/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg",
    overview:
      "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    voteAverage: 8.3,
    releaseDate: "2024-02-28",
  },
  {
    mediaId: 667538,
    mediaType: MediaType.MOVIE,
    title: "Transformers: Rise of the Beasts",
    posterPath: "/gPbM0MK8CP8A174rmUwGsADNYKD.jpg",
    backdropPath: "/bz66a19bR6BKsbjvlregister.jpg",
    overview:
      "A globe-trotting 90s adventure introduces Maximals, Predacons, and Terrorcons to the Transformers universe.",
    voteAverage: 6.0,
    releaseDate: "2023-06-06",
  },
  {
    mediaId: 569094,
    mediaType: MediaType.MOVIE,
    title: "Spider-Man: Across the Spider-Verse",
    posterPath: "/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
    backdropPath: "/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg",
    overview:
      "Miles Morales catapults across the multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
    voteAverage: 8.7,
    releaseDate: "2023-05-31",
  },
  {
    mediaId: 335977,
    mediaType: MediaType.MOVIE,
    title: "Indiana Jones and the Dial of Destiny",
    posterPath: "/Af4bXE63pVsb2FtDBD1Kh0GaYs.jpg",
    backdropPath: "/4fHequF7tOByOBbJn5D21ZYVdJ6.jpg",
    overview:
      "Finding himself in a new era and approaching retirement, Indy wrestles with fitting into a changing world.",
    voteAverage: 6.8,
    releaseDate: "2023-06-28",
  },
  {
    mediaId: 385687,
    mediaType: MediaType.MOVIE,
    title: "Fast X",
    posterPath: "/fiVW06jE7z9YnO4trhaMEdclSiC.jpg",
    backdropPath: "/yYrvN5WFeGYjJnRzhY0QXuo4Isw.jpg",
    overview:
      "Dom Toretto and his family are targeted by the vengeful son of drug lord Hernan Reyes.",
    voteAverage: 7.0,
    releaseDate: "2023-05-17",
  },
];

// ---------------------------------------------------------------------------
// Watch history entries (realistic progress simulation)
// ---------------------------------------------------------------------------

/**
 * @typedef {{
 *   mediaId: number;
 *   mediaType: MediaType;
 *   title: string;
 *   posterPath: string;
 *   seasonNumber?: number;
 *   episodeNumber?: number;
 *   progressSeconds: number;
 *   durationSeconds: number;
 *   completed: boolean;
 * }} SeedHistory
 */

/** @type {SeedHistory[]} */
const SARAH_HISTORY = [
  // The Bear S1 — fully completed episodes 1-3, in progress on E4
  {
    mediaId: 136315, mediaType: MediaType.TV, title: "The Bear",
    posterPath: "/sHFlbKS3WLqMnp9t2ghADIJFnuQ.jpg",
    seasonNumber: 1, episodeNumber: 1,
    progressSeconds: 1956, durationSeconds: 1956, completed: true,
  },
  {
    mediaId: 136315, mediaType: MediaType.TV, title: "The Bear",
    posterPath: "/sHFlbKS3WLqMnp9t2ghADIJFnuQ.jpg",
    seasonNumber: 1, episodeNumber: 2,
    progressSeconds: 1800, durationSeconds: 1800, completed: true,
  },
  {
    mediaId: 136315, mediaType: MediaType.TV, title: "The Bear",
    posterPath: "/sHFlbKS3WLqMnp9t2ghADIJFnuQ.jpg",
    seasonNumber: 1, episodeNumber: 3,
    progressSeconds: 2040, durationSeconds: 2040, completed: true,
  },
  {
    mediaId: 136315, mediaType: MediaType.TV, title: "The Bear",
    posterPath: "/sHFlbKS3WLqMnp9t2ghADIJFnuQ.jpg",
    seasonNumber: 1, episodeNumber: 4,
    progressSeconds: 742, durationSeconds: 1920, completed: false,
  },
  // Oppenheimer — watched 74 minutes of 181
  {
    mediaId: 872585, mediaType: MediaType.MOVIE, title: "Oppenheimer",
    posterPath: "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    progressSeconds: 4440, durationSeconds: 10860, completed: false,
  },
  // Spider-Verse — completed
  {
    mediaId: 569094, mediaType: MediaType.MOVIE, title: "Spider-Man: Across the Spider-Verse",
    posterPath: "/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
    progressSeconds: 7080, durationSeconds: 7080, completed: true,
  },
];

/** @type {SeedHistory[]} */
const MARCUS_HISTORY = [
  // Dune 2 — completed
  {
    mediaId: 693134, mediaType: MediaType.MOVIE, title: "Dune: Part Two",
    posterPath: "/czembW0Rk1Ke7lCJGahbOhdCuhx.jpg",
    progressSeconds: 9780, durationSeconds: 9780, completed: true,
  },
  // Succession S3E1-E3
  {
    mediaId: 63174, mediaType: MediaType.TV, title: "Succession",
    posterPath: "/e2X8xG4C2sCBSmFBGFAO4QpJkBu.jpg",
    seasonNumber: 3, episodeNumber: 1,
    progressSeconds: 3600, durationSeconds: 3600, completed: true,
  },
  {
    mediaId: 63174, mediaType: MediaType.TV, title: "Succession",
    posterPath: "/e2X8xG4C2sCBSmFBGFAO4QpJkBu.jpg",
    seasonNumber: 3, episodeNumber: 2,
    progressSeconds: 3480, durationSeconds: 3480, completed: true,
  },
  {
    mediaId: 63174, mediaType: MediaType.TV, title: "Succession",
    posterPath: "/e2X8xG4C2sCBSmFBGFAO4QpJkBu.jpg",
    seasonNumber: 3, episodeNumber: 3,
    progressSeconds: 1200, durationSeconds: 3540, completed: false,
  },
  // Severance S1 binge
  {
    mediaId: 95396, mediaType: MediaType.TV, title: "Severance",
    posterPath: "/9sVbVM3QWyFMBGUkEeVKhHbfFpA.jpg",
    seasonNumber: 1, episodeNumber: 1,
    progressSeconds: 3480, durationSeconds: 3480, completed: true,
  },
  {
    mediaId: 95396, mediaType: MediaType.TV, title: "Severance",
    posterPath: "/9sVbVM3QWyFMBGUkEeVKhHbfFpA.jpg",
    seasonNumber: 1, episodeNumber: 2,
    progressSeconds: 3060, durationSeconds: 3060, completed: true,
  },
];

// ---------------------------------------------------------------------------
// Main seed runner
// ---------------------------------------------------------------------------

async function main() {
  console.log("\n🌱  Starting OnlyFlix 2.0 seed run...\n");

  // 1. Upsert users
  const createdUsers = await Promise.all(
    SEED_USERS.map(async (u) => {
      const hashed = await hashPassword(u.password);
      const user = await prisma.user.upsert({
        where: { email: u.email },
        update: { fullName: u.fullName, avatarUrl: u.avatarUrl },
        create: {
          email: u.email,
          fullName: u.fullName,
          password: hashed,
          avatarUrl: u.avatarUrl,
          role: u.role,
        },
      });
      console.log(`  ✔ User: ${user.fullName} <${user.email}>`);
      return user;
    })
  );

  const [adminUser, sarahUser, marcusUser] = createdUsers;

  // 2. Seed watchlists
  // Admin gets everything
  const adminWatchlistItems = [...SEED_TV_SHOWS, ...SEED_MOVIES];
  // Sarah favors TV, Marcus favors movies
  const sarahWatchlistItems = [
    ...SEED_TV_SHOWS,
    SEED_MOVIES[0], // Oppenheimer
    SEED_MOVIES[3], // Spider-Verse
  ];
  const marcusWatchlistItems = [
    ...SEED_MOVIES,
    SEED_TV_SHOWS[2], // Succession
    SEED_TV_SHOWS[3], // Severance
  ];

  /**
   * @param {string} userId
   * @param {SeedMedia[]} items
   */
  async function seedWatchlist(userId, items) {
    for (const item of items) {
      await prisma.watchlist.upsert({
        where: {
          userId_mediaId_mediaType: {
            userId,
            mediaId: item.mediaId,
            mediaType: item.mediaType,
          },
        },
        update: {
          title: item.title,
          voteAverage: item.voteAverage,
        },
        create: {
          userId,
          mediaId: item.mediaId,
          mediaType: item.mediaType,
          title: item.title,
          posterPath: item.posterPath,
          backdropPath: item.backdropPath,
          overview: item.overview,
          voteAverage: item.voteAverage,
          releaseDate: item.releaseDate,
        },
      });
    }
  }

  await seedWatchlist(adminUser.id, adminWatchlistItems);
  console.log(`  ✔ Watchlist: ${adminUser.fullName} (${adminWatchlistItems.length} items)`);

  await seedWatchlist(sarahUser.id, sarahWatchlistItems);
  console.log(`  ✔ Watchlist: ${sarahUser.fullName} (${sarahWatchlistItems.length} items)`);

  await seedWatchlist(marcusUser.id, marcusWatchlistItems);
  console.log(`  ✔ Watchlist: ${marcusUser.fullName} (${marcusWatchlistItems.length} items)`);

  // 3. Seed watch history

  /**
   * @param {string} userId
   * @param {SeedHistory[]} entries
   */
  async function seedHistory(userId, entries) {
    for (const entry of entries) {
      await prisma.watchHistory.upsert({
        where: {
          userId_mediaId_mediaType_seasonNumber_episodeNumber: {
            userId,
            mediaId: entry.mediaId,
            mediaType: entry.mediaType,
            seasonNumber: entry.seasonNumber ?? null,
            episodeNumber: entry.episodeNumber ?? null,
          },
        },
        update: {
          progressSeconds: entry.progressSeconds,
          completed: entry.completed,
        },
        create: {
          userId,
          mediaId: entry.mediaId,
          mediaType: entry.mediaType,
          title: entry.title,
          posterPath: entry.posterPath,
          seasonNumber: entry.seasonNumber,
          episodeNumber: entry.episodeNumber,
          progressSeconds: entry.progressSeconds,
          durationSeconds: entry.durationSeconds,
          completed: entry.completed,
        },
      });
    }
  }

  await seedHistory(sarahUser.id, SARAH_HISTORY);
  console.log(`  ✔ Watch history: ${sarahUser.fullName} (${SARAH_HISTORY.length} records)`);

  await seedHistory(marcusUser.id, MARCUS_HISTORY);
  console.log(`  ✔ Watch history: ${marcusUser.fullName} (${MARCUS_HISTORY.length} records)`);

  console.log("\n✅  Seed complete.\n");
  console.log("Demo credentials:");
  console.log("  Admin:  admin@onlyflix.dev  /  Admin@2024!");
  console.log("  User 1: sarah@onlyflix.dev  /  Demo@2024!");
  console.log("  User 2: marcus@onlyflix.dev /  Demo@2024!\n");
}

// ---------------------------------------------------------------------------
// Execute
// ---------------------------------------------------------------------------

main()
  .catch((err) => {
    console.error("\n❌  Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
