# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Branch:** `v2` — full rewrite. See `docs/v2-design.md` for the complete system design.
> v1 code lives on `master` / `dev` branches.

## Project Overview

**Free To Work** is a Bangladesh-only job marketplace where users post jobs, receive bids from workers, and connect based on bid results. v2 is a ground-up rewrite with PostgreSQL, Supabase Storage, WebSocket live bidding, and a clean REST API.

## Commands

### Backend (root directory)
```bash
npm run dev        # nodemon on http://localhost:3000
node src/index.js  # without nodemon
```

### Frontend (`client/` directory)
```bash
cd client
npm run dev        # Vite dev server on http://localhost:5174
npm run build      # Production build to client/dist/
npm run lint       # ESLint
npm run preview    # Preview production build
```

### Running both for development
Run `npm run dev` from root and `npm run dev` from `client/` in separate terminals.

### Database
```bash
# Run migrations against Supabase PostgreSQL
psql $DATABASE_URL -f src/db/migrations/001_init.sql

# Seed reference data
psql $DATABASE_URL -f seeds/divisions.sql
psql $DATABASE_URL -f seeds/districts.sql
psql $DATABASE_URL -f seeds/upazilas.sql
psql $DATABASE_URL -f seeds/categories.sql
```

### Environment Setup
Copy `.env.example` to `.env` at the root.

**Required:**
- `DATABASE_URL` — Supabase PostgreSQL connection string
- `SESSION_SECRET` — Secret for express-session (min 32 chars)
- `EMAIL_USER` — Gmail address for nodemailer
- `EMAIL_PASS` — Gmail app password
- `SUPABASE_URL` — Supabase project URL
- `SUPABASE_SERVICE_KEY` — Supabase service role key (for Storage uploads)

**Optional:**
- `PORT` — Backend port (default: 3000)
- `CORS_ORIGINS` — Comma-separated allowed origins (default: `http://localhost:5174`)
- `CLIENT_URL` — Used in email links (default: `http://localhost:5174`)
- `NODE_ENV` — `development` or `production`

## Architecture

### Deployment (Free Tier)
- **Database + Storage:** Supabase (PostgreSQL 500MB, Storage 1GB CDN-backed)
- **Backend:** Render.com (Node/Express, sleeps after 15min inactivity)
- **Frontend:** Vercel (React/Vite)

### Backend (Node/Express — CommonJS)
- `src/index.js` — Entry: load config, connect DB, attach WebSocket server, start Express
- `src/app.js` — Express setup: CORS, session (pg store), body parsing, routes, error handler
- `src/config/index.js` — Validates required env vars, exports config object
- `src/db/pool.js` — `pg` Pool singleton connected to Supabase PostgreSQL
- `src/db/migrations/` — SQL migration files (run manually or via script)
- `src/routes/index.js` — Mounts all routers at `/api/v1`
  - `auth.routes.js` — Login, register, password reset, email verify
  - `posts.routes.js` — Post CRUD + filters + pagination
  - `bids.routes.js` — Place/update/retract bids
  - `users.routes.js` — Profiles, notifications, preferences
  - `reviews.routes.js` — User reviews
  - `reports.routes.js` — Report a user
  - `location.routes.js` — Divisions / districts / upazilas (seeded, read-only)
  - `categories.routes.js` — Job categories
  - `admin.routes.js` — Admin-only: users, reports, categories
- `src/controllers/` — One file per route group (same naming as routes)
- `src/middleware/`
  - `requireAuth.js` — Session check, attaches `req.user`
  - `requireAdmin.js` — Checks `req.user.is_admin`
  - `validate.js` — Zod validation factory middleware
  - `rateLimiter.js` — Per-route rate limit configs
  - `uploadMiddleware.js` — multer memory storage (for Supabase upload)
  - `errorHandler.js` — Global error handler (last in chain)
- `src/services/`
  - `auth.service.js` — bcrypt, token generation
  - `email.service.js` — nodemailer templates (verify, password reset)
  - `storage.service.js` — Supabase Storage upload/delete
  - `notification.service.js` — Fan-out new-post notifications
  - `post.service.js` — Bid cache update (`bid_count`, `lowest_bid` on posts)
  - `ws.service.js` — WebSocket room tracking, bid broadcast
- `src/validators/` — Zod schemas: `auth`, `post`, `bid`, `user`
- `src/utils/`
  - `response.js` — `sendSuccess()` / `sendError()` helpers
  - `pagination.js` — Cursor encode/decode
  - `AppError.js` — Custom error class with `statusCode` + `code`
