# Refactor Roadmap

This document tracks the planned refactoring sequence for Free To Work.
Each phase is designed to be done incrementally — complete one before starting the next.

---

## Phase 1 — Fix Auth Context Performance
**Timeline: 1–2 days**
**Goal: App shell renders immediately. Pages fetch their own data.**

### The Problem
`AuthContext` currently calls `GET /api/newsfeed` on every page load, which runs
three DB queries (all posts, user, notifications) before the app renders anything.
The posts query result is not even used — it is thrown away. The user sees a blank
screen until all three queries finish.

### The Fix
Auth context should only verify the session and return minimal identity data.

**New backend endpoint:**
```
GET /api/me  →  { id, name, avatarUrl, role, hasUnseenNotifications }
```

**Each page fetches its own data when it mounts:**
```
NewsfeedPage mounts  →  GET /api/posts?page=1&limit=20
ListPage mounts      →  GET /api/workers?page=1&limit=20
Navbar bell clicked  →  GET /api/notifications?limit=10
```

### Checklist
- [ ] Strip `loadUserData` down — remove the `postModel.find({})` call, return only `{ user: minimalFields, hasUnseenNotifications }`
- [ ] Create `GET /api/me` endpoint that returns minimal user identity
- [ ] Update `AuthContext` to call `/api/me` instead of `/api/newsfeed`
- [ ] Move post fetching into `NewsfeedPage` with a loading skeleton
- [ ] Move list fetching into `ListPage` with a loading skeleton
- [ ] Move notification list fetching to the navbar bell click (lazy)

---

## Phase 2 — Backend Structure Refactor
**Timeline: 3–5 days**
**Goal: Every layer of the stack has one job. Easy to navigate, test, and extend.**

### Target Folder Structure
```
/
├── index.js                        ← bootstrap: middleware + routes + listen
├── app.js                          ← express app export (for testing without listen)
├── .env
├── .env.example
│
├── config/
│   └── index.js                    ← reads + validates all env vars at startup
│
├── middleware/
│   ├── requireAuth.js              ← returns 401 if no session
│   ├── requireAdmin.js             ← returns 403 if not admin role
│   ├── errorHandler.js             ← global error handler
│   └── validate.js                 ← wraps express-validator chains
│
├── routes/
│   ├── index.js                    ← mounts all sub-routers under /api/v1
│   ├── auth.routes.js              ← /login, /logout, /register, /me
│   ├── posts.routes.js             ← /posts CRUD + comments
│   ├── users.routes.js             ← /users/:id profile
│   ├── bids.routes.js              ← /posts/:id/bids
│   ├── notifications.routes.js     ← /notifications
│   └── admin.routes.js             ← /admin/*
│
├── controllers/
│   ├── auth.controller.js
│   ├── posts.controller.js
│   ├── users.controller.js
│   ├── bids.controller.js
│   ├── notifications.controller.js
│   └── admin.controller.js
│
├── models/
│   └── (unchanged — one file per model is correct)
│
└── services/
    ├── email.service.js            ← nodemailer logic lives here, not in controllers
    └── notification.service.js     ← notification creation logic
```

### Layer Responsibilities (never cross these lines)
| Layer | Job | Does NOT |
|---|---|---|
| `routes/` | Map URL + method to controller | Contain any logic |
| `controllers/` | Read req, call model/service, send res | Query DB directly in complex ways |
| `services/` | Reusable business logic | Know about req/res |
| `models/` | DB schema + simple queries | Know about HTTP |
| `middleware/` | Cross-cutting concerns | Contain business logic |

### The Error Handling Pattern
Replace try/catch in every controller with a single global handler:

```js
// Any controller — just call next(err) on failure
exports.createPost = async (req, res, next) => {
    try {
        const post = await Post.create(req.body);
        res.status(201).json({ success: true, data: post });
    } catch (err) {
        next(err);
    }
};

// middleware/errorHandler.js — handles everything in one place
module.exports = (err, req, res, next) => {
    const status = err.statusCode || 500;
    res.status(status).json({ success: false, error: err.message });
};
```

### Checklist
- [ ] Create `config/index.js` — reads all env vars, throws at startup if any missing
- [ ] Create `middleware/requireAuth.js`
- [ ] Create `middleware/requireAdmin.js`
- [ ] Create `middleware/errorHandler.js`
- [ ] Split `routes/auth.js` into separate route files (one per resource)
- [ ] Add `/api/v1` versioning prefix
- [ ] Create `services/email.service.js` — move nodemailer out of controllers
- [ ] Create `services/notification.service.js` — move notification creation logic
- [ ] Refactor controllers to use `next(err)` instead of inline try/catch responses
- [ ] Apply `requireAuth` to all private route groups at the router level, not per-handler

