'use strict';

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
    const status = err.statusCode || 500;
    const code = err.code || 'INTERNAL_ERROR';
    const message = err.message || 'An unexpected error occurred';

    if (status >= 500) {
        console.error('[Error]', err);
    }

    return res.status(status).json({
        success: false,
        error: { code, message },
    });
}

module.exports = errorHandler;
