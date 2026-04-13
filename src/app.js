'use strict';

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const pool = require('./db/pool');
const config = require('./config');
const { globalLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Trust Render/proxy forwarded headers so secure cookies work behind HTTPS
if (config.nodeEnv === 'production') {
    app.set('trust proxy', 1);
}

// ── CORS ─────────────────────────────────────────────────────
app.use(cors({
    origin: config.cors.origins,
    credentials: true,
}));

// ── Body parsing ─────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Session ──────────────────────────────────────────────────
app.use(session({
    store: new pgSession({
        pool,
        tableName: 'session',
        createTableIfMissing: false,
    }),
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: config.nodeEnv === 'production',
        httpOnly: true,
        sameSite: config.nodeEnv === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
}));

// ── Global rate limiter ───────────────────────────────────────
app.use(globalLimiter);

// ── Routes ───────────────────────────────────────────────────
app.use('/api/v1', require('./routes'));

// ── Health check ─────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// ── 404 handler ──────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Route not found' },
    });
});

// ── Global error handler (must be last) ──────────────────────
app.use(errorHandler);

module.exports = app;
