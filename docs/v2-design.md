# Free-To-Work v2 Full System Design

> Last updated: 2026-03-10
> Status: Design phase

---

## 1. System Requirements

### 1.1 Functional Requirements

**Guest (unauthenticated)**
- Browse and search/filter job posts
- View post details and bid summary (lowest bid amount, bid count)
- View public user profiles (ratings, reviews, posted jobs)
- Register and verify email
- Login

**Regular User**
- All guest capabilities
- Create, edit, delete own job posts
- Set bid deadline on own posts
- Place or update a bid on any post (not own post)
- View own bid history
- View full bid list on own posts (bidder username + amount + message)
- View only bid amounts (not usernames) on others' posts
- Edit own profile (avatar, cover, bio, location, categories)
- Leave a review for another user (one per pair)
- Report a user
- Control notification preferences (which job categories to get notified about)
- Mark notifications as read
- Change password, reset forgotten password

**Admin**
- All user capabilities
- View all users with search/filter
- Block/unblock a user
- Manage reports (review, resolve)
- Manage job categories (create, edit, activate/deactivate)

### 1.2 Non-Functional Requirements

| Requirement | Target |
|---|---|
| Users | Thousands (design for 10k, structure for horizontal scale) |
| Uptime | Best-effort (free tier, no SLA) |
| Auth | Session-based with PostgreSQL session store |
| Images | Supabase Storage (CDN-backed, not stored in DB) |
| Input validation | Server-side (Zod) on all endpoints |
| Rate limiting | In-memory (swap to Redis when scaling) |
| Pagination | Cursor-based on all list endpoints |
| Location | Bangladesh only (division → district → upazila) |

---

## 2. Tech Stack

### Backend
| Concern | Choice | Reason |
|---|---|---|
| Runtime | Node.js (CommonJS) | Continuity with v1 |
| Framework | Express.js | Familiar, simple |
| Database | PostgreSQL (Supabase) | ACID, relational integrity |
| ORM/Query builder | `pg` + raw SQL | No ORM overhead; learn SQL properly |
| Session store | `connect-pg-simple` | Sessions in same PostgreSQL DB |
| Validation | `zod` | Schema-first, reusable |
| File upload | `multer` + Supabase Storage SDK | Files go to cloud, not disk |
| Email | `nodemailer` (Gmail SMTP) | Same as v1 |
| Password | `bcrypt` (12 rounds) | Same as v1 |
| Rate limiting | `express-rate-limit` | In-memory, swap to Redis store later |
| Real-time bids | `ws` (raw WebSocket) | Learn fundamentals; socket.io hides too much |
| Event system | Node.js `EventEmitter` | Decouples side-effects; swap to BullMQ later |
| Redis (Phase 5+) | Upstash (serverless, free tier) | Sessions, rate limit, cache, job queue |

### Frontend
| Concern | Choice |
|---|---|
| Framework | React 19 + Vite |
| Routing | React Router v7 |
| HTTP | Axios |
| UI | Tailwind CSS + shadcn/ui (or RSuite) |
| State | React Context (Auth) + local state |
| Validation | Zod (shared schemas with backend via shared package or copy) |

### Deployment (Free Tier)
| Layer | Service | Free Tier Limit |
|---|---|---|
| Database + Storage | Supabase | 500MB DB, 1GB storage |
| Backend (Express) | Render.com | Sleeps after 15min inactivity |
| Frontend | Vercel | Unlimited static hosting |

> **Note:** Supabase does not host Express apps. Use Render for Express + Supabase for DB and Storage.

---

## 3. Database Design (PostgreSQL)

### 3.1 Location Reference Tables (seeded, read-only)

```sql
CREATE TABLE divisions (
    id   SMALLINT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE districts (
    id          SMALLINT PRIMARY KEY,
    division_id SMALLINT NOT NULL REFERENCES divisions(id),
    name        VARCHAR(100) NOT NULL
);

CREATE TABLE upazilas (
    id          SMALLINT PRIMARY KEY,  -- replaces "station"
    district_id SMALLINT NOT NULL REFERENCES districts(id),
    name        VARCHAR(100) NOT NULL
);
```

### 3.2 Categories (admin-managed)

