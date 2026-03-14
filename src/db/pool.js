'use strict';

const { Pool } = require('pg');
const config = require('../config');

const pool = new Pool({
    connectionString: config.db.url,
    ssl: { rejectUnauthorized: false }, // required for Supabase
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
    console.error('Unexpected pg pool error:', err.message);
});

module.exports = pool;
