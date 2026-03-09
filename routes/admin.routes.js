'use strict';

const router = require('express').Router();
const requireAuth = require('../middleware/requireAuth');
const requireAdmin = require('../middleware/requireAdmin');
const { admin_data, block_user, report_process, category } = require('../controllers/admin.controller');

router.use(requireAuth, requireAdmin);
router.get('/admin',             admin_data);
router.post('/report_process',   report_process);
router.post('/block_user',       block_user);
router.post('/category',         category);

module.exports = router;
