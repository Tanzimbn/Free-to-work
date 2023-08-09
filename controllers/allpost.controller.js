const postModel = require("../models/post");
const time_ago = require("javascript-time-ago")
const loc = require("javascript-time-ago/locale/en");
const userModel = require("../models/users");
const notiModel = require("../models/notification");
time_ago.addDefaultLocale(loc)
const tm = new time_ago();

exports.loadUserData = async (req, res) => {

    if(!req.session.user_id) {
        res.render("./other/error.hbs");
        return
    }

    const allpost = await postModel.find({});
    allpost.sort((a, b) => {
        return b.time.getTime() - a.time.getTime()
    })
    const user = await userModel.find({_id : req.session.user_id});

    

    const noti = await notiModel.find({"user" : req.session.user_id})
    noti.reverse()
    let unseen = false
    for (let i = 0; i < noti.length; i++) {
        unseen = unseen || noti[i].unseen
    }

    res.render("./newsfeed/temp.hbs", { user, noti, unseen });
}

exports.showallpost = async (req, res) => {
    const allpost = await postModel.find({});
    allpost.sort((a, b) => {
        return b.time.getTime() - a.time.getTime()
    })

    const time_ago = [], detail1 = [], detail2 = []
    for (let i = 0; i < allpost.length; i++) {
        time_ago.push(tm.format(allpost[i].time))
    }
    res.send({time_ago, allpost});
}

exports.tm = tm
