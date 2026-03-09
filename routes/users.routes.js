'use strict';

const router = require('express').Router();
const requireAuth = require('../middleware/requireAuth');
const crypto = require('crypto');
const multer = require('multer');
const { find_user, find_user_data } = require('../controllers/user_info');
const { allcategory } = require('../controllers/admin.controller');
const { feedback } = require('../controllers/feedback.controller');
const { loadUserData } = require('../controllers/allpost.controller');
const {
    own_profile, show_profile, load_image, load_coverimage,
    edit_user_info, review, find_cover, update_mood, submit_report,
} = require('../controllers/profile');
const { show_list, list_filter } = require('../controllers/list.controller');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads'),
    filename:    (req, file, cb) => cb(null, crypto.randomUUID() + '_' + file.originalname),
});
const upload = multer({ storage });

// ── Public ────────────────────────────────────────────────────────────────────
router.post('/user_info',   find_user);
router.post('/user_data',   find_user_data);
router.post('/cover_data',  find_cover);
router.post('/allcategory', allcategory);

// ── Protected ─────────────────────────────────────────────────────────────────
router.use(requireAuth);
router.get('/newsfeed',     loadUserData);
router.get('/profile',      own_profile);
router.get('/profile/:id',  show_profile);
router.get('/list',         show_list);

router.post('/list_filter',                        list_filter);
router.post('/edit_user',     upload.single('testImage'), load_image);
router.post('/edit_user_info',upload.single('testImage'), edit_user_info);
router.post('/edit_cover',    upload.single('testImage'), load_coverimage);
router.post('/review',        review);
router.post('/report',        submit_report);
router.post('/update_mood',   update_mood);
router.post('/feedback',      feedback);

module.exports = router;
