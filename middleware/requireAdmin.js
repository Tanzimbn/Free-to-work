'use strict';

const config = require('../config');

/**
 * Rejects non-admin requests with 403.
 * Must be applied AFTER requireAuth (relies on req.session.user_id being set).
 *
 *   router.use(requireAuth, requireAdmin);
 */
module.exports = function requireAdmin(req, res, next) {
    if (!config.admin.email || req.session.user_id !== config.admin.email) {
        return res.status(403).json({ success: false, error: 'Forbidden' });
    }
    next();
};
