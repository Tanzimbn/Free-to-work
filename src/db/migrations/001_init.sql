-- ============================================================
-- Free-To-Work v2 — Initial Schema
-- Run: psql $DATABASE_URL -f src/db/migrations/001_init.sql
-- ============================================================

-- ── Extensions ───────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";  -- gen_random_uuid()

-- ── Enums ────────────────────────────────────────────────────
CREATE TYPE post_status    AS ENUM ('open', 'closed');
CREATE TYPE report_status  AS ENUM ('pending', 'reviewed', 'resolved');

-- ── Location Reference Tables (seeded, read-only) ────────────
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
    id          SMALLINT PRIMARY KEY,
    district_id SMALLINT NOT NULL REFERENCES districts(id),
    name        VARCHAR(100) NOT NULL
);

-- ── Categories (admin-managed) ───────────────────────────────
CREATE TABLE categories (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL UNIQUE,
    slug       VARCHAR(100) NOT NULL UNIQUE,
    is_active  BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Users ────────────────────────────────────────────────────
CREATE TABLE users (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email             VARCHAR(255) NOT NULL UNIQUE,
    password_hash     VARCHAR(255) NOT NULL,
    first_name        VARCHAR(100) NOT NULL,
    last_name         VARCHAR(100) NOT NULL,
    phone             VARCHAR(20),
    nid               VARCHAR(20),
    gender            VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),

    -- Location
    division_id       SMALLINT REFERENCES divisions(id),
    district_id       SMALLINT REFERENCES districts(id),
    upazila_id        SMALLINT REFERENCES upazilas(id),

    -- Profile
    bio               TEXT,
    avatar_url        TEXT,
    cover_url         TEXT,

    -- Reputation cache (updated transactionally on review insert/delete)
    rating            DECIMAL(3,1) DEFAULT 0,
    review_count      INTEGER DEFAULT 0,

    -- Flags
    is_admin          BOOLEAN DEFAULT false,
    is_active         BOOLEAN DEFAULT true,
    is_verified       BOOLEAN DEFAULT false,
    notifications_on  BOOLEAN DEFAULT true,

    created_at        TIMESTAMPTZ DEFAULT NOW(),
    updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email     ON users(email);
CREATE INDEX idx_users_is_active ON users(is_active);

-- ── User Category Preferences ────────────────────────────────
CREATE TABLE user_category_preferences (
    user_id     UUID    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, category_id)
);

-- ── Posts ────────────────────────────────────────────────────
CREATE TABLE posts (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id    UUID    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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

    -- Denormalized bid cache
    bid_count    INTEGER DEFAULT 0,
    lowest_bid   DECIMAL(10,2),

    created_at   TIMESTAMPTZ DEFAULT NOW(),
    updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_posts_author      ON posts(author_id);
CREATE INDEX idx_posts_category    ON posts(category_id);
CREATE INDEX idx_posts_status      ON posts(status);
CREATE INDEX idx_posts_bid_deadline ON posts(bid_deadline);
CREATE INDEX idx_posts_created_at  ON posts(created_at DESC);
CREATE INDEX idx_posts_feed        ON posts(status, category_id, created_at DESC);

-- ── Bids ─────────────────────────────────────────────────────
CREATE TABLE bids (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id    UUID    NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    bidder_id  UUID    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount     DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    message    TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(post_id, bidder_id)
);

CREATE INDEX idx_bids_post        ON bids(post_id);
CREATE INDEX idx_bids_bidder      ON bids(bidder_id);
CREATE INDEX idx_bids_post_amount ON bids(post_id, amount ASC);

-- ── Reviews ──────────────────────────────────────────────────
CREATE TABLE reviews (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reviewer_id  UUID     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reviewee_id  UUID     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating       SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment      TEXT CHECK (char_length(comment) <= 1000),
    created_at   TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(reviewer_id, reviewee_id),
    CHECK (reviewer_id <> reviewee_id)
);

CREATE INDEX idx_reviews_reviewee ON reviews(reviewee_id);

-- ── Notifications ────────────────────────────────────────────
CREATE TABLE notifications (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type         VARCHAR(50)  NOT NULL,
    title        VARCHAR(255) NOT NULL,
    body         TEXT,
    reference_id UUID,
    is_read      BOOLEAN DEFAULT false,
    created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read, created_at DESC);

-- ── Reports ──────────────────────────────────────────────────
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

-- ── Email Verifications ──────────────────────────────────────
CREATE TABLE email_verifications (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token      VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ  NOT NULL,
    created_at TIMESTAMPTZ  DEFAULT NOW()
);

-- ── Password Resets ──────────────────────────────────────────
CREATE TABLE password_resets (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token      VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ  NOT NULL,
    used_at    TIMESTAMPTZ,
    created_at TIMESTAMPTZ  DEFAULT NOW()
);

-- ── Sessions (connect-pg-simple) ─────────────────────────────
CREATE TABLE IF NOT EXISTS session (
    sid    VARCHAR     NOT NULL PRIMARY KEY,
    sess   JSON        NOT NULL,
    expire TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_session_expire ON session(expire);
