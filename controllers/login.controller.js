'use strict';

const userModel = require('../models/users');
const emailService = require('../services/email.service');
const config = require('../config');

exports.verify_login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (config.admin.email && email === config.admin.email && password === config.admin.password) {
            req.session.user_id = email;
            return res.json({ message: 'admin' });
        }

        const user = await userModel.findOne({ email, password });
        if (!user) {
            return res.json({ message: 'Email or Password is incorrect' });
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
        await userModel.updateOne({ email: req.body.email }, { $set: { password: tempPassword } });

        await emailService.sendPasswordResetEmail(req.body.email, tempPassword);
        res.json({ message: 'Check your email', state: '1' });
    } catch (err) {
        next(err);
    }
};