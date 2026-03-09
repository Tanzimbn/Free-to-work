'use strict';

const postModel = require('../models/post');
const commentModel = require('../models/comment');
const userModel = require('../models/users');
const notiModel = require('../models/notification');
const notificationService = require('../services/notification.service');

exports.post = async (req, res, next) => {
    try {
        const post_res = await postModel.create({
            user: req.session.user_id,
            title: req.body.title,
            detail: req.body.detail,
            category: req.body.category,
            budget: req.body.budget,
            time: new Date(),
            time_limit: req.body.time,
            division: req.body.division,
            district: req.body.district,
            station: req.body.station,
        });

        await notificationService.fanOutPostNotification(
            post_res._id,
            req.body.title,
            req.body.category,
            req.session.user_id
        );

        res.json({ message: 'Success' });
    } catch (err) {
        next(err);
    }
};

exports.post_detail = async (req, res, next) => {
    try {
        const post = await postModel.findById(req.body.id);
        await notiModel.updateOne(
            { postid: req.body.id, user: req.session.user_id },
            { $set: { unseen: false } }
        );
        res.json(post);
    } catch (err) {
        next(err);
    }
};

exports.add_comment = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.session.user_id);
        const newComment = new commentModel({
            post_id: req.body.post_id,
            parent_id: req.body.parent_id || null,
            user_id: req.session.user_id,
            user_name: user ? `${user.fname} ${user.lname}` : 'Unknown',
            text: req.body.text,
        });
        await newComment.save();
        res.json({ message: 'Success', comment: newComment });
    } catch (err) {
        next(err);
    }
};

exports.get_comments = async (req, res, next) => {
    try {
        const comments = await commentModel.find({ post_id: req.body.post_id }).sort({ created_at: -1 });
        res.json(comments);
    } catch (err) {
        next(err);
    }
};
