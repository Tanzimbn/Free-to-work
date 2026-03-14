'use strict';

const router = require('express').Router();
const ctrl = require('../controllers/auth.controller');
const validate = require('../middleware/validate');
const requireAuth = require('../middleware/requireAuth');
const { loginLimiter, registerLimiter } = require('../middleware/rateLimiter');
const {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    changePasswordSchema,
} = require('../validators/auth.validator');

router.post('/register',             registerLimiter, validate(registerSchema),       ctrl.register);
router.get ('/verify-email/:token',                                                   ctrl.verifyEmail);
router.post('/resend-verification',  validate(forgotPasswordSchema),                  ctrl.resendVerification);
router.post('/login',                loginLimiter,    validate(loginSchema),          ctrl.login);
router.post('/logout',               requireAuth,                                     ctrl.logout);
router.get ('/me',                   requireAuth,                                     ctrl.me);
router.post('/forgot-password',      validate(forgotPasswordSchema),                  ctrl.forgotPassword);
router.post('/reset-password',       validate(resetPasswordSchema),                   ctrl.resetPassword);
router.patch('/change-password',     requireAuth, validate(changePasswordSchema),     ctrl.changePassword);

module.exports = router;
