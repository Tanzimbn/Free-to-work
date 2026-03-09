'use strict';

const router = require('express').Router();
const requireAuth = require('../middleware/requireAuth');
const { check_login } = require('../controllers/sessionlogin.controller');
const { verify_login, logout, change_password } = require('../controllers/login.controller');
const { reg_submit, form1_submit, form2_submit, email_confirmed } = require('../controllers/registration.controller');

// ── Public ────────────────────────────────────────────────────────────────────
router.get('/login',         check_login);
router.get('/register',      (req, res) => res.json({ message: 'Please use the frontend to register' }));
router.get('/verify/:id',    email_confirmed);

router.post('/login',           verify_login);
router.post('/register',        reg_submit);
router.post('/register/form1',  form1_submit);
router.post('/register/form2',  form2_submit);
router.post('/change_password', change_password);

// ── Protected ─────────────────────────────────────────────────────────────────
router.get('/logout', requireAuth, logout);

module.exports = router;
