'use strict';

const postModel = require('../models/post');

exports.update_bid = async (req, res, next) => {
    try {
        const { id, new_bid, new_user_name } = req.body;
        const post = await postModel.findById(id);

        if (!post) {
            return res.status(404).json({ user_id: '-3', message: 'Post not found' });
        }

        const nowDate = new Date();
        if (nowDate > post.time_limit) {
            return res.json({ user_id: '-2' });
        }
        if (String(post.user) === String(req.session.user_id)) {
            return res.json({ user_id: '-1' });
        }

        await postModel.updateOne(
            { _id: id },
            { $set: { max_bid: new_bid, max_bid_user: req.session.user_id, max_bid_user_name: new_user_name } }
        );
        res.json({ user_id: req.session.user_id });
    } catch (err) {
        next(err);
    }
};
