# 🎬 OnlyFlix 2.0 - Production-Grade Streaming Platform

A high-performance, resilient streaming web application built with **React 18**, **Redux Toolkit**, **Tailwind CSS**, and a hardened **Node.js/Express** backend proxy layer. Designed with a bespoke, dark cinematic aesthetic inspired by Apple TV+ and Linear.

---

## ✨ Features & Architecture

- **🔒 Zero Client Secrets:** TMDB API tokens and keys remain securely isolated on the backend server.
- **⚡ In-Memory Server Cache:** 15-minute TTL caching on external metadata to prevent rate limits and optimize response times.
- **🛡️ Defensive Backend Layer:** Zod payload validation, centralized error handling envelopes, request rate limiting, reverse proxy trust, and Helmet security headers.
- **🍪 Persistent Session Management:** Secure cross-origin `httpOnly` JWT cookies and `/api/v1/auth/me` session hydration on reload.
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

## 🚀 Local Development Setup

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

## 🌐 Production Deployment Guide

### Recommended Stack Architecture
| Layer | Recommended Host | Why? | Free Tier Available? |
| :--- | :--- | :--- | :--- |
| **Frontend** | **Vercel** (or Netlify / Render) | Global Edge CDN, instant GitHub deployments, fast builds, zero config SPA routing | ✅ Yes (Generous) |
| **Backend API** | **Render** (or Railway / Fly.io) | Free Web Service with Node.js runtime, custom domains, free automatic SSL | ✅ Yes |
| **Database** | **MongoDB Atlas** | Managed cloud database cluster with global replication and automated backups | ✅ Yes (M0 Free Tier) |

---

### Step 1: Deploy Backend on Render.com (or Railway)

1. Go to [Render.com](https://render.com) and create/sign in to your account.
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository (`Onlyflix2.0`).
4. Configure the service settings:
   - **Name:** `onlyflix-api` (or your choice)
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
5. In the **Environment Variables** section, add:
   ```env
   NODE_ENV=production
   PORT=8080
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/onlyflix?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters
   JWT_EXPIRES_IN=7d
   CLIENT_URL=https://your-frontend-domain.vercel.app
   TMDB_READ_ACCESS_TOKEN=your_tmdb_v4_read_access_token
   ```
6. Click **Deploy Web Service**.
7. Copy your backend live URL (e.g. `https://onlyflix-api.onrender.com`).

---

### Step 2: Deploy Frontend on Vercel

1. Go to [Vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New...** → **Project** and import `Onlyflix2.0`.
3. In project settings:
   - **Framework Preset:** `Create React App`
   - **Root Directory:** Click `Edit` and select `netflix`
4. In the **Environment Variables** section, add:
   ```env
   REACT_APP_API_URL=https://onlyflix-api.onrender.com/api/v1
   ```
   *(Replace with your live Render backend URL from Step 1)*
5. Click **Deploy**.
6. Once deployed, copy your frontend domain (e.g. `https://onlyflix-2-0.vercel.app`) and update the `CLIENT_URL` environment variable in your Render backend settings so CORS and secure cookies link up seamlessly!

---

### Step 3: Alternative One-Click Deploy via Render Blueprint (`render.yaml`)

This repository includes a [`render.yaml`](./render.yaml) blueprint:
1. In Render, select **New +** → **Blueprint**.
2. Connect your repo and Render will automatically detect and scaffold both the `onlyflix-api` backend service and `onlyflix-frontend` static site simultaneously!

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
