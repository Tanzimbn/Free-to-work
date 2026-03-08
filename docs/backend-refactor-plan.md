# Backend Refactor Plan

## What the codebase looks like right now

Before prescribing structure, here is an honest map of every real problem found
by reading every controller and route file.

### Performance bottlenecks (user-facing slowness)

| Location | Problem | Cost |
|---|---|---|
| `post.controller.js:28` | `userModel.find()` — loads **every user** into Node, then JS-filters for category/mood | O(n) memory + full collection scan on every post creation |
| `filter.js:5` | `postModel.find({})` — loads **every post** into Node, then JS-filters with `.includes()` | Full collection scan on every newsfeed load / filter change |
| `list.controller.js:24` | `userModel.find({})` — returns **all users** to frontend with no pagination | Unbounded response |
| `profile.js:44–49` | `notiModel.find()` + JS loop to check unseen — still not fixed after Phase 1 | Unnecessary full collection scan per profile view |
| `profile.js:57` | `fs.readFileSync(...)` inside a request handler | Blocks the entire Node event loop while reading the file |
| All images | Images stored as `Buffer` inside MongoDB documents | Every user/cover query carries MB of binary data; slow JSON serialisation |

### Structural problems

| Location | Problem |
|---|---|
| `routes/auth.js` | 111 lines, 50+ endpoints — auth, posts, profiles, bids, admin, images all in one file |
| `controllers/login.controller.js` | 325-line HTML email template string embedded directly in controller logic |
| `controllers/registration.controller.js` | Another 400-line HTML email string embedded; commented-out dead code block (lines 317–337) |
| `controllers/profile.js` | Handles profile queries, image upload, cover upload, reviews, post deletion — 5 unrelated concerns |
| Every controller | Auth check (`if(!req.session.user_id)`) copy-pasted individually — no shared middleware |
| Every controller | Inconsistent `try/catch` blocks returning different error shapes (`res.send`, `res.json`, `res.status(400)`) |
| `nodemailer` config | Duplicated in `login.controller.js` and `registration.controller.js` — two independent transporter setups |
| `index.js` | `dotenv.config()` called **after** session setup — env vars not available when session middleware initialises |

---

## Target folder structure

```
/
├── index.js                        ← one job: load config, start server
├── app.js                          ← express app export (no listen — enables testing)
│
├── config/
│   └── index.js                    ← reads ALL env vars, throws at startup if any missing
│
├── middleware/
│   ├── requireAuth.js              ← single source of truth for session check → 401
│   ├── requireAdmin.js             ← role check layered on top of requireAuth → 403
│   └── errorHandler.js             ← global (err, req, res, next) handler
│
├── routes/
│   ├── index.js                    ← mounts all sub-routers under /api/v1
│   ├── auth.routes.js              ← POST /login, GET /logout, POST /register, GET /me
│   ├── posts.routes.js             ← GET /posts, POST /posts, GET /posts/:id, POST /posts/:id/bids
│   ├── users.routes.js             ← GET /users/:id, PATCH /users/me
│   ├── notifications.routes.js     ← GET /notifications
│   └── admin.routes.js             ← GET /admin/*, POST /admin/*
│
├── controllers/
│   ├── auth.controller.js
│   ├── posts.controller.js
│   ├── users.controller.js
│   ├── notifications.controller.js
│   ├── bids.controller.js
│   └── admin.controller.js
│
├── services/
│   ├── email.service.js            ← nodemailer setup + all HTML templates
│   └── notification.service.js     ← notification creation logic (called by posts controller)
│
└── models/
    └── (unchanged — one file per model is correct)
```

---

## The three principles to internalise

**1. Layers do not reach across.**
Routes map URLs to controllers. Controllers handle HTTP (read req, call service/model, send res).
Services contain business logic. Models define data shape.
A controller never builds an email. A service never reads `req.body`.

**2. One error handler, not fifty.**
Every controller passes errors to `next(err)`. One middleware formats all error
responses consistently. This replaces the current pattern of 50 different
`res.status(400).send(error)` calls.

```js
// Any controller:
exports.createPost = async (req, res, next) => {
    try {
        const post = await Post.create(req.body);
        res.status(201).json({ success: true, data: post });
    } catch (err) {
        next(err);   // ← that's it
    }
};

// middleware/errorHandler.js handles the rest:
module.exports = (err, req, res, next) => {
    const status = err.statusCode || 500;
    res.status(status).json({ success: false, error: err.message });
};
```

