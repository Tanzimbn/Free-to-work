'use strict';

const notiModel = require('../models/notification');
const userModel = require('../models/users');

/**
 * Creates notifications for all workers who match the post's category,
 * have mood:true (active), and are not the post author.
 *
 * @param {string} postId      Saved post._id
 * @param {string} postTitle   Post title for the notification message
 * @param {string} category    Post category to match against user.category
 * @param {string} authorId    Session user_id — excluded from recipients
 */
exports.fanOutPostNotification = async function fanOutPostNotification(postId, postTitle, category, authorId) {
    const recipients = await userModel.find(
        { category: category, mood: true, _id: { $ne: authorId } },
        '_id'
    );

    if (recipients.length === 0) return;

    const message = `You have a new post to see " ${postTitle} "`;

    const notifications = recipients.map(({ _id }) => ({
        user: _id,
        type: message,
        postid: postId,
    }));

    await notiModel.insertMany(notifications);
};
