'use strict';

const notiModel = require('../models/notification');
const userModel = require('../models/users');

exports.show_list = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.session.user_id);
        const noti = await notiModel.find({ user: req.session.user_id }).sort({ _id: -1 }).limit(30);
        const unseen = !!(await notiModel.exists({ user: req.session.user_id, unseen: true }));
        res.json({ user, noti, unseen });
    } catch (err) {
        next(err);
    }
};

exports.list_filter = async (req, res, next) => {
    try {
        const { category, division, district, station } = req.body;
        const query = {};
        if (category) query.category = category;
        if (division) query.division = division;
        if (district) query.district = district;
        if (station)  query.station  = station;

        const alluser = await userModel.find(query).select('-password').limit(200);
        res.json({ alluser });
    } catch (err) {
        next(err);
    }
};
