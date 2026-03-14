'use strict';

// Cursor format: base64(<created_at>_<id>)

function encodeCursor(createdAt, id) {
    return Buffer.from(`${createdAt}_${id}`).toString('base64url');
}

function decodeCursor(cursor) {
    try {
        const decoded = Buffer.from(cursor, 'base64url').toString('utf8');
        const separatorIndex = decoded.lastIndexOf('_');
        if (separatorIndex === -1) return null;
        const createdAt = decoded.slice(0, separatorIndex);
        const id = decoded.slice(separatorIndex + 1);
        if (!createdAt || !id) return null;
        return { createdAt, id };
    } catch {
        return null;
    }
}

module.exports = { encodeCursor, decodeCursor };
