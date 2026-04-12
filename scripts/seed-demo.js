'use strict';

/**
 * Creates the demo user in MongoDB.
 * Run once: node scripts/seed-demo.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../config');
const userModel = require('../models/users');

async function seed() {
    await mongoose.connect(config.db.url);

    const existing = await userModel.findOne({ isDemo: true });
    if (existing) {
        console.log('Demo user already exists:', existing.email);
        await mongoose.disconnect();
        return;
    }

    const password = await bcrypt.hash('demo-no-login-' + Date.now(), 12);

    await userModel.create({
        fname: 'Demo',
        lname: 'User',
        nid: '0000000001',
        gender: 'Male',
        email: 'demo@freetowork.com',
        password,
        phone: '01700000000',
        division: 'Chattogram',
        district: 'Chattogram',
        station: 'Kotwali',
        category: 'General',
        bio: 'This is a demo account. Browse around!',
        isDemo: true,
    });

    console.log('Demo user created: demo@freetowork.com');
    await mongoose.disconnect();
}

seed().catch((err) => {
    console.error(err);
    process.exit(1);
});
