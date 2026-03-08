'use strict';
/**
 * Configuration file
 *
 * All environment variables are loaded from the .env file.
 *
 * Must be the first thing loaded in the process.
 * All other modules that need env vars import from here — never from process.env directly.
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const required = ['DATABASE', 'SESSION_SECRET', 'EMAIL_USER', 'EMAIL_PASS'];
for (const key of required) {
    if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
}

module.exports = {
    port: parseInt(process.env.PORT, 10) || 3000,

    db: {
        url: process.env.DATABASE,
    },

    session: {
        secret: process.env.SESSION_SECRET,
    },

    email: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },

    cors: {
        origins: (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:5174').split(','),
    },

    client: {
        url: process.env.CLIENT_URL || 'http://localhost:5174',
    },

    backend: {
        url: process.env.BACKEND_URL || 'http://localhost:3000/api',
    },

    // Optional — if not set, admin login is disabled
    admin: {
        email:    process.env.ADMIN_EMAIL    || null,
        password: process.env.ADMIN_PASSWORD || null,
    },
};