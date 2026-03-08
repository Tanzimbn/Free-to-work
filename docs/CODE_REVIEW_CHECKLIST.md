# Code Review Checklist — Free To Work

Generated: 2026-03-07
Status legend: `[ ]` = pending · `[x]` = done · `[-]` = skipped/N/A

---

## 🔴 CRITICAL — Fix Before Any Real Users

### Security: Authentication & Passwords

- [ ] **#1 Hash passwords with bcrypt** — `controllers/registration.controller.js`
  Passwords stored in plaintext. Add `bcrypt.hash(password, 12)` before saving and `bcrypt.compare()` on login.

- [ ] **#2 Remove hardcoded admin credentials** — `controllers/login.controller.js`
  `admin@free2work.com` / `"12"` baked into source. Move to env vars and add a proper admin role field on the user model.

- [ ] **#3 Fix NoSQL injection on login** — `controllers/login.controller.js`
  `userModel.find({email, password})` with raw `req.body` allows `{"$ne": ""}` attacks. Sanitize inputs with `express-mongo-sanitize` or validate with `express-validator`.

- [ ] **#4 Secure session config** — `index.js`
  - Move `secret` to `process.env.SESSION_SECRET`
  - Set `cookie: { secure: true, httpOnly: true, sameSite: 'strict' }`
  - Set `resave: false`, `saveUninitialized: false`
  - Add session timeout (`maxAge`)

- [ ] **#5 Fix multer file upload** — `routes/auth.js`
  - Replace `file.originalname` with a generated unique name (`crypto.randomUUID() + ext`)
  - Validate MIME type (whitelist `image/jpeg`, `image/png`, `image/webp`)
  - Add file size limit (`limits: { fileSize: 5 * 1024 * 1024 }`)
  - Add auth check to upload endpoints

- [ ] **#6 Strip password from login response** — `controllers/login.controller.js`
  `res.json({userdata: ans[0]})` sends the full MongoDB doc including password. Use `.select('-password')` or manually omit the field.

- [ ] **#7 Remove credential console.log** — `controllers/login.controller.js`
  `console.log(email, password)` logs user credentials to stdout. Delete it.

- [ ] **#8 Replace `fs.readFileSync` with async** — `controllers/profile.js`
  Blocks the Node event loop. Use `await fs.promises.readFile(...)` instead.

- [ ] **#9 Add security middleware** — `index.js`
  Install and configure:
  - `helmet` — security headers (CSP, X-Frame-Options, etc.)
  - `express-rate-limit` — brute-force protection on `/api/login` and `/api/register`
  - `express-mongo-sanitize` — strip `$` and `.` from request bodies
  - `csurf` or use `SameSite=Strict` cookie as CSRF mitigation

---

### Authentication / Authorization

- [ ] **#10 Add auth guards to unprotected endpoints** — `routes/auth.js`
  `POST /user_data`, `POST /cover_data`, `POST /allpost` and others have no session check.
  Create `middleware/requireAuth.js` and apply to all private route groups.

- [ ] **#11 Replace admin string-comparison with role field** — `controllers/admin.controller.js`
  `if(req.session.user_id != "admin@free2work.com")` is fragile.
  Add `role: { type: String, enum: ['user', 'admin'], default: 'user' }` to the user schema and check `req.session.role === 'admin'`.

- [ ] **#12 Fix password reset security** — `controllers/login.controller.js`
  - Replace `Math.random()` with `crypto.randomBytes(32).toString('hex')`
  - Store hashed token + expiry in DB instead of emailing the new password
  - Add rate limiting on the reset endpoint

---

## 🟠 HIGH PRIORITY

### API Design

- [ ] **#13 Add API versioning** — `routes/auth.js`
  Prefix all routes with `/api/v1/` to allow non-breaking future changes.

- [ ] **#14 Fix HTTP methods and REST naming**
  | Current | Should Be |
  |---|---|
  | `POST /user_data` | `GET /users/:id` |
  | `POST /post_detail` | `GET /posts/:id` |
  | `POST /update_bid` | `POST /posts/:id/bids` |
  | `POST /list_filter` | `GET /workers?category=...&location=...` |

- [ ] **#15 Fix HTTP status codes** — `controllers/feedback.controller.js`, others
  Return `500` for database/server errors, not `400 Bad Request`.

- [ ] **#16 Implement pagination** — `controllers/allpost.controller.js`
  All posts returned in one response. Add `?page=1&limit=20` using `.skip().limit()`.

- [ ] **#17 Standardize API response shape**
  Define a consistent envelope, e.g.:
  ```json
  { "success": true, "data": {...} }
  { "success": false, "error": "message" }
  ```

### Performance

- [ ] **#18 Fix N+1 query for notifications** — `controllers/post.controller.js`
  Replace full `userModel.find()` + JS filter loop with:
  `userModel.find({ category, mood: true, _id: { $ne: userId } })`

- [ ] **#19 Move filtering to MongoDB** — `controllers/filter.js`
  All posts loaded into Node then filtered with `.includes()`. Use MongoDB query operators instead.

- [ ] **#20 Add DB indexes** — `models/users.js`, `models/post.js`
  ```js
  userSchema.index({ email: 1 }, { unique: true });
  userSchema.index({ nid: 1 });
  userSchema.index({ category: 1 });
  postSchema.index({ category: 1, createdAt: -1 });
  ```

