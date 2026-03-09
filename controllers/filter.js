'use strict';

const postModel = require('../models/post');
const { tm } = require('./allpost.controller');

exports.post_filter = async (req, res, next) => {
    try {
        const { price_min, price_max, division, district, station, category, searchValue } = req.body;
        const query = {};

        if (price_min !== '' && price_min != null) query.budget = { ...query.budget, $gte: Number(price_min) };
        if (price_max !== '' && price_max != null) query.budget = { ...query.budget, $lte: Number(price_max) };
        if (division)    query.division = division;
        if (district)    query.district = district;
        if (station)     query.station  = station;
        if (category)    query.category = category;
        if (searchValue) {
            query.$or = [
                { title:    { $regex: searchValue, $options: 'i' } },
                { category: { $regex: searchValue, $options: 'i' } },
            ];
        }

        const posts = await postModel.find(query).sort({ time: -1 });
        res.json(posts.map(post => ({ post, time_ago: tm.format(post.time) })));
    } catch (err) {
        next(err);
    }
};
