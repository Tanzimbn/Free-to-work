'use strict';

const emitter = require('../emitter');
const notificationService = require('../../services/notification.service');

emitter.on('post.created', async (post) => {
    try {
        await notificationService.fanOut(post);
    } catch (err) {
        console.error('[notification.handler] Fan-out failed:', err.message);
    }
});
