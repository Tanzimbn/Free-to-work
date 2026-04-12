# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Free To Work** is a job marketplace web app where users post jobs, receive bids from workers, and manage profiles. It is built as a decoupled full-stack application after a migration from Express/Handlebars to React+Vite (completed Feb 2026).

## Commands

### Backend (root directory)
```bash
npm run dev        # Runs backend with nodemon on http://localhost:3000
node index.js      # Run backend without nodemon
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
Run `npm run dev` from the root and `npm run dev` from `client/` in separate terminals.

### Environment Setup
The backend requires a `.env` file at the root. See `.env.example` for the full template.

**Required variables:**
- `DATABASE` — MongoDB connection string
- `SESSION_SECRET` — Secret for express-session
- `EMAIL_USER` — Gmail address for nodemailer (registration verification)
- `EMAIL_PASS` — Gmail app password

**Optional variables:**
- `PORT` — Backend port (default: 3000)
- `CORS_ORIGINS` — Comma-separated allowed origins (default: `http://localhost:5173,http://localhost:5174`)
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — Hardcoded admin credentials
- `CLIENT_URL` / `BACKEND_URL` — Used in email links

## Architecture

### Backend (Node/Express — CommonJS)
- `index.js` — Express app entry: loads config, sets up CORS (from `CORS_ORIGINS` env), session, static `/uploads`, mounts all routes at `/api/v1`, registers global error handler
- `config/index.js` — Loads `.env`, validates required vars, exports a config object
- `routes/index.js` — Aggregates all split route files; mounted at `/api/v1`
  - `routes/auth.routes.js` — Login, logout, register, password change
  - `routes/posts.routes.js` — Post CRUD, comments, filtering
  - `routes/users.routes.js` — Profile, reviews
  - `routes/notifications.routes.js` — User notifications
  - `routes/bids.routes.js` — Bidding
  - `routes/admin.routes.js` — Admin-only endpoints
- `middleware/requireAuth.js` — Session auth check (used in protected route groups)
- `middleware/requireAdmin.js` — Admin role check
- `middleware/errorHandler.js` — Global error handler (last in Express middleware chain)
- `controllers/` — Business logic, one file per feature:
  - `login.controller.js`, `registration.controller.js`, `post.controller.js`, `profile.js`
  - `bid.controller.js`, `filter.js`, `list.controller.js`, `admin.controller.js`
  - `feedback.controller.js`, `allpost.controller.js`, `user_info.js`, `sessionlogin.controller.js`
- `models/` — Mongoose schemas: `users`, `post`, `comment`, `cover`, `notification`, `reviews`, `feedback`, `block`, `reports`, `category`, `verify`
- `services/email.service.js` — Nodemailer setup for registration verification emails
- `services/notification.service.js` — Notification fan-out logic
- `db/conn.js` — MongoDB connection via `DATABASE` env var
- `uploads/` — Multer-uploaded files served as static

### Frontend (React 19 + Vite — ESM)
- `client/src/App.jsx` — Router config; routes wrapped in `<MainLayout>` / `<AuthLayout>`
- `client/src/context/AuthContext.jsx` — Global auth state (user, isAdmin, notifications); session check on mount via `GET /api/v1/login`
- `client/src/services/api.js` — Axios instance with `baseURL = VITE_API_URL || http://localhost:3000/api/v1` and `withCredentials: true`
- `client/src/layouts/MainLayout.jsx` — Root wrapper; `AuthLayout.jsx` adds `<AuthNavbar>` to protected routes
- `client/src/pages/` — Full-page components: `LandingPage`, `LoginPage`, `RegisterPage`, `NewsfeedPage`, `ProfilePage`, `AdminPage`, `ListPage`, `ErrorPage`
- `client/src/components/` — Reusable UI: `AuthNavbar`, `PostCard`, `ProfilePostCard`, `PostDetailsModal`, `CreatePostModal`, `FilterSidebar`, `EditProfileModal`, `ReviewsModal`, `ReportUserModal`, `ProtectedRoute`
- `client/src/utils/locationData.js` — Division/district/station hierarchy for Bangladesh location dropdowns

### Key Data Flow Patterns
- **Auth**: Session-based (express-session). `AuthContext` checks `GET /api/v1/login` on load. All requests use `withCredentials: true`.
- **Images**: Stored as `Buffer` in MongoDB (`cover` model), returned as Base64 strings to the frontend.
- **Notifications**: Users with `mood: true` receive notifications for posts in their subscribed categories; managed in `notification` model.
- **Bidding**: `POST /api/v1/update_bid` updates `max_bid` and `max_bid_user` on the post document if the new bid is lower than the current max (competitive bidding for lowest price).

### Legacy / Unused
- `routes/auth.js` — Old unified routes file, superseded by split route files; can be deleted
- `client/public/pictures/` — Old static assets, not used by the app
- `hbs` package in `package.json` — Leftover from Express/Handlebars era; unused

## Production Build
Set `CORS_ORIGINS` in `.env` to include your production domain. Uncomment the static file serving lines in `index.js` to serve the React build from Express:
```js
app.use(express.static(path.join(__dirname, "client/dist")));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/dist/index.html"));
});
```