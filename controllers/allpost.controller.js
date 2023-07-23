const postModel = require("../models/post");
const time_ago = require("javascript-time-ago")
const loc = require("javascript-time-ago/locale/en");
const userModel = require("../models/users");
time_ago.addDefaultLocale(loc)
const tm = new time_ago();

exports.showallpost = async (req, res) => {
    const allpost = await postModel.find({});
    allpost.sort((a, b) => {
        return b.time.getTime() - a.time.getTime()
    })
    const user = await userModel.find({_id : req.session.user_id});
    for (let i = 0; i < allpost.length; i++) {
        allpost[i].detail1 = allpost[i].detail.substring(0, 100)
        allpost[i].detail2 = allpost[i].detail.substring(100)
        allpost[i].time_ago = tm.format(allpost[i].time)
    }
    res.render("./newsfeed/temp.hbs", { allpost, user });
}

exports.tm = tm