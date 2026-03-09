'use strict';

const postModel = require('../models/post');
const userModel = require('../models/users');
const fs = require('fs');
const { tm } = require('./allpost.controller');
const notiModel = require('../models/notification');
const reviewModel = require('../models/reviews');
const coverModel = require('../models/cover');
const reportModel = require('../models/reports');

exports.own_profile = async (req, res) => {
    res.json({ userId: req.session.user_id });
};

exports.show_profile = async (req, res, next) => {
    try {
        const givenId = req.params.id;
        const [view_user, user, allpost, allreview, noti, unseenExists] = await Promise.all([
            userModel.find({ _id: givenId }),
            userModel.find({ _id: req.session.user_id }),
            postModel.find({ user: givenId }).sort({ time: -1 }),
            reviewModel.find({ id: givenId }).sort({ _id: -1 }),
            notiModel.find({ user: req.session.user_id }).sort({ _id: -1 }).limit(30),
            notiModel.exists({ user: req.session.user_id, unseen: true }),
        ]);

        for (let i = 0; i < allpost.length; i++) {
            allpost[i].detail1 = allpost[i].detail.substring(0, 10);
            allpost[i].detail2 = allpost[i].detail.substring(10);
            allpost[i].time_ago = tm.format(allpost[i].time);
        }

        res.json({
            user, view_user, allpost, allreview,
            givenId,
            loginId: req.session.user_id,
            MainUser: req.session.user_id == givenId,
            noti,
            unseen: !!unseenExists,
        });
    } catch (err) {
        next(err);
    }
};

exports.load_image = async (req, res, next) => {
    try {
        const imageData = await fs.promises.readFile('uploads/' + req.file.filename);
        await userModel.updateOne(
            { _id: req.session.user_id },
            { $set: { img: { data: imageData, contentType: 'image/png' } } }
        );
        await fs.promises.unlink(req.file.path);
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
};

exports.load_coverimage = async (req, res, next) => {
    try {
        const imageData = await fs.promises.readFile('uploads/' + req.file.filename);
        const coverData = { data: imageData, contentType: 'image/png' };
        const exists = await coverModel.exists({ id: req.session.user_id });
        if (exists) {
            await coverModel.updateOne({ id: req.session.user_id }, { $set: { cover: coverData } });
        } else {
            await coverModel.create({ id: req.session.user_id, cover: coverData });
        }
        await fs.promises.unlink(req.file.path);
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
};

exports.edit_user_info = async (req, res, next) => {
    try {
        await userModel.updateOne(
            { _id: req.body.id },
            { $set: { password: req.body.password, bio: req.body.bio, category: req.body.category } }
        );
        res.json({ message: 'Success' });
    } catch (err) {
        next(err);
    }
};

exports.review = async (req, res, next) => {
    try {
        if (!req.body.rating) {
            return res.json({ message: 'Give rating!' });
        }
        if (req.session.user_id == req.body.id) {
            return res.json({ message: "You can't review yourself!" });
        }

        await reviewModel.create({
            id: req.body.id,
            reviewer: req.body.reviewer,
            text: req.body.text,
            rating: req.body.rating,
        });

        const allreview = await reviewModel.find({ id: req.body.id });
        const avg = (allreview.reduce((sum, r) => sum + parseInt(r.rating), 0) / allreview.length).toFixed(1);
        await userModel.updateOne({ _id: req.body.id }, { $set: { rating: avg } });

        res.json({ message: 'Review Added!', rating: avg });
    } catch (err) {
        next(err);
    }
};

exports.delete_post = async (req, res, next) => {
    try {
        await postModel.deleteOne({ _id: req.body.id });
        await notiModel.deleteMany({ postid: req.body.id });
        res.json({ message: 'Success' });
    } catch (err) {
        next(err);
    }
};

// Returns array — frontend reads data[0].cover.data for the cover image
exports.find_cover = async (req, res, next) => {
    try {
        const cover = await coverModel.find({ id: req.body.id });
        res.json(cover);
    } catch (err) {
        next(err);
    }
};

exports.update_mood = async (req, res, next) => {
    try {
        await userModel.updateOne({ _id: req.session.user_id }, { $set: { mood: req.body.check } });
        res.json({ message: 'Success' });
    } catch (err) {
        next(err);
    }
};

exports.submit_report = async (req, res, next) => {
    try {
        await reportModel.create({
            reporter_id: req.session.user_id,
            to: req.body.to,
            reason: req.body.reportReason,
            comments: req.body.additionalComments,
        });
        res.json({ message: 'Report submitted successfully' });
    } catch (err) {
        next(err);
    }
};
