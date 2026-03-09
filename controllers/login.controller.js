'use strict';

const bcrypt = require('bcrypt');
const userModel = require('../models/users');
const emailService = require('../services/email.service');
const config = require('../config');

const SALT_ROUNDS = 12;

exports.verify_login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (config.admin.email && email === config.admin.email && password === config.admin.password) {
            req.session.user_id = email;
            return res.json({ message: 'admin' });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Email or Password is incorrect' });
        }

        let match = await bcrypt.compare(password, user.password);

        // Migration shim: existing users have plain-text passwords pre-bcrypt
        if (!match && password === user.password) {
            match = true;
            const hashed = await bcrypt.hash(password, SALT_ROUNDS);
            await userModel.updateOne({ _id: user._id }, { $set: { password: hashed } });
        }

        if (!match) {
            return res.status(401).json({ message: 'Email or Password is incorrect' });
        }

        req.session.user_id = user._id;
        res.json({ message: 'correct', userdata: user });
    } catch (err) {
        next(err);
    }
};

exports.logout = (req, res) => {
    delete req.session.user_id;
    res.json({ message: 'Logged out successfully' });
};

exports.change_password = async (req, res, next) => {
    try {
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) {
            return res.json({ message: 'Invalid Email!', state: '0' });
        }

        const tempPassword = Math.random().toString(36).substring(2, 10);
        const hashedTemp = await bcrypt.hash(tempPassword, SALT_ROUNDS);
        await userModel.updateOne({ email: req.body.email }, { $set: { password: hashedTemp } });

        await emailService.sendPasswordResetEmail(req.body.email, tempPassword);
        res.json({ message: 'Check your email', state: '1' });
    } catch (err) {
        next(err);
    }
};
