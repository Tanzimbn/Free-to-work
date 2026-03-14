'use strict';

const router = require('express').Router();

router.use('/auth',       require('./auth.routes'));
router.use('/posts',      require('./posts.routes'));
router.use('/users',      require('./users.routes'));
router.use('/reviews',    require('./reviews.routes'));
router.use('/reports',    require('./reports.routes'));
router.use('/location',   require('./location.routes'));
router.use('/categories', require('./categories.routes'));
router.use('/admin',      require('./admin.routes'));

module.exports = router;