```sql
CREATE TABLE categories (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL UNIQUE,
    slug       VARCHAR(100) NOT NULL UNIQUE,
    is_active  BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.3 Users

```sql
CREATE TABLE users (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email                VARCHAR(255) NOT NULL UNIQUE,
    password_hash        VARCHAR(255) NOT NULL,
    first_name           VARCHAR(100) NOT NULL,
    last_name            VARCHAR(100) NOT NULL,
    phone                VARCHAR(20),
    nid                  VARCHAR(20),
    gender               VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),

    -- Location
    division_id          SMALLINT REFERENCES divisions(id),
    district_id          SMALLINT REFERENCES districts(id),
    upazila_id           SMALLINT REFERENCES upazilas(id),

    -- Profile
    bio                  TEXT,
    avatar_url           TEXT,   -- Supabase Storage URL
    cover_url            TEXT,   -- Supabase Storage URL

    -- Reputation (denormalized cache, updated on review insert/delete)
    rating               DECIMAL(3,1) DEFAULT 0,
    review_count         INTEGER DEFAULT 0,

    -- Flags
    is_admin             BOOLEAN DEFAULT false,
    is_active            BOOLEAN DEFAULT true,     -- false = blocked
    is_verified          BOOLEAN DEFAULT false,    -- email verified
    notifications_on     BOOLEAN DEFAULT true,

    created_at           TIMESTAMPTZ DEFAULT NOW(),
    updated_at           TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_is_active ON users(is_active);
```

### 3.4 User Category Preferences (for notifications)

```sql
CREATE TABLE user_category_preferences (
    user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, category_id)
);
```

### 3.5 Posts

```sql
CREATE TYPE post_status AS ENUM ('open', 'closed');

