'use strict';

const emitter = require('../emitter');
const emailService = require('../../services/email.service');

emitter.on('user.registered', async ({ user, token }) => {
    try {
        await emailService.sendVerificationEmail(user.email, token);
    } catch (err) {
        console.error('[email.handler] Failed to send verification email:', err.message);
    }
});

emitter.on('password.reset.requested', async ({ email, token }) => {
    try {
        await emailService.sendPasswordResetEmail(email, token);
    } catch (err) {
        console.error('[email.handler] Failed to send password reset email:', err.message);
    }
});