---

## Phase 3 — Security Foundations
**Timeline: 2–3 days (run alongside Phase 2)**
**Goal: No critical vulnerabilities before any real user touches the app.**

### Checklist
- [ ] **Passwords** — `npm install bcrypt`, hash on register, compare on login, strip from all responses with `.select('-password')`
- [ ] **Session secret** — move to `process.env.SESSION_SECRET`, set `httpOnly: true`, `sameSite: 'strict'`
- [ ] **Security headers** — `npm install helmet`, add `app.use(helmet())` in `index.js`
- [ ] **Rate limiting** — `npm install express-rate-limit`, apply to `/login` and `/register`
- [ ] **NoSQL sanitization** — `npm install express-mongo-sanitize`, add `app.use(mongoSanitize())` in `index.js`
- [ ] **File uploads** — replace `file.originalname` with `crypto.randomUUID() + ext`, add MIME whitelist, add size limit
- [ ] **Admin credentials** — add `role` field to user schema, remove hardcoded email/password check
- [ ] **Password reset** — replace `Math.random()` with `crypto.randomBytes(32).toString('hex')`, store hashed token + expiry in DB
- [ ] **Env validation** — fail fast at startup if required vars are missing (done in Phase 2 config step)
- [ ] **Remove** `console.log(email, password)` from login controller

---

## Phase 4 — Frontend Data Layer
**Timeline: 3–4 days**
**Goal: Components receive data + loading state. No ad-hoc fetching inside components.**

### The Pattern
Install **TanStack Query** (React Query). It gives caching, deduplication,
background refetch, and loading/error state for free.

```bash
cd client && npm install @tanstack/react-query
```

```jsx
// Wrap app in QueryClientProvider (App.jsx)
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();

// In any page:
const { data: posts, isLoading, isError } = useQuery({
    queryKey: ['posts', page],
    queryFn: () => api.get(`/posts?page=${page}&limit=20`).then(r => r.data)
});
```

### Checklist
- [ ] Install and configure `@tanstack/react-query` with `QueryClientProvider` in `App.jsx`
- [ ] Replace direct `api.get()` calls in `NewsfeedPage` with `useQuery`
- [ ] Replace direct `api.get()` calls in `ListPage` with `useQuery`
- [ ] Add loading skeleton components for post cards and list items
- [ ] Add `React Error Boundary` wrapping the router
- [ ] Centralise all API call functions into `client/src/services/` (one file per resource: `posts.service.js`, `users.service.js`, etc.) so query functions are not defined inline in components

---

## Phase 5 — Database & Performance
**Timeline: 2–3 days**
**Goal: Queries are fast. Images do not bloat API responses.**

### Checklist
- [ ] **Pagination** — add `?page` and `?limit` to all list endpoints, use `.skip().limit()` in queries
- [ ] **DB indexes** — add to frequently queried fields:
  ```js
  userSchema.index({ email: 1 }, { unique: true });
  userSchema.index({ category: 1 });
  postSchema.index({ category: 1, createdAt: -1 });
  notiSchema.index({ user: 1, createdAt: -1 });
  ```
- [ ] **Image serving** — store only the file path string in the user document, serve images from `/uploads/:filename` (already configured as static). Remove Base64 from API responses.
- [ ] **Notification query** — replace `userModel.find()` + JS filter loop in `post.controller.js` with `userModel.find({ category, mood: true, _id: { $ne: userId } })`
- [ ] **Filter endpoint** — replace JS-side `.includes()` filtering in `filter.js` with MongoDB query operators

---

## Execution Notes

- **Do one phase at a time.** Do not mix Phase 2 and Phase 4 work in the same session.
- **Do one route group at a time inside Phase 2.** Move `auth.routes.js`, confirm it works, then move `posts.routes.js`, and so on. This is how engineers refactor production systems without breaking them.
- **Test each endpoint manually (Postman or curl) after moving it.** No automated tests yet, so manual verification is the safety net.
- **Commit after each working sub-step**, not after each phase. Small commits are easier to debug and revert.

---

## Key Principle

> Each layer of the stack has one job and does not reach into another layer's responsibility.
> Routes do not query the DB. Controllers do not format emails. Models do not know about HTTP.
> Once this principle is embodied in the folder structure, the code becomes easy to navigate, test, and change.
