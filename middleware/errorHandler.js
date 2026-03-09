'use strict';

/**
 * Global error handling middleware.
 * Must be registered LAST in app.js, after all routes.
 *
 * Controllers pass errors here via next(err) instead of writing
 * their own res.status(400).send(error) in every catch block.
 *
 * To attach a specific HTTP status to an error:
 *   const err = new Error('Post not found');
 *   err.statusCode = 404;
 *   return next(err);
 */
module.exports = function errorHandler(err, req, res, next) {
    console.error(err);
    const status = err.statusCode || 500;
    res.status(status).json({
        success: false,
        error: err.message || 'Internal Server Error',
    });
};