**3. The database is faster than Node at filtering.**
Never load a collection into memory and filter it with a JS loop.
Pass the filter to MongoDB.

---

## Phase A — Foundation (do this first, everything else builds on it)

### A1 — Fix `dotenv` order in `index.js`

Currently `dotenv.config()` is on line 22, **after** `session({secret: ...})` on line 9.
Env vars are not available when the session middleware initialises.
`dotenv.config()` must be the **first line** of the entry point.

### A2 — Create `config/index.js`

Read every required env var and throw synchronously at startup if any is missing.
The app should never start in a broken state and silently fail later.

```js
// config/index.js
require('dotenv').config();

const required = ['DATABASE', 'SESSION_SECRET', 'EMAIL_USER', 'EMAIL_PASS'];
for (const key of required) {
    if (!process.env[key]) throw new Error(`Missing required env var: ${key}`);
}

module.exports = {
    db:      process.env.DATABASE,
    session: { secret: process.env.SESSION_SECRET },
    email:   { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    cors:    { origins: (process.env.CORS_ORIGINS || 'http://localhost:5174').split(',') },
    client:  { url: process.env.CLIENT_URL || 'http://localhost:5174' },
};
```

### A3 — Create `middleware/requireAuth.js`

Replace every copy-pasted `if(!req.session.user_id)` check:

```js
// middleware/requireAuth.js
module.exports = (req, res, next) => {
    if (!req.session.user_id) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    next();
};
```

Apply it at the router level, not per-handler:
```js
// routes/posts.routes.js
router.use(requireAuth);   // ← protects every route in this file at once
router.get('/', getPosts);
router.post('/', createPost);
```

### A4 — Create `middleware/errorHandler.js`

```js
module.exports = (err, req, res, next) => {
    console.error(err);
    const status = err.statusCode || 500;
    res.status(status).json({ success: false, error: err.message || 'Internal Server Error' });
};
```

Register it as the **last** middleware in `app.js`:
```js
app.use('/api/v1', require('./routes'));
app.use(errorHandler);   // must be last
```

### A5 — Create `services/email.service.js`

Extract nodemailer config and both HTML templates out of the controllers.
Currently 300+ lines of inline HTML live inside `login.controller.js` and
`registration.controller.js`. Move them here.

```js
// services/email.service.js
const nodemailer = require('nodemailer');
const config = require('../config');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: config.email.user, pass: config.email.pass }
});

exports.sendVerificationEmail = (toEmail, verifyUrl) => { ... };
exports.sendPasswordResetEmail = (toEmail, newPassword) => { ... };
```

Controllers become two lines instead of 300:
```js
// controllers/auth.controller.js
await emailService.sendVerificationEmail(email, verifyUrl);
```

---

## Phase B — Performance fixes

### B1 — Fix notification fan-out query (`post.controller.js`)

**Before:**
```js
const user = await userModel.find()                    // full collection scan
for(let i = 0; i < user.length; i++) {
    if(user[i].category == category && user[i].mood == true ...) { ... }
}
```

**After:**
```js
const recipients = await userModel.find({
    category: req.body.category,
    mood: true,
    _id: { $ne: req.session.user_id }
}, '_id');                                             // project only _id
```

Extract this into `services/notification.service.js` so it is reusable.

### B2 — Fix post filtering (`filter.js`)

**Before:** Load all posts into Node, loop and check each field.

**After:** Build a MongoDB query object from the request body:

```js
exports.post_filter = async (req, res, next) => {
    try {
        const query = {};
        const { price_min, price_max, division, district, station, category, searchValue } = req.body;

        if (price_min) query.budget = { ...query.budget, $gte: Number(price_min) };
        if (price_max) query.budget = { ...query.budget, $lte: Number(price_max) };
        if (division)  query.division = division;
        if (district)  query.district = district;
        if (station)   query.station  = station;
        if (category)  query.category = category;
        if (searchValue) {
            query.$or = [
                { title:    { $regex: searchValue, $options: 'i' } },
                { category: { $regex: searchValue, $options: 'i' } }
            ];
        }

        const posts = await postModel.find(query).sort({ time: -1 });
        res.json({ success: true, data: posts });
    } catch (err) {
        next(err);
    }
};
```

### B3 — Fix list endpoint (`list.controller.js`)

Add pagination and DB-side filtering. Never return unbounded collections.

