'use strict';

const pool = require('../db/pool');
const authService = require('../services/auth.service');
const emitter = require('../events/emitter');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/response');

// POST /auth/register
async function register(req, res, next) {
    const { email, password, first_name, last_name, phone, gender } = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Check duplicate email
        const exists = await client.query('SELECT id FROM users WHERE email = $1', [email]);
        if (exists.rowCount > 0) {
            throw new AppError('Email already registered', 409, 'EMAIL_TAKEN');
        }

        const password_hash = await authService.hashPassword(password);
        const { rows } = await client.query(
            `INSERT INTO users (email, password_hash, first_name, last_name, phone, gender)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id, email, first_name, last_name`,
            [email, password_hash, first_name, last_name, phone || null, gender || null]
        );
        const user = rows[0];

        // Create email verification token (24h TTL)
        const token = authService.generateToken();
        await client.query(
            `INSERT INTO email_verifications (user_id, token, expires_at)
             VALUES ($1, $2, NOW() + INTERVAL '24 hours')`,
            [user.id, token]
        );

        await client.query('COMMIT');

        emitter.emit('user.registered', { user, token });

        return sendSuccess(res, {
            message: 'Registration successful. Please check your email to verify your account.',
        }, 201);
    } catch (err) {
        await client.query('ROLLBACK');
        next(err);
    } finally {
        client.release();
    }
}

// GET /auth/verify-email/:token
async function verifyEmail(req, res, next) {
    const { token } = req.params;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { rows } = await client.query(
            `SELECT ev.user_id, ev.expires_at
             FROM email_verifications ev
             WHERE ev.token = $1`,
            [token]
        );
        if (rows.length === 0) {
            throw new AppError('Invalid or expired verification link', 400, 'INVALID_TOKEN');
        }
        const { user_id, expires_at } = rows[0];
        if (new Date() > new Date(expires_at)) {
            throw new AppError('Verification link has expired', 400, 'TOKEN_EXPIRED');
        }

        await client.query('UPDATE users SET is_verified = true WHERE id = $1', [user_id]);
        await client.query('DELETE FROM email_verifications WHERE token = $1', [token]);

        await client.query('COMMIT');
        return sendSuccess(res, { message: 'Email verified. You can now log in.' });
    } catch (err) {
        await client.query('ROLLBACK');
        next(err);
    } finally {
        client.release();
    }
}

// POST /auth/resend-verification
async function resendVerification(req, res, next) {
    const { email } = req.body;
    try {
        const { rows } = await pool.query(
            'SELECT id, is_verified FROM users WHERE email = $1',
            [email]
        );
        // Always return success — don't reveal whether email exists
        if (rows.length === 0 || rows[0].is_verified) {
            return sendSuccess(res, { message: 'If that email exists and is unverified, a new link has been sent.' });
        }
        const user = rows[0];

        // Delete any existing token then create a fresh one
        await pool.query('DELETE FROM email_verifications WHERE user_id = $1', [user.id]);
        const token = authService.generateToken();
        await pool.query(
            `INSERT INTO email_verifications (user_id, token, expires_at)
             VALUES ($1, $2, NOW() + INTERVAL '24 hours')`,
            [user.id, token]
        );

        emitter.emit('user.registered', { user: { id: user.id, email }, token });
        return sendSuccess(res, { message: 'If that email exists and is unverified, a new link has been sent.' });
    } catch (err) {
        next(err);
    }
}

// POST /auth/login
async function login(req, res, next) {
    const { email, password } = req.body;
    try {
        const { rows } = await pool.query(
            'SELECT id, email, password_hash, first_name, last_name, is_admin, is_active, is_verified FROM users WHERE email = $1',
            [email]
        );
        const user = rows[0];

        if (!user || !(await authService.comparePassword(password, user.password_hash))) {
            throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
        }
        if (!user.is_active) {
            throw new AppError('Your account has been blocked', 403, 'ACCOUNT_BLOCKED');
        }
        if (!user.is_verified) {
            throw new AppError('Please verify your email before logging in', 403, 'EMAIL_NOT_VERIFIED');
        }

        // Regenerate session to prevent fixation
        req.session.regenerate((err) => {
            if (err) return next(err);
            req.session.userId = user.id;
            req.session.isAdmin = user.is_admin;
            req.session.save((saveErr) => {
                if (saveErr) return next(saveErr);
                return sendSuccess(res, {
                    user: {
                        id: user.id,
                        email: user.email,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        is_admin: user.is_admin,
                    },
                });
            });
        });
    } catch (err) {
        next(err);
    }
}