- `seeds/` — SQL seed files for divisions, districts, upazilas, categories

### Frontend (React 19 + Vite — ESM)
- `client/src/App.jsx` — Router; public routes + `<AuthLayout>` for protected + `<AdminLayout>`
- `client/src/context/AuthContext.jsx` — `user`, `isAdmin`, `loading`; checks `GET /api/v1/auth/me` on mount and window focus
- `client/src/services/api.js` — Axios instance: `baseURL = VITE_API_URL || http://localhost:3000/api/v1`, `withCredentials: true`
- `client/src/layouts/` — `RootLayout` (Navbar + Outlet), `AuthLayout` (protected), `AdminLayout`
- `client/src/pages/` — `LandingPage`, `LoginPage`, `RegisterPage`, `FeedPage`, `PostDetailPage`, `ProfilePage`, `MyBidsPage`, `NotificationsPage`, `AdminPage`, `NotFoundPage`
- `client/src/components/posts/` — `PostCard`, `PostFilters`, `CreatePostModal`, `BidList`, `BidForm`
- `client/src/components/profile/` — `ProfileHeader`, `EditProfileModal`, `ReviewCard`, `UserPostsList`
- `client/src/components/common/` — `Navbar`, `Pagination`, `LoadingSpinner`, `ErrorBoundary`, `StarRating`, `LocationSelector`
- `client/src/components/admin/` — `UsersTable`, `ReportsTable`
- `client/src/hooks/` — `useAuth`, `useBidSocket` (WebSocket live bids), `useInfiniteScroll`
- `client/src/utils/locationData.js` — Bangladesh division → district → upazila hierarchy

### Key Data Flow Patterns

**Auth:** Session-based (`express-session` with `connect-pg-simple`). Frontend checks `GET /api/v1/auth/me` on mount; all requests use `withCredentials: true`. Session cookie is `httpOnly`, `sameSite: lax` (dev) / `sameSite: none` (prod over HTTPS).

**Images:** Uploaded via multer (memory) → piped to Supabase Storage → URL stored in `users.avatar_url` / `users.cover_url`. Never stored in PostgreSQL.

**Bidding:** One bid per user per post (`UNIQUE(post_id, bidder_id)`). Any amount allowed. On bid write, `posts.bid_count` and `posts.lowest_bid` are updated in the same DB transaction. Post author sees full bid list with bidder identity; all others see amounts only — enforced server-side.

**Live Bids (WebSocket):** `ws` library. On `POST /posts/:id/bids`, after DB write, `ws.service.broadcastNewBid()` pushes update to all clients subscribed to that `postId`. Author clients receive full bid data; non-author clients receive amount only. Frontend `useBidSocket` hook manages connection lifecycle.

**Notifications:** On post creation, `notification.service.fanOut()` writes one `notifications` row per user who has that category in their preferences and `notifications_on = true`. Synchronous for now; designed to move to a job queue (BullMQ) when scaling.

**Post lifecycle:** `open` → `closed` when `bid_deadline` passes. Status computed lazily on query (`CASE WHEN bid_deadline < NOW() THEN 'closed' ELSE status END`). No manual close by users.

**Pagination:** Cursor-based on all list endpoints using `created_at + id` compound cursor.

### API Base URL
All endpoints: `/api/v1`

Standard response envelope:
```json
{ "success": true, "data": { ... } }
{ "success": false, "error": { "code": "NOT_FOUND", "message": "..." } }
```

### Database (PostgreSQL — Supabase)
13 tables: `divisions`, `districts`, `upazilas`, `categories`, `users`, `user_category_preferences`, `posts`, `bids`, `reviews`, `notifications`, `reports`, `email_verifications`, `password_resets`, `session`

Key constraints:
- All primary keys are `UUID` (except location tables which use `SMALLINT`)
- `bids`: `UNIQUE(post_id, bidder_id)` — one bid per user per post
- `reviews`: `UNIQUE(reviewer_id, reviewee_id)` + `CHECK(reviewer_id <> reviewee_id)`
- `posts.bid_count` / `posts.lowest_bid` — denormalized cache, updated transactionally on every bid write
- `users.rating` / `users.review_count` — denormalized cache, updated transactionally on review insert/delete

Full schema in `docs/v2-design.md` § 3.

## Production Deployment
1. Set all required env vars on Render (backend) and Vercel (frontend `VITE_API_URL`)
2. Set `CORS_ORIGINS` to include production frontend URL
3. Set `NODE_ENV=production` on Render
4. Run migrations and seeds against Supabase before first deploy