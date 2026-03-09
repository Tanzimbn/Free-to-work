'use strict';

const bcrypt = require('bcrypt');
const blockModel = require('../models/block');
const userModel = require('../models/users');
const emailValidator = require('email-validator');
const verifyModel = require('../models/verify');
const emailService = require('../services/email.service');
const config = require('../config');

const SALT_ROUNDS = 12;

exports.reg_submit = async (req, res, next) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, SALT_ROUNDS);
        const new_user = new verifyModel({
            fname:    req.body.fname,
            lname:    req.body.lname,
            nid:      req.body.nid,
            gender:   req.body.gender,
            email:    req.body.email,
            password: hashedPassword,
            phone:    req.body.phone,
            division: req.body.division,
            district: req.body.district,
            station:  req.body.station,
        });

        const record = await new_user.save();
        const verifyUrl = `${config.backend.url}/verify/${record._id}`;

        await emailService.sendVerificationEmail(req.body.email, verifyUrl);
        res.json({ success: true, message: 'Check your email to verify your account.' });
    } catch (err) {
        next(err);
    }
};

exports.form1_submit = async (req, res, next) => {
    try {
        const { fname, nid } = req.body;

        if (!fname || fname.length === 0) {
            return res.json({ message: 'Enter first name' });
        }

        const [existing, blocked] = await Promise.all([
            userModel.findOne({ nid }),
            blockModel.findOne({ nid }),
        ]);

        if (blocked)               return res.json({ message: 'Given NID is blocked' });
        if (existing)              return res.json({ message: 'Invalid NID' });
        if (nid.length !== 10)     return res.json({ message: 'Invalid NID' });

        res.json({ message: 'Valid' });
    } catch (err) {
        next(err);
    }
};

exports.form2_submit = async (req, res, next) => {
    try {
        const { email, Station, phone } = req.body;

        if (phone.length !== 11) {
            return res.json({ message: 'Invalid phone number' });
        }
        if (!emailValidator.validate(email)) {
            return res.json({ message: 'Invalid email' });
        }
        if (!Station) {
            return res.json({ message: 'Select police station' });
        }

        const existing = await userModel.findOne({ email });
        if (existing) return res.json({ message: 'Email already registered' });

        res.json({ message: 'Valid' });
    } catch (err) {
        next(err);
    }
};

exports.email_confirmed = async (req, res, next) => {
    try {
        const pending = await verifyModel.findById(req.params.id);

        if (pending) {
            await userModel.create({
                fname:    pending.fname,
                lname:    pending.lname,
                nid:      pending.nid,
                gender:   pending.gender,
                email:    pending.email,
                password: pending.password,
                phone:    pending.phone,
                division: pending.division,
                district: pending.district,
                station:  pending.station,
            });
            await verifyModel.deleteOne({ _id: req.params.id });
        }

        res.redirect(`${config.client.url}/login?verified=true`);
    } catch (err) {
        next(err);
    }
};