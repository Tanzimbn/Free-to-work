# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Free To Work** is a job marketplace web app where users post jobs, receive bids from workers, and manage profiles. It is built as a decoupled full-stack application after a migration from Express/Handlebars to React+Vite (completed Feb 2026).

## Commands

### Backend (root directory)
```bash
npm start          # Runs backend with nodemon on http://localhost:3000
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
Run `npm start` from the root and `npm run dev` from `client/` in separate terminals.

### Environment Setup
The backend requires a `.env` file at the root with:
- `DATABASE` — MongoDB connection string
- Email credentials for nodemailer (registration verification)

## Architecture

### Backend (Node/Express — CommonJS)
- `index.js` — Express app entry: session, CORS (origin: `http://localhost:5174`), static `/uploads`, single route mount at `/api`
- `routes/auth.js` — All API routes (GET/POST) mounted under `/api`
- `controllers/` — Business logic, one file per feature (login, registration, post, profile, bid, filter, list, admin, feedback)
- `models/` — Mongoose schemas: `users`, `post`, `image`, `cover`, `notification`, `reviews`, `feedback`, `block`, `reports`, `category`, `verify`
- `db/conn.js` — MongoDB connection via `process.env.DATABASE`
- `uploads/` — Multer-uploaded files served as static

### Frontend (React 19 + Vite — ESM)
- `client/src/App.jsx` — Router config; protected routes via `<ProtectedRoute>`
- `client/src/context/AuthContext.jsx` — Global auth state (user, isAdmin, notifications); session check on mount via `GET /api/login`
- `client/src/services/api.js` — Axios instance pointing to `http://localhost:3000/api` with `withCredentials: true`
- `client/src/pages/` — Full-page components: LandingPage, LoginPage, RegisterPage, NewsfeedPage, ProfilePage, AdminPage, ListPage
- `client/src/components/` — Reusable UI: AuthNavbar, PostCard, PostDetailsModal, CreatePostModal, FilterSidebar, EditProfileModal, ReviewsModal, ReportUserModal, ProtectedRoute
- `client/src/utils/` — `auth.js`, `locationData.js` (division/district/station hierarchy for Bangladesh), `locationLegacy.js`

### Key Data Flow Patterns
- **Auth**: Session-based (express-session). `AuthContext` checks `GET /api/login` on load. All requests use `withCredentials: true`.
- **Images**: Stored as `Buffer` in MongoDB (`image` and `cover` models), returned as Base64 strings to the frontend.
- **Notifications**: Users with `mood: true` (active) receive notifications for relevant post categories; managed in `notification` model.
- **Bidding**: `POST /api/update_bid` updates `max_bid` and `max_bid_user` on the post document if the new bid is lower than the current max (competitive bidding for lowest price).

### Legacy Files
`client/public/` and `client/src/newui/` contain old HBS-era static files and experimental UI drafts — these are unused by the running app and can be safely deleted.

## Production Build
Uncomment the static file serving lines in `index.js` to serve the React build from Express:
```js
app.use(express.static(path.join(__dirname, "client/dist")));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/dist/index.html"));
});
```
