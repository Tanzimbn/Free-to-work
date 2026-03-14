'use strict';

function sendSuccess(res, data, statusCode = 200) {
    return res.status(statusCode).json({ success: true, data });
}

function sendError(res, message, statusCode = 500, code = 'INTERNAL_ERROR') {
    return res.status(statusCode).json({
        success: false,
        error: { code, message },
    });
}

module.exports = { sendSuccess, sendError };
