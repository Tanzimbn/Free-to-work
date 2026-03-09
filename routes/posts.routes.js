'use strict';

const router = require('express').Router();
const requireAuth = require('../middleware/requireAuth');
const { showallpost } = require('../controllers/allpost.controller');
const { post, post_detail, add_comment, get_comments } = require('../controllers/post.controller');
const { post_filter } = require('../controllers/filter');
const { delete_post } = require('../controllers/profile');

// ── Public ────────────────────────────────────────────────────────────────────
router.post('/allpost',      showallpost);
router.post('/post_filter',  post_filter);
router.post('/get_comments', get_comments);

// ── Protected ─────────────────────────────────────────────────────────────────
router.use(requireAuth);
router.post('/post',        post);
router.post('/post_detail', post_detail);
router.post('/add_comment', add_comment);
router.post('/delete_post', delete_post);

module.exports = router;
