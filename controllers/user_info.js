'use strict';

const userModel = require('../models/users');

exports.find_user = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.body.id);
        res.json(user);
    } catch (err) {
        next(err);
    }
};

// Returns an array — used by profile image loading (frontend reads data[0].img)
exports.find_user_data = async (req, res, next) => {
    try {
        const users = await userModel.find({ _id: req.body.id });
        res.json(users);
    } catch (err) {
        next(err);
    }
};