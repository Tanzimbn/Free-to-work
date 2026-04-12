'use strict';

const router = require('express').Router();
const requireAuth = require('../middleware/requireAuth');
const requireNotDemo = require('../middleware/requireNotDemo');
const { update_bid } = require('../controllers/bid.controller');

router.use(requireAuth);
router.post('/update_bid', requireNotDemo, update_bid);

module.exports = router;
