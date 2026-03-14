'use strict';

const nodemailer = require('nodemailer');
const config = require('../config');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.email.user,
        pass: config.email.pass,
    },
});

async function sendVerificationEmail(to, token) {
    const url = `${config.client.url}/verify-email?token=${token}`;
    await transporter.sendMail({
        from: `"Free To Work" <${config.email.user}>`,
        to,
        subject: 'Verify your email — Free To Work',
        html: `
            <p>Thanks for registering on <strong>Free To Work</strong>!</p>
            <p>Click the link below to verify your email address. This link expires in 24 hours.</p>
            <p><a href="${url}">${url}</a></p>
        `,
    });
}

async function sendPasswordResetEmail(to, token) {
    const url = `${config.client.url}/reset-password?token=${token}`;
    await transporter.sendMail({
        from: `"Free To Work" <${config.email.user}>`,
        to,
        subject: 'Reset your password — Free To Work',
        html: `
            <p>You requested a password reset for your <strong>Free To Work</strong> account.</p>
            <p>Click the link below to reset your password. This link expires in 1 hour.</p>
            <p><a href="${url}">${url}</a></p>
            <p>If you didn't request this, ignore this email.</p>
        `,
    });
}

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
