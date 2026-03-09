'use strict';

const router = require('express').Router();

router.get('/', (req, res) => res.json({ message: 'API is running' }));

router.use('/', require('./auth.routes'));
router.use('/', require('./posts.routes'));
router.use('/', require('./users.routes'));
router.use('/', require('./notifications.routes'));
router.use('/', require('./bids.routes'));
router.use('/', require('./admin.routes'));

module.exports = router;