CREATE TABLE posts (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title        VARCHAR(255) NOT NULL,
    description  TEXT NOT NULL,
    category_id  INTEGER NOT NULL REFERENCES categories(id),
    budget       DECIMAL(10,2) NOT NULL CHECK (budget > 0),

    -- Location
    division_id  SMALLINT REFERENCES divisions(id),
    district_id  SMALLINT REFERENCES districts(id),
    upazila_id   SMALLINT REFERENCES upazilas(id),

    -- Bidding
    bid_deadline TIMESTAMPTZ NOT NULL,
    status       post_status DEFAULT 'open',

    -- Denormalized bid cache (updated on bid insert/update/delete)
    bid_count    INTEGER DEFAULT 0,
    lowest_bid   DECIMAL(10,2),      -- best bid summary shown to everyone

    created_at   TIMESTAMPTZ DEFAULT NOW(),
    updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_category ON posts(category_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_bid_deadline ON posts(bid_deadline);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
-- Composite for feed query (filter by category + status, sort by time)
CREATE INDEX idx_posts_feed ON posts(status, category_id, created_at DESC);
```

> **Status transition**: `open` → `closed` happens automatically when `bid_deadline` passes.
> A cron job (or computed on query) handles this. No manual status change by users.

### 3.6 Bids

```sql
CREATE TABLE bids (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id    UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    bidder_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount     DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    message    TEXT,                 -- optional note from bidder to post author
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(post_id, bidder_id)       -- one active bid per user per post
);

-- Indexes
CREATE INDEX idx_bids_post ON bids(post_id);
CREATE INDEX idx_bids_bidder ON bids(bidder_id);
CREATE INDEX idx_bids_post_amount ON bids(post_id, amount ASC);  -- for sorting by price
```

> **Bid rules**:
> - One bid per user per post (UPDATE replaces existing bid)
> - No amount restriction — user can bid any price
> - Bidding closes when `bid_deadline` passes (enforced server-side)
> - Post author sees: all bids with bidder username + amount + message
> - Other users see: amounts only, no username

### 3.7 Reviews

```sql
CREATE TABLE reviews (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reviewer_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reviewee_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating       SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment      TEXT CHECK (char_length(comment) <= 1000),
    created_at   TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(reviewer_id, reviewee_id),             -- one review per pair
    CHECK (reviewer_id <> reviewee_id)            -- no self-review at DB level
);

CREATE INDEX idx_reviews_reviewee ON reviews(reviewee_id);
```

> On insert/delete of a review, update `users.rating` and `users.review_count` via a
> PostgreSQL trigger OR application-level recalculation in the same transaction.

### 3.8 Notifications

```sql
CREATE TABLE notifications (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type         VARCHAR(50) NOT NULL,   -- 'new_post', 'bid_closed'
    title        VARCHAR(255) NOT NULL,
    body         TEXT,
    reference_id UUID,                  -- post_id that triggered this
    is_read      BOOLEAN DEFAULT false,
    created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read, created_at DESC);
```

### 3.9 Reports

```sql
CREATE TYPE report_status AS ENUM ('pending', 'reviewed', 'resolved');

CREATE TABLE reports (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reported_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reason           TEXT NOT NULL,
    status           report_status DEFAULT 'pending',
    admin_note       TEXT,
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reports_status ON reports(status, created_at DESC);
```

### 3.10 Auth: Email Verification & Password Reset

```sql
CREATE TABLE email_verifications (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token      VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE password_resets (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token      VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,      -- 1 hour TTL
    used_at    TIMESTAMPTZ,               -- null = not yet used
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.11 Sessions (express-session store)

```sql
-- Managed automatically by connect-pg-simple
CREATE TABLE session (
    sid    VARCHAR NOT NULL PRIMARY KEY,
    sess   JSON NOT NULL,
    expire TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_session_expire ON session(expire);
```

---

## 4. API Design

Base URL: `/api/v1`

All responses follow this envelope:
```json
{ "success": true,  "data": { ... } }
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [...] } }
```

### 4.1 Auth

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | No | Submit registration (sends verification email) |
| GET | `/auth/verify-email/:token` | No | Verify email, activate account |
| POST | `/auth/resend-verification` | No | Resend verification email |
| POST | `/auth/login` | No | Login → sets session cookie |
| POST | `/auth/logout` | Yes | Destroy session |
| GET | `/auth/me` | Yes | Get current session user |
| POST | `/auth/forgot-password` | No | Send password reset email |
| POST | `/auth/reset-password` | No | Reset password with token |
| PATCH | `/auth/change-password` | Yes | Change password (knows old password) |

### 4.2 Posts

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/posts` | No | List posts (paginated, filterable) |
| POST | `/posts` | Yes | Create post |
| GET | `/posts/:id` | No | Get post detail |
| PATCH | `/posts/:id` | Yes (owner) | Edit post (only if no bids yet) |
| DELETE | `/posts/:id` | Yes (owner/admin) | Delete post |

**Query params for `GET /posts`:**
```
?category=<id>
&division=<id>
&district=<id>
&upazila=<id>
&status=open|closed
&q=<search text>
&budget_min=<number>
&budget_max=<number>
&limit=20
&cursor=<last_seen_created_at>_<last_seen_id>   ← cursor-based pagination
```

### 4.3 Bids

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/posts/:id/bids` | No* | Get bids for a post |
| POST | `/posts/:id/bids` | Yes | Place or update a bid |
| DELETE | `/posts/:id/bids` | Yes (bidder) | Retract own bid (only if post open) |

*Bid visibility logic on `GET /posts/:id/bids`:
- If caller is the post author → return all bids with `{ amount, message, bidder: { id, name, avatar, rating } }`
- If caller is anyone else (including guest) → return `{ amount }` only, no bidder info

### 4.4 Users

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/users/:id` | No | Public profile |
| GET | `/users/:id/posts` | No | User's job posts (paginated) |
| GET | `/users/:id/reviews` | No | User's received reviews |
| PATCH | `/users/me` | Yes | Update own profile |
| POST | `/users/me/avatar` | Yes | Upload avatar |
| POST | `/users/me/cover` | Yes | Upload cover image |
| GET | `/users/me/bids` | Yes | Own bid history (paginated) |
| GET | `/users/me/notifications` | Yes | Notifications (paginated) |
| PATCH | `/users/me/notifications/read-all` | Yes | Mark all as read |
| GET | `/users/me/notification-preferences` | Yes | Category preferences |
| PUT | `/users/me/notification-preferences` | Yes | Update preferences |

### 4.5 Reviews

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/users/:id/reviews` | Yes | Leave a review |
| DELETE | `/reviews/:id` | Yes (owner) | Delete own review |

### 4.6 Reports

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/users/:id/report` | Yes | Report a user |

### 4.7 Location (seeded reference data, cached)

| Method | Path | Description |
|---|---|---|
| GET | `/location/divisions` | All divisions |
| GET | `/location/districts?division=<id>` | Districts in a division |
| GET | `/location/upazilas?district=<id>` | Upazilas in a district |

### 4.8 Categories

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/categories` | No | All active categories |

### 4.9 Admin

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/admin/users` | Admin | List users (paginated, filterable) |
| PATCH | `/admin/users/:id/block` | Admin | Block/unblock user |
| GET | `/admin/reports` | Admin | List reports by status |
| PATCH | `/admin/reports/:id` | Admin | Update report (status, admin note) |
| GET | `/admin/categories` | Admin | All categories (incl. inactive) |
| POST | `/admin/categories` | Admin | Create category |
| PATCH | `/admin/categories/:id` | Admin | Edit category |

---

## 5. Backend Architecture

### 5.1 Folder Structure

```
/
├── src/
│   ├── index.js                  # Entry: load config, connect DB, start server
│   ├── app.js                    # Express app setup, middleware, route mounting
│   ├── config/
│   │   └── index.js              # Validate + export all env vars
│   ├── db/
│   │   ├── pool.js               # pg Pool singleton
│   │   └── migrations/           # SQL migration files (001_init.sql, etc.)
│   ├── routes/
│   │   ├── index.js              # Mount all routers at /api/v1
│   │   ├── auth.routes.js
│   │   ├── posts.routes.js
│   │   ├── bids.routes.js
│   │   ├── users.routes.js
│   │   ├── reviews.routes.js
│   │   ├── reports.routes.js
│   │   ├── location.routes.js
│   │   ├── categories.routes.js
│   │   └── admin.routes.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── posts.controller.js
│   │   ├── bids.controller.js
│   │   ├── users.controller.js
│   │   ├── reviews.controller.js
│   │   ├── reports.controller.js
│   │   ├── location.controller.js
│   │   ├── categories.controller.js
│   │   └── admin.controller.js
│   ├── middleware/
│   │   ├── requireAuth.js        # Session check, attaches req.user
│   │   ├── requireAdmin.js       # Checks req.user.is_admin
│   │   ├── validate.js           # Zod validation factory
│   │   ├── rateLimiter.js        # express-rate-limit configs
│   │   ├── uploadMiddleware.js   # multer (memory storage) for Supabase upload
│   │   └── errorHandler.js       # Global error handler
│   ├── events/
│   │   ├── emitter.js            # Node EventEmitter singleton (swap for BullMQ later)
│   │   └── handlers/
│   │       ├── notification.handler.js  # listens to 'post.created' → fan-out
│   │       └── email.handler.js         # listens to 'user.registered', etc.
│   ├── services/
│   │   ├── auth.service.js       # bcrypt, token generation
│   │   ├── email.service.js      # nodemailer templates
│   │   ├── storage.service.js    # Supabase Storage upload/delete
│   │   ├── notification.service.js  # fan-out logic (called by event handler)
│   │   ├── post.service.js       # bid cache update, deadline close
│   │   └── ws.service.js         # postRooms map, subscribe, broadcast
│   ├── validators/
│   │   ├── auth.validator.js     # Zod schemas for auth endpoints
│   │   ├── post.validator.js
│   |   |── bid.validator.js
│   │   └── user.validator.js
��   └── utils/
│       ├── response.js           # sendSuccess(), sendError() helpers
│       ├── pagination.js         # cursor encode/decode helpers
│       └── AppError.js           # Custom error class with status code
├── seeds/
│   ├── divisions.sql
│   ├── districts.sql
│   ├── upazilas.sql
│   └── categories.sql
|── .env.example
└── package.json
```

### 5.2 Key Middleware Stack (in order)

```
Request
  → cors
  → express.json()
  → express-session (pg store)
  → rateLimiter (per-route)
  → route handler
    → validate(schema)    Zod
    → requireAuth        if protected
    → requireAdmin       ← if admin-only
    → controller
  → errorHandler         ← catches all throws
```

### 5.3 Standardized Error Handling

```js
// utils/AppError.js
class AppError extends Error {
    constructor(message, statusCode, code) {
        super(message);
        this.statusCode = statusCode;  // 400, 401, 403, 404, 409, 500
        this.code = code;              // 'VALIDATION_ERROR', 'NOT_FOUND', etc.
    }
}

// middleware/errorHandler.js
function errorHandler(err, req, res, next) {
    const status = err.statusCode || 500;
    res.status(status).json({
        success: false,
        error: { code: err.code || 'INTERNAL_ERROR', message: err.message }
    });
}
```

### 5.4 Bid Cache Strategy

When a bid is inserted, updated, or deleted, the `posts` table cache columns are updated in the **same DB transaction**:

```sql
-- After bid upsert on post <post_id>:
UPDATE posts SET
    bid_count  = (SELECT COUNT(*) FROM bids WHERE post_id = $1),
    lowest_bid = (SELECT MIN(amount) FROM bids WHERE post_id = $1),
    updated_at = NOW()
WHERE id = $1;
```

This keeps `lowest_bid` and `bid_count` always consistent without expensive live aggregation on every post list query.

### 5.5 Post Auto-Close Strategy

Simple approach (no cron required): check `bid_deadline` in the query.
```sql
-- In the posts query, compute status dynamically:
SELECT *,
    CASE WHEN bid_deadline < NOW() THEN 'closed' ELSE status END AS computed_status
FROM posts;
```

For the `status` column in the DB: update to `'closed'` lazily when the post is fetched/viewed after deadline, or run a daily cleanup job.

### 5.6 Rate Limiting Config

```js
const loginLimiter    = rateLimit({ windowMs: 15min, max: 10 });   // 10 attempts/15min
const registerLimiter = rateLimit({ windowMs: 60min, max: 5  });   // 5 accounts/hr/IP
const bidLimiter      = rateLimit({ windowMs: 1min,  max: 10 });   // 10 bids/min
const globalLimiter   = rateLimit({ windowMs: 1min,  max: 100 });  // 100 req/min/IP
```

### 5.7 WebSocket Architecture (Live Bid Updates)

**Library:** `ws` — raw WebSocket, no abstraction layer.

**How it works:**

```
Client opens PostDetailPage
  1. HTTP GET /posts/:id          → loads post + initial bids
  2. WS upgrade: ws://host/ws     → persistent connection established
  3. Client sends: { type: 'subscribe', postId: '<id>' }
  4. Server registers client in postRooms[postId]
  5. Another user places a bid via POST /posts/:id/bids
  6. Server broadcasts to all clients in postRooms[postId]
  7. Client updates bid list in UI without reload
  8. Client leaves page → WS close → server removes from room
```

**Server-side room tracking:**

```js
// ws.service.js
const postRooms = new Map()   // Map<postId, Set<WebSocket>>

function subscribe(ws, postId) {
    if (!postRooms.has(postId)) postRooms.set(postId, new Set())
    postRooms.get(postId).add(ws)
}

function unsubscribe(ws, postId) {
    postRooms.get(postId)?.delete(ws)
}

function broadcastNewBid(postId, bid, authorId) {
    const room = postRooms.get(postId)
    if (!room) return
    for (const client of room) {
        if (client.readyState !== WebSocket.OPEN) continue
        // Visibility: author sees full bid, others see amount only
        const payload = client.userId === authorId
            ? { type: 'new_bid', bid }                          // full data
            : { type: 'new_bid', bid: { amount: bid.amount } }  // amount only
        client.send(JSON.stringify(payload))
    }
}
```

**Auth on WebSocket handshake:**

```js
// Parse session cookie during upgrade — before connection is accepted
// attach req.session.user to the ws client object
wss.on('connection', (ws, req) => {
    ws.userId = req.session?.userId ?? null   // null = guest
})
```

**Frontend hook:**

```js
// hooks/useBidSocket.js
// Opens WS, subscribes to postId, appends incoming bids to local state
// Closes WS cleanly on unmount (React useEffect cleanup)
```

**Scalability note:** Single-instance only. If ever scaled horizontally, replace `postRooms` Map with Redis pub/sub — the `broadcastNewBid` interface stays the same, only the backing implementation changes.

---

## 6. Frontend Architecture

### 6.1 Folder Structure

```
client/src/
├── App.jsx
├── main.jsx
├── layouts/
│   ├── RootLayout.jsx     # Navbar + Outlet
│   └── AuthLayout.jsx     # ProtectedRoute wrapper
├── pages/
│   ├── LandingPage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── FeedPage.jsx
│   ├── PostDetailPage.jsx   # Dedicated page for post + bids
│   ├── ProfilePage.jsx
│   ├── MyBidsPage.jsx       # Own bid history
│   ├── NotificationsPage.jsx
│   ├── AdminPage.jsx
│   └── NotFoundPage.jsx
├── components/
│   ├── posts/
│   ���   ├── PostCard.jsx
│   │   ├── PostFilters.jsx
│   │   ├── CreatePostModal.jsx
│   │   ├── BidList.jsx          # Author sees names; others see amounts only
│   │   └── BidForm.jsx
│   ├── profile/
│   │   ├── ProfileHeader.jsx
│   │   ├── EditProfileModal.jsx
│   │   ├── ReviewCard.jsx
│   │   └── UserPostsList.jsx
│   ├── admin/
│   │   ├── UsersTable.jsx
│   │   └── ReportsTable.jsx
│   └── common/
│       ├── Navbar.jsx
│       ├── Pagination.jsx        # Cursor-based
│       ├── LoadingSpinner.jsx
│       ├── ErrorBoundary.jsx
│       ├── StarRating.jsx
│       └── LocationSelector.jsx  # Division → District → Upazila cascading
├── context/
│   └── AuthContext.jsx    # user, isAdmin, loading; checks /auth/me on mount
├── hooks/
│   ├── useAuth.js
│   ├── useBidSocket.js      # WS connection for live bid updates on PostDetailPage
│   └── useInfiniteScroll.js
├── services/
│   └── api.js             # Axios instance with interceptors
└── utils/
    ├── locationData.js    # Division/district/upazila tree
    └── constants.js       # Shared enums, limits
```

### 6.2 Route Structure

```jsx
<Routes>
  {/* Public */}
  <Route path="/" element={<LandingPage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
  <Route path="/posts/:id" element={<PostDetailPage />} />
  <Route path="/users/:id" element={<ProfilePage />} />

  {/* Protected */}
  <Route element={<AuthLayout />}>
    <Route path="/feed" element={<FeedPage />} />
    <Route path="/my-bids" element={<MyBidsPage />} />
    <Route path="/notifications" element={<NotificationsPage />} />
    <Route path="/settings" element={<SettingsPage />} />
  </Route>

  {/* Admin */}
  <Route element={<AdminLayout />}>
    <Route path="/admin" element={<AdminPage />} />
  </Route>

  <Route path="*" element={<NotFoundPage />} />
</Routes>
```

### 6.3 Auth Context

```jsx
// Polls /auth/me once on mount and on window focus (to detect session expiry)
// Also re-checks after any 401 response via Axios interceptor
```

---

## 7. Security Checklist

| Threat | Mitigation |
|---|---|
| SQL injection | Parameterized queries only (`pg` with `$1, $2` params) |
| XSS | React escapes by default; no dangerouslySetInnerHTML |
| CSRF | `sameSite: 'lax'` cookie + checking `Origin` header on state-changing routes |
| Brute force login | Rate limiter (10 attempts/15min per IP) |
| Arbitrary file upload | multer: MIME whitelist (image/jpeg, image/png, image/webp), 2MB limit |
| Admin plaintext password | Admin is a `is_admin` flag in DB; no hardcoded env credentials |
| Session fixation | `req.session.regenerate()` after login |
| Insecure password reset | Cryptographically random token, 1hr expiry, single-use |
| ReDoS in search | Escape regex chars before constructing `ILIKE` query |
| Sensitive data in logs | Never log passwords, tokens, or session IDs |

---

## 8. Category System (Redesigned)

Replace the single `category` string field with a structured, admin-managed table.

**Proposed initial categories for Bangladesh job market:**

| Slug | Name |
|---|---|
| construction | Construction & Repair |
| electrical | Electrical Work |
| plumbing | Plumbing |
| cleaning | Cleaning & Housekeeping |
| it-tech | IT & Technology |
| design | Design & Creative |
| writing | Writing & Translation |
| tutoring | Tutoring & Education |
| delivery | Delivery & Transport |
| cooking | Cooking & Catering |
| tailoring | Tailoring & Sewing |
| gardening | Gardening & Landscaping |
| security | Security & Guard |
| healthcare | Healthcare & Caregiving |
| other | Other |

Admin can add/deactivate categories at any time. Users subscribe to categories for notifications.

---

## 9. Implementation Phases

### Phase 1 — Foundation (Backend + DB)
- [ ] PostgreSQL schema migrations (all tables)
- [ ] Seed data: divisions, districts, upazilas, categories
- [ ] Express app setup: config, session, CORS, error handler
- [ ] Auth endpoints: register, verify email, login, logout, me
- [ ] Password reset flow
- [ ] `requireAuth` and `requireAdmin` middleware
- [ ] Zod validators for all auth inputs
- [ ] Rate limiters on auth routes
- [ ] Standardized response helpers

### Phase 2 — Core Features
- [ ] Posts CRUD (create, list with pagination + filters, detail, delete)
- [ ] Bids: place/update/retract, bid visibility rules (author vs others)
- [ ] Bid cache update (bid_count, lowest_bid on posts table)
- [ ] User profile: view, edit, avatar/cover upload to Supabase Storage
- [ ] Reviews: create, list (with rating cache update in transaction)
- [ ] Location endpoint (divisions/districts/upazilas)
- [ ] Categories endpoint

### Phase 3 — Notifications & Admin
- [ ] EventEmitter singleton + register all handlers on startup
- [ ] `post.created` event → notification fan-out handler (async, non-blocking)
- [ ] `user.registered` event → email handler (verify email)
- [ ] Notification list + mark-as-read
- [ ] User notification preferences (category subscriptions)
- [ ] Reports: create, admin list, admin update
- [ ] Admin: user list, block/unblock
- [ ] Admin: category management
- [ ] Post auto-close: lazy update on fetch + optional cleanup query

### Phase 4 — Frontend
- [ ] React setup: Vite, React Router, Axios, Tailwind
- [ ] AuthContext: session check, login/logout flows
- [ ] Landing page
- [ ] Login / Register pages
- [ ] Feed page with filters + cursor pagination
- [ ] Post detail page: bids (visibility logic)
- [ ] Create post modal/form
- [ ] Profile page: own vs others, edit, reviews
- [ ] My Bids page
- [ ] Notifications page
- [ ] Admin dashboard
- [ ] Error boundary, loading states, toast notifications

### Phase 5 — Hardening + Redis
- [ ] File upload validation (MIME, size)
- [ ] CSRF mitigation (Origin header check or csurf)
- [ ] Input sanitization audit
- [ ] Missing index audit
- [ ] 404 and error page polish
- [ ] Upstash Redis setup (REDIS_URL env var)
- [ ] Swap rate limiters to Redis store (`rate-limit-redis`)
- [ ] Swap session store to Redis (`connect-redis`)
- [ ] Add Redis cache for location + category endpoints
- [ ] Swap EventEmitter for BullMQ (persistent job queue)
- [ ] Environment variable documentation

### Phase 6 — Deployment
- [ ] Supabase project: PostgreSQL + Storage bucket setup
- [ ] Run migrations on Supabase
- [ ] Render: deploy Express backend (env vars, start command)
- [ ] Vercel: deploy React frontend (set VITE_API_URL)
- [ ] Smoke test all endpoints in production

---

## 10. Event-Driven Architecture

### 10.1 Why Event-Driven

Without events, controllers have mixed responsibilities:
```js
// Without events — controller does too much
async function createPost(req, res) {
    const post = await db.query(...)       // core responsibility
    await notifyUsers(post)                // side-effect
    await sendEmailDigest(post)            // side-effect
    res.json(post)
}
```

With events, the controller only does its job. Side-effects are decoupled:
```js
// With events — clean separation
async function createPost(req, res) {
    const post = await db.query(...)
    emitter.emit('post.created', post)     // fire and forget
    res.json(post)
}
// Handlers run independently, don't block the response
```

### 10.2 Implementation: Node EventEmitter (v2)

```js
// src/events/emitter.js
const EventEmitter = require('events')
const emitter = new EventEmitter()
module.exports = emitter
```

```js
// src/events/handlers/notification.handler.js
const emitter = require('../emitter')
const notificationService = require('../../services/notification.service')

emitter.on('post.created', async (post) => {
    await notificationService.fanOut(post)
})
```

```js
// src/index.js — register all handlers on startup
require('./events/handlers/notification.handler')
require('./events/handlers/email.handler')
```

**Events emitted in v2:**

| Event | Emitted by | Handled by |
|---|---|---|
| `post.created` | posts.controller | notification.handler |
| `user.registered` | auth.controller | email.handler (sends verify email) |
| `password.reset.requested` | auth.controller | email.handler (sends reset email) |

### 10.3 Upgrade Path: BullMQ + Redis (v2.1+)

When the app needs reliability (retries on failure, persistence across restarts), swap `EventEmitter` for BullMQ. **Only `emitter.js` changes** — handlers and controllers stay the same:

```js
// src/events/emitter.js — upgraded version
const { Queue } = require('bullmq')
const connection = { host: UPSTASH_HOST, port: UPSTASH_PORT, password: UPSTASH_PASSWORD }

const queues = {
    notifications: new Queue('notifications', { connection }),
    emails:        new Queue('emails', { connection }),
}

// Same interface as EventEmitter
const emitter = {
    emit(event, data) {
        if (event === 'post.created')           queues.notifications.add(event, data)
        if (event === 'user.registered')        queues.emails.add(event, data)
        if (event === 'password.reset.requested') queues.emails.add(event, data)
    }
}

module.exports = emitter
```

Benefits gained:
- Jobs survive server restarts (persisted in Redis)
- Automatic retry on failure (with backoff)
- Job dashboard (Bull Board UI)
- Delayed jobs (e.g. send reminder 24h after post closes)

---

## 11. Redis Strategy

**Provider:** Upstash (serverless Redis, free tier: 10k commands/day, 256MB)

### 11.1 What Redis Unlocks (in order of priority)

**1. Rate limiting across restarts (Phase 5)**
```js
// rateLimiter.js
const RedisStore = require('rate-limit-redis')
const loginLimiter = rateLimit({
    store: new RedisStore({ client: redisClient }),
    windowMs: 15 * 60 * 1000,
    max: 10,
})
```
Currently in-memory — lost on restart. Redis persists it.

**2. Caching near-static data (Phase 5)**

Divisions, districts, upazilas, and categories rarely change. Cache them in Redis:
```js
// Location endpoint
const cached = await redis.get('divisions')
if (cached) return JSON.parse(cached)
const rows = await db.query('SELECT * FROM divisions')
await redis.setex('divisions', 86400, JSON.stringify(rows))  // TTL: 24h
return rows
```
Eliminates DB hit on every location dropdown render.

**3. Session store (Phase 5)**
```js
// app.js
const RedisStore = require('connect-redis').default
app.use(session({
    store: new RedisStore({ client: redisClient }),
    ...
}))
```
Faster than PostgreSQL session store. Required for horizontal scaling.

**4. BullMQ job queues (Phase 5+)**
Once Redis is in, BullMQ uses it as the job backend automatically.

### 11.2 Redis Client Setup

```js
// src/config/redis.js
const { createClient } = require('redis')

const client = createClient({
    url: process.env.REDIS_URL   // Upstash Redis URL (rediss://...)
})

client.on('error', (err) => console.error('Redis error:', err))
await client.connect()

module.exports = client
```

Add to `.env.example`:
```
REDIS_URL=rediss://:password@host.upstash.io:6380
```

---

## 12. Scalability Notes

These patterns are designed-in from day one so they can be activated when needed:

| Current (v2 launch) | Phase 5 upgrade | Future (horizontal scale) |
|---|---|---|
| EventEmitter (in-process) | BullMQ + Redis (persistent jobs) | BullMQ workers on separate instances |
| In-memory rate limit | `rate-limit-redis` (Upstash) | Same, shared across instances |
| Session in PostgreSQL | Redis session store (Upstash) | Same, shared across instances |
| No cache | Redis cache for locations/categories | Same |
| Single Render instance | Single instance (free tier) | Multiple instances via Redis pub/sub |
| Supabase Storage (1GB) | Supabase paid plan | Migrate to AWS S3 |
| postRooms Map (in-memory WS) | postRooms Map (still fine) | Redis pub/sub for WS broadcast |

---

## 13. Decisions Log

| Decision | Chosen | Rejected | Reason |
|---|---|---|---|
| ORM | Raw `pg` SQL | Prisma, Mongoose | Learn SQL properly; less magic |
| Auth | Sessions (connect-pg-simple) | JWT | Simpler; instant revocation; single server |
| Image storage | Supabase Storage | MongoDB Buffer | CDN, no DB bloat, free 1GB |
| Bid model | Quote/proposal (any amount) | Auction (must be lower) | Author chooses by preference, not just price |
| Admin creation | DB flag `is_admin = true` | Env var credentials | Proper, secure, auditable |
| Pagination | Cursor-based | Offset-based | Consistent results with concurrent inserts |
| Location field | `upazila_id` FK | `station` string | Normalized, validated, filterable |
| Comments | Deferred to v2.1 | Included in v2 | Adds moderation complexity; bid message covers core need |
| Messaging | Out of scope | Included | Platform goal is bid visibility only; contact happens off-platform |
| Real-time bids | WebSockets (`ws`) | Polling, Supabase Realtime | Learning opportunity; Render is awake by the time WS connects |
| Event system | Node EventEmitter → BullMQ | Inline async calls | Decouples side-effects; same interface, swappable transport |
| Redis | Upstash (Phase 5) | From day one | Earn it when needed; free tier (10k cmd/day) is sufficient |