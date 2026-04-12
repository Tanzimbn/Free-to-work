'use strict';

module.exports = function requireNotDemo(req, res, next) {
    if (req.session.isDemo) {
        return res.status(403).json({ success: false, error: 'This action is not available in demo mode.' });
    }
    next();
};