// POST /auth/logout
async function logout(req, res, next) {
    req.session.destroy((err) => {
        if (err) return next(err);
        res.clearCookie('connect.sid');
        return sendSuccess(res, { message: 'Logged out' });
    });
}

// GET /auth/me
async function me(req, res, next) {
    try {
        const { rows } = await pool.query(
            `SELECT id, email, first_name, last_name, phone, gender,
                    division_id, district_id, upazila_id,
                    bio, avatar_url, cover_url, rating, review_count,
                    is_admin, is_verified, notifications_on, created_at
             FROM users WHERE id = $1`,
            [req.session.userId]
        );
        if (rows.length === 0) {
            throw new AppError('User not found', 404, 'NOT_FOUND');
        }
        return sendSuccess(res, { user: rows[0] });
    } catch (err) {
        next(err);
    }
}

// POST /auth/forgot-password
async function forgotPassword(req, res, next) {
    const { email } = req.body;
    try {
        const { rows } = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        // Always respond success — don't leak whether email exists
        if (rows.length > 0) {
            const user = rows[0];
            // Invalidate existing reset tokens
            await pool.query('DELETE FROM password_resets WHERE user_id = $1', [user.id]);
            const token = authService.generateToken();
            await pool.query(
                `INSERT INTO password_resets (user_id, token, expires_at)
                 VALUES ($1, $2, NOW() + INTERVAL '1 hour')`,
                [user.id, token]
            );
            emitter.emit('password.reset.requested', { email, token });
        }
        return sendSuccess(res, { message: 'If that email is registered, a reset link has been sent.' });
    } catch (err) {
        next(err);
    }
}

// POST /auth/reset-password
async function resetPassword(req, res, next) {
    const { token, password } = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { rows } = await client.query(
            `SELECT id, user_id, expires_at, used_at FROM password_resets WHERE token = $1`,
            [token]
        );
        if (rows.length === 0) {
            throw new AppError('Invalid or expired reset link', 400, 'INVALID_TOKEN');
        }
        const reset = rows[0];
        if (reset.used_at) {
            throw new AppError('Reset link has already been used', 400, 'TOKEN_USED');
        }
        if (new Date() > new Date(reset.expires_at)) {
            throw new AppError('Reset link has expired', 400, 'TOKEN_EXPIRED');
        }

        const password_hash = await authService.hashPassword(password);
        await client.query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [password_hash, reset.user_id]);
        await client.query('UPDATE password_resets SET used_at = NOW() WHERE id = $1', [reset.id]);

        await client.query('COMMIT');
        return sendSuccess(res, { message: 'Password reset successful. You can now log in.' });
    } catch (err) {
        await client.query('ROLLBACK');
        next(err);
    } finally {
        client.release();
    }
}

// PATCH /auth/change-password
async function changePassword(req, res, next) {
    const { old_password, new_password } = req.body;
    try {
        const { rows } = await pool.query('SELECT password_hash FROM users WHERE id = $1', [req.session.userId]);
        const user = rows[0];

        if (!(await authService.comparePassword(old_password, user.password_hash))) {
            throw new AppError('Current password is incorrect', 400, 'INVALID_PASSWORD');
        }

        const password_hash = await authService.hashPassword(new_password);
        await pool.query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [password_hash, req.session.userId]);

        return sendSuccess(res, { message: 'Password changed successfully.' });
    } catch (err) {
        next(err);
    }
}

module.exports = { register, verifyEmail, resendVerification, login, logout, me, forgotPassword, resetPassword, changePassword };
