# 🎬 OnlyFlix 2.0 - Production-Grade Streaming Platform

A high-performance, resilient streaming web application built with **React 18**, **Redux Toolkit**, **Tailwind CSS**, and a hardened **Node.js/Express** backend proxy layer. Designed with a bespoke, dark cinematic aesthetic inspired by Apple TV+ and Linear.

---

## ✨ Features & Architecture

- **🔒 Zero Client Secrets:** TMDB API tokens and keys remain securely isolated on the backend server.
- **⚡ In-Memory Server Cache:** 15-minute TTL caching on external metadata to prevent rate limits and optimize response times.
- **🛡️ Defensive Backend Layer:** Zod payload validation, centralized error handling envelopes, request rate limiting, and Helmet security headers.
- **🍪 Persistent Session Management:** Secure `httpOnly` JWT cookies and `/api/v1/auth/me` session hydration on reload.
- **🎨 Bespoke Design System:** Deep obsidian palette (`#08080A`), translucent charcoal glass surfaces, tactile hover micro-interactions, and custom crimson glow accents.
- **🎥 Apple TV+ Style Trailer Modal:** High-definition video player, audio controls, genre tags, and rating badges.
- **📑 Personal Watchlist & History:** Full CRUD data persistence in MongoDB for bookmarking titles and tracking playback progress.
- **🔍 Real-Time Debounced Search:** Instant search with genre filter chips and rich empty states.
- **✨ Shimmer Skeleton Loaders:** Contextual skeleton placeholders across all views.

---

## 🛠 Tech Stack

### Frontend
- **Framework:** React 18, React Router v6
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS + Vanilla CSS Tokens
- **Icons:** Lucide React, React Icons
- **Notifications:** React Hot Toast
- **HTTP Client:** Axios with Response Interceptors

### Backend
- **Runtime:** Node.js & Express
- **Database:** MongoDB with Mongoose
- **Validation:** Zod
- **Security:** Helmet, Express Rate Limit, Cookie Parser, Bcrypt.js (10 rounds), JWT
- **Caching:** Node-Cache (15m TTL)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (local or MongoDB Atlas URI)

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev # or: npm start
```
*Backend runs on `http://localhost:8080`.*

### 3. Frontend Setup
```bash
cd netflix
npm install
npm start
```
*Frontend runs on `http://localhost:3000`.*

---

## 📡 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Create user account
- `POST /api/v1/auth/login` - Sign in and receive secure cookie
- `GET /api/v1/auth/me` - Hydrate active user session
- `POST /api/v1/auth/logout` - Clear session cookie

### Movies (TMDB Server Proxy)
- `GET /api/v1/movies/now-playing` - Theatrical releases
- `GET /api/v1/movies/popular` - Popular titles
- `GET /api/v1/movies/top-rated` - Top rated masterpieces
- `GET /api/v1/movies/upcoming` - Upcoming releases
- `GET /api/v1/movies/trending` - Daily trending titles
- `GET /api/v1/movies/search?query=...` - Live catalog search
- `GET /api/v1/movies/:id` - Movie details & credits
- `GET /api/v1/movies/:id/videos` - YouTube trailer keys

### Watchlist & History
- `GET /api/v1/watchlist` - List saved movies
- `POST /api/v1/watchlist` - Add movie to watchlist
- `DELETE /api/v1/watchlist/:movieId` - Remove movie from watchlist
- `GET /api/v1/history` - Retrieve playback history
- `POST /api/v1/history` - Record playback progress
