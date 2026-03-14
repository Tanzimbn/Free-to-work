'use strict';

const { WebSocket } = require('ws');

// Map<postId, Set<WebSocket>>
const postRooms = new Map();

function init(wss) {
    wss.on('connection', (ws, req) => {
        // Attach userId from session (set during HTTP upgrade in index.js via session parsing)
        ws.userId = req.session?.userId ?? null;
        ws.subscribedRooms = new Set();

        ws.on('message', (raw) => {
            try {
                const msg = JSON.parse(raw);
                if (msg.type === 'subscribe' && msg.postId) {
                    subscribe(ws, msg.postId);
                }
                if (msg.type === 'unsubscribe' && msg.postId) {
                    unsubscribe(ws, msg.postId);
                }
            } catch {
                // ignore malformed messages
            }
        });

        ws.on('close', () => {
            for (const postId of ws.subscribedRooms) {
                unsubscribe(ws, postId);
            }
        });
    });
}

function subscribe(ws, postId) {
    if (!postRooms.has(postId)) postRooms.set(postId, new Set());
    postRooms.get(postId).add(ws);
    ws.subscribedRooms.add(postId);
}

function unsubscribe(ws, postId) {
    postRooms.get(postId)?.delete(ws);
    ws.subscribedRooms?.delete(postId);
}

function broadcastNewBid(postId, bid, authorId) {
    const room = postRooms.get(postId);
    if (!room) return;
    for (const client of room) {
        if (client.readyState !== WebSocket.OPEN) continue;
        const payload = client.userId === authorId
            ? { type: 'new_bid', bid }
            : { type: 'new_bid', bid: { amount: bid.amount } };
        client.send(JSON.stringify(payload));
    }
}

module.exports = { init, broadcastNewBid };
