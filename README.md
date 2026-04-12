![Free To Work](https://raw.githubusercontent.com/Tanzimbn/Free-to-work/master/FreeToWork.png)

# Free To Work

A job marketplace web app where users post jobs, receive competitive bids from workers, and manage their profiles. Built as a decoupled full-stack application with a React frontend and an Express/MongoDB backend (migrated from Express/Handlebars to React + Vite in Feb 2026).

## Features

- **Authentication** — Session-based auth with email verification (Gmail/Nodemailer) and password management
- **Job posts** — Create, browse, filter, and comment on job posts; cover images stored in MongoDB
- **Competitive bidding** — Workers bid on posts; the lowest bid wins and is tracked on the post
- **Profiles & reviews** — User profiles with post history, reviews, and reporting
- **Notifications** — Category-subscribed users get notified of matching new posts
- **Admin panel** — Admin-only endpoints for moderation (users, posts, reports)
- **Location hierarchy** — Division / district / station dropdowns for Bangladesh
- **Demo mode** — Restricted actions for a demo user

## Tech Stack

**Backend:** Node.js, Express 4, Mongoose 7 (MongoDB), express-session, Multer, Nodemailer, bcrypt
**Frontend:** React 19, Vite 7, React Router 7, Axios, RSuite, Tailwind CSS 4, Swiper, React Toastify

## Project Structure

```
.
├── index.js                  # Express entry
├── config/                   # Env loader & validation
├── routes/                   # Split route files, mounted at /api/v1
├── controllers/              # Business logic per feature
├── middleware/               # requireAuth, requireAdmin, errorHandler
├── models/                   # Mongoose schemas
├── services/                 # email, notification services
├── db/conn.js                # MongoDB connection
├── uploads/                  # Multer static uploads
└── client/                   # React + Vite frontend
    └── src/
        ├── pages/            # LandingPage, LoginPage, NewsfeedPage, ProfilePage, AdminPage, ...
        ├── components/       # PostCard, Modals, FilterSidebar, AuthNavbar, ...
        ├── context/          # AuthContext (global auth state)
        ├── layouts/          # MainLayout, AuthLayout
        ├── services/api.js   # Axios instance (withCredentials)
        └── utils/            # locationData.js
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- A Gmail account with an app password (for verification emails)

### 1. Install dependencies
```bash
npm install
cd client && npm install
```

### 2. Configure environment
Copy [.env.example](.env.example) to `.env` at the repo root and fill in values:

| Variable | Required | Description |
|---|---|---|
| `DATABASE` | ✓ | MongoDB connection string |
| `SESSION_SECRET` | ✓ | Long random string for express-session |
| `EMAIL_USER` | ✓ | Gmail address (Nodemailer sender) |
| `EMAIL_PASS` | ✓ | Gmail app password |
| `PORT` | | Backend port (default `3000`) |
| `CORS_ORIGINS` | | Comma-separated allowed origins (default `http://localhost:5173,http://localhost:5174`) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | | Hardcoded admin credentials |
| `CLIENT_URL` / `BACKEND_URL` | | Used in outgoing email links |

### 3. Run in development
Two terminals:
```bash
# Terminal 1 — backend (http://localhost:3000)
npm run dev

# Terminal 2 — frontend (http://localhost:5174)
cd client && npm run dev
```

The frontend can override the API base via `VITE_API_URL` (defaults to `http://localhost:3000/api/v1`).

## Scripts

**Root (backend):**
- `npm run dev` — nodemon
- `npm start` — node

**`client/`:**
- `npm run dev` — Vite dev server
- `npm run build` — production build to `client/dist/`
- `npm run lint` — ESLint
- `npm run preview` — preview the production build

## API

All routes are mounted at `/api/v1`, grouped into:
- [auth.routes.js](routes/auth.routes.js) — login, logout, register, password change
- [posts.routes.js](routes/posts.routes.js) — post CRUD, comments, filtering
- [users.routes.js](routes/users.routes.js) — profile, reviews
- [notifications.routes.js](routes/notifications.routes.js) — user notifications
- [bids.routes.js](routes/bids.routes.js) — bidding
- [admin.routes.js](routes/admin.routes.js) — admin-only endpoints

## Key Patterns

- **Auth** — express-session; frontend checks `GET /api/v1/login` on mount and sends `withCredentials: true` on every request
- **Images** — Uploaded cover images are stored as `Buffer` in MongoDB and returned as Base64 strings to the client
- **Bidding** — `POST /api/v1/update_bid` updates `max_bid` / `max_bid_user` on the post if the new bid is lower (lowest-wins)
- **Notifications** — Users with `mood: true` are fanned out to when a post matches their subscribed categories

## Production Build

1. Set `CORS_ORIGINS` in `.env` to include your production domain.
2. Build the frontend:
   ```bash
   cd client && npm run build
   ```
3. In [index.js](index.js), uncomment the block that serves `client/dist` so Express serves the SPA:
   ```js
   app.use(express.static(path.join(__dirname, "client/dist")));
   app.get("*", (req, res) => {
       res.sendFile(path.join(__dirname, "client/dist/index.html"));
   });
   ```
4. Start with `npm start`.

## License

ISC