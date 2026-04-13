'use strict';

const { z } = require('zod');

const registerSchema = z.object({
    email:      z.string().email('Invalid email address'),
    password:   z.string().min(8, 'Password must be at least 8 characters'),
    first_name: z.string().min(1, 'First name is required').max(100),
    last_name:  z.string().min(1, 'Last name is required').max(100),
    phone:      z.string().max(20).optional(),
    gender:     z.enum(['male', 'female', 'other']).optional(),
});

const loginSchema = z.object({
    email:    z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
});

const resetPasswordSchema = z.object({
    token:    z.string().min(1, 'Token is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

const changePasswordSchema = z.object({
    old_password: z.string().min(1, 'Current password is required'),
    new_password: z.string().min(8, 'New password must be at least 8 characters'),
});

module.exports = {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    changePasswordSchema,
};
