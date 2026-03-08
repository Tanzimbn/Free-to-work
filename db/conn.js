'use strict';

const mongoose = require('mongoose');
const config = require('../config');

async function connect() {
    try {
        await mongoose.connect(config.db.url);
        console.log('DB connected');
    } catch (error) {
        console.error('DB connection failed:', error.message);
        process.exit(1);
    }
}

connect();