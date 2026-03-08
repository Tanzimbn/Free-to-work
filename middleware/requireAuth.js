'use strict';

/**
 * Rejects unauthenticated requests with 401.
 * Apply at the router level to protect entire route groups:
 *
 *   router.use(requireAuth);
 *   router.get('/posts', getPosts);
 */
module.exports = function requireAuth(req, res, next) {
    if (!req.session.user_id) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    next();
};