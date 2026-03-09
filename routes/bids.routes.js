'use strict';

const router = require('express').Router();
const requireAuth = require('../middleware/requireAuth');
const { update_bid } = require('../controllers/bid.controller');

router.use(requireAuth);
router.post('/update_bid', update_bid);

module.exports = router;