### Code Structure

- [ ] **#21 Split monolithic route file** — `routes/auth.js`
  50+ endpoints in one file. Split into:
  - `routes/auth.js` (login, register, logout, password reset)
  - `routes/posts.js`
  - `routes/profiles.js`
  - `routes/admin.js`
  - `routes/notifications.js`
  - `routes/bids.js`

- [ ] **#22 Create auth middleware** — new `middleware/requireAuth.js`
  Extract the repeated `if (!req.session.user_id) return res.status(401)...` into a single middleware applied per route group.

- [ ] **#23 Create global error handling middleware** — `index.js`
  Replace scattered try/catch returns with a single `app.use((err, req, res, next) => {...})` at the end of the middleware chain.

- [ ] **#24 Add input validation library**
  Replace manual `if(fname.length == 0)` checks with `express-validator` or `zod` schemas.

- [ ] **#25 Remove dead code**
  - `controllers/registration.controller.js` — commented-out old logic blocks
  - `models/image.js` — defined but never imported
  - `hbs` and `mailgen` in root `package.json` — unused dependencies

---

## 🟡 MEDIUM PRIORITY

### Database / Models

- [ ] **#26 Fix duplicate schema** — `models/users.js` + `models/verify.js`
  Identical field definitions. Share a base schema definition.

- [ ] **#27 Add timestamps to all schemas**
  Add `{ timestamps: true }` to schema options — gives `createdAt` and `updatedAt` for free.

- [ ] **#28 Add required + unique constraints to user schema**
  `email` should be `required: true, unique: true, lowercase: true`.
  `password` should have `minlength` validation.

- [ ] **#29 Replace `Math.random()` everywhere with `crypto.randomBytes()`**
  Used for password reset codes. Not cryptographically secure.

- [ ] **#30 Migrate image storage away from MongoDB Buffer**
  Store images in `/uploads/` (already done via Multer) and save only the relative path string in the user document. Serve via the existing static middleware. Eliminates bloated documents and slow Base64 JSON transfers.

### Frontend

- [ ] **#31 Add React Error Boundary**
  Wrap the router (or major page sections) in an `<ErrorBoundary>` so uncaught render errors show a fallback UI instead of a blank screen.

- [ ] **#32 Memoize image data conversion** — `components/AuthNavbar.jsx`
  Wrap the byte-by-byte Base64 conversion in `useMemo(() => {...}, [user.img])`.

- [ ] **#33 Fix hardcoded API fallback URL** — `client/src/services/api.js`
  The `|| 'http://localhost:3000/api'` fallback silently hides a missing env var in production. Throw instead if `VITE_API_BASE_URL` is not set.

- [ ] **#34 Add accessibility attributes**
  Add `htmlFor` + `id` pairs, `aria-label`, and `aria-describedby` to form inputs in `RegisterPage.jsx`, `LoginPage.jsx`, `EditProfileModal.jsx`.

### Configuration

- [ ] **#35 Create `.env.example`**
  Document all required environment variables with placeholder values so new developers know what to set up.

- [ ] **#36 Validate env vars at startup** — `index.js`
  Add a check before the app starts:
  ```js
  const required = ['DATABASE', 'SESSION_SECRET', 'EMAIL_USER', 'EMAIL_PASS'];
  required.forEach(k => { if (!process.env[k]) throw new Error(`Missing env var: ${k}`); });
  ```

- [ ] **#37 Move CORS origins to env var** — `index.js`
  `["http://localhost:5173", "http://localhost:5174"]` hardcoded. Use `process.env.CORS_ORIGINS.split(',')`.

---

## 🟢 LOW PRIORITY / POLISH

- [ ] **#38 Add a test suite**
  No tests exist. Start with Jest + Supertest for API integration tests on auth and post endpoints.

- [ ] **#39 Add request logging** — `index.js`
  Install `morgan` and add `app.use(morgan('combined'))` for HTTP request logs.

- [ ] **#40 Standardize naming conventions**
  - Routes: use kebab-case (`/post-detail`, `/update-bid`)
  - Controllers/functions: camelCase throughout
  - Remove magic strings/numbers — define constants for NID length (10), phone length (11), etc.

- [ ] **#41 Add structured logging**
  Replace all `console.log` / `console.error` with a proper logger (Winston or Pino) that supports log levels and structured output.

- [ ] **#42 Add no-bid history collection**
  Currently only the winning (lowest) bid is stored on the post. Create a `bids` collection to preserve the full bid history per post.

- [ ] **#43 Delete legacy files**
  `client/public/` and `client/src/newui/` — unused HBS-era files noted in CLAUDE.md as safe to delete.

- [ ] **#44 Add `engines` field to package.json**
  Specify the Node.js version requirement: `"engines": { "node": ">=18.0.0" }`.

- [ ] **#45 Add Prettier for consistent formatting**
  Backend has no formatter configured. Add `.prettierrc` and `format` script.

---

## Summary

| Priority | Count | Done |
|---|---|---|
| 🔴 Critical | 12 | 0 |
| 🟠 High | 13 | 0 |
| 🟡 Medium | 9 | 0 |
| 🟢 Low | 8 | 0 |
| **Total** | **42** | **0** |
