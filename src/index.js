'use strict';

// Config must load first — validates all env vars before anything else
const config = require('./config');

const http = require('http');
const { WebSocketServer } = require('ws');
const app = require('./app');
const pool = require('./db/pool');

// ── Register event handlers (side-effects only, no exports needed) ──
require('./events/handlers/notification.handler');
require('./events/handlers/email.handler');

// ── HTTP server ──────────────────────────────────────────────
const server = http.createServer(app);

// ── WebSocket server ─────────────────────────────────────────
const wss = new WebSocketServer({ server, path: '/ws' });
require('./services/ws.service').init(wss);

// ── Start ────────────────────────────────────────────────────
async function start() {
    // Verify DB connection before accepting traffic
    try {
        await pool.query('SELECT 1');
        console.log('Database connected');
    } catch (err) {
        console.error('Database connection failed:', err.message);
        process.exit(1);
    }

    server.listen(config.port, () => {
        console.log(`Server running on http://localhost:${config.port}`);
    });
}

start();
