'use strict';

const AppError = require('../utils/AppError');

function requireAdmin(req, res, next) {
    if (!req.session?.userId) {
        return next(new AppError('Authentication required', 401, 'UNAUTHORIZED'));
    }
    if (!req.session?.isAdmin) {
        return next(new AppError('Admin access required', 403, 'FORBIDDEN'));
    }
    next();
}

module.exports = requireAdmin;
