'use strict';

const AppError = require('../utils/AppError');

function requireAuth(req, res, next) {
    if (!req.session?.userId) {
        return next(new AppError('Authentication required', 401, 'UNAUTHORIZED'));
    }
    next();
}

module.exports = requireAuth;