```js
// GET /api/v1/users?category=plumber&division=Dhaka&page=1&limit=20
exports.getWorkers = async (req, res, next) => {
    const { category, division, district, station, page = 1, limit = 20 } = req.query;
    const query = {};
    if (category) query.category = category;
    if (division) query.division = division;
    if (district) query.district = district;
    if (station)  query.station  = station;

    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
        userModel.find(query).select('-password').skip(skip).limit(Number(limit)),
        userModel.countDocuments(query)
    ]);
    res.json({ success: true, data: users, total, page: Number(page) });
};
```

### B4 — Fix profile endpoint (`profile.js`)

Two fixes:
1. Replace `notiModel.find()` + loop with `notiModel.exists()` (same fix as Phase 1 but still present in `show_profile` and `show_list`)
2. Replace `fs.readFileSync` with `await fs.promises.readFile`

```js
// profile.js — noti check
const hasUnseenNotifications = !!(await notiModel.exists({ user: req.session.user_id, unseen: true }));

// profile.js — image read
const imageData = await fs.promises.readFile('uploads/' + req.file.filename);
```

### B5 — Add MongoDB indexes

Add to each model file after the schema definition. No migration needed — Mongoose
creates indexes automatically if they do not exist.

```js
// models/users.js
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ nid: 1 });
userSchema.index({ category: 1 });
userSchema.index({ mood: 1, category: 1 });   // compound — used by notification fan-out

// models/post.js
postSchema.index({ category: 1, time: -1 });
postSchema.index({ user: 1 });
postSchema.index({ division: 1, district: 1, station: 1 });

// models/notification.js
notiSchema.index({ user: 1, unseen: 1 });
notiSchema.index({ postid: 1 });
```

---

## Phase C — Route restructure

Split `routes/auth.js` into resource-based files. Do **one file at a time** and
test each before moving to the next.

### Order to migrate (least risky first):

1. `auth.routes.js` — login, logout, register, verify, me, change_password
2. `notifications.routes.js` — GET /notifications (already created in Phase 1)
3. `posts.routes.js` — GET/POST /posts, GET /posts/:id, comments, filter
4. `users.routes.js` — GET /users/:id, PATCH /users/me, cover/image upload
5. `bids.routes.js` — POST /posts/:id/bids
6. `admin.routes.js` — all /admin/* routes

Each route file follows the same pattern:
```js
// routes/posts.routes.js
const router = require('express').Router();
const requireAuth = require('../middleware/requireAuth');
const { getPosts, createPost, getPost } = require('../controllers/posts.controller');

router.use(requireAuth);   // applies to all routes below
router.get('/',     getPosts);
router.post('/',    createPost);
router.get('/:id',  getPost);

module.exports = router;
```

```js
// routes/index.js
const router = require('express').Router();
router.use('/auth',          require('./auth.routes'));
router.use('/posts',         require('./posts.routes'));
router.use('/users',         require('./users.routes'));
router.use('/notifications', require('./notifications.routes'));
router.use('/admin',         require('./admin.routes'));
module.exports = router;
```

```js
// index.js (app entry)
app.use('/api/v1', require('./routes'));
```

---

## Phase D — Model improvements

These are low-effort, high-value changes with no application logic impact.

```js
// Add to every schema options object:
{ timestamps: true }   // gives createdAt + updatedAt for free

// users.js — add required/unique constraints
email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
password: { type: String, required: true },

// Remove models/image.js — defined but never imported anywhere (dead file)

// models/verify.js — shares identical fields with users.js
// Extract shared fields into a const baseUserFields = { fname, lname, ... }
// and spread into both schemas to eliminate duplication
```

---

## Execution order

```
Week 1:  Phase A (foundation) — no behaviour changes, just structure
Week 2:  Phase B1–B4 (performance fixes) — measurable UX improvement
Week 3:  Phase B5 + Phase C (indexes + route split) — one route file per day
Week 4:  Phase D (model cleanup) + delete dead code
```

**Rule:** never mix phases in the same commit. A commit should do one thing:
move a route file, fix a query, add middleware. Small commits are reversible.
Large mixed commits are not.

---

## What changes and what stays the same

| Stays the same | Changes |
|---|---|
| MongoDB / Mongoose | All filtering moves from Node to MongoDB |
| express-session auth | `requireAuth` middleware replaces per-handler checks |
| Nodemailer | Moves into `services/email.service.js` |
| Multer uploads | Filename generation gets `crypto.randomUUID()` fix |
| Model schemas | Indexes added, timestamps added, nothing removed |
| Frontend API calls | Routes versioned to `/api/v1/*` — update `services/api.js` base URL |