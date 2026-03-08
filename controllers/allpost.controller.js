const postModel = require("../models/post");
const time_ago = require("javascript-time-ago")
const loc = require("javascript-time-ago/locale/en");
const userModel = require("../models/users");
const notiModel = require("../models/notification");
time_ago.addDefaultLocale(loc)
const tm = new time_ago();

// Called by AuthContext on startup — returns only what the app shell needs.
// No posts query. hasUnseenNotifications drives the bell dot indicator.
exports.loadUserData = async (req, res) => {
    if (!req.session.user_id) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const user = await userModel.findById(req.session.user_id);
    const hasUnseenNotifications = !!(await notiModel.exists({ user: req.session.user_id, unseen: true }));
    res.json({ user, hasUnseenNotifications });
}

// Lazy — only called when the user opens the notification panel.
exports.getNotifications = async (req, res) => {
    if (!req.session.user_id) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const notifications = await notiModel
        .find({ user: req.session.user_id })
        .sort({ _id: -1 })
        .limit(30);
    res.json({ notifications });
}

exports.showallpost = async (req, res) => {
    const allpost = await postModel.find({});
    // Sorting logic is missing in original snippet I saw? No it was there.
    allpost.sort((a, b) => {
        return b.time.getTime() - a.time.getTime()
    })

    const time_ago = [], detail1 = [], detail2 = []
    for (let i = 0; i < allpost.length; i++) {
        time_ago.push(tm.format(allpost[i].time))
    }
    // original was res.send({time_ago, allpost});
    res.json({time_ago, allpost});
}

exports.tm = tm
