'use strict';

// Must be the first import — loads .env before anything else
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const required = [
    'DATABASE_URL',
    'SESSION_SECRET',
    'EMAIL_USER',
    'EMAIL_PASS',
    'SUPABASE_URL',
    'SUPABASE_SERVICE_KEY',
];

for (const key of required) {
    if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
}

module.exports = {
    port: parseInt(process.env.PORT, 10) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',

    db: {
        url: process.env.DATABASE_URL,
    },

    session: {
        secret: process.env.SESSION_SECRET,
    },

    email: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },

    supabase: {
        url: process.env.SUPABASE_URL,
        serviceKey: process.env.SUPABASE_SERVICE_KEY,
    },

    cors: {
        origins: (process.env.CORS_ORIGINS || 'http://localhost:5174').split(','),
    },

    client: {
        url: process.env.CLIENT_URL || 'http://localhost:5174',
    },
};
