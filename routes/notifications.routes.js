'use strict';

const router = require('express').Router();
const requireAuth = require('../middleware/requireAuth');
const { getNotifications } = require('../controllers/allpost.controller');

router.use(requireAuth);
router.get('/notifications', getNotifications);

module.exports = router;
