'use strict';

const bcrypt = require('bcrypt');
const crypto = require('crypto');

const SALT_ROUNDS = 12;

async function hashPassword(password) {
    return bcrypt.hash(password, SALT_ROUNDS);
}

async function comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
}

function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

module.exports = { hashPassword, comparePassword, generateToken };
