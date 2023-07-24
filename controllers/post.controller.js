const postModel = require("../models/post");
const { tm } = require("./allpost.controller");
// const time_ago = require("javascript-time-ago")
// const loc = require("javascript-time-ago/locale/en")
// time_ago.addDefaultLocale(loc)
// const tm = new time_ago();

exports.post = async (req, res) => {
    try {
        var time = new Date();
        const new_post = new postModel({
            user: req.session.user_id,
            title: req.body.title,
            detail: req.body.detail,
            category: req.body.category,
            budget: req.body.budget,
            time: time,
            time_limit: req.body.time,
            division: req.body.division,
            district: req.body.district,
            station: req.body.station
        })
        const post_res = await new_post.save()
        res.send({"message" : "Success"})

    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
}

exports.post_detail = async (req, res) => {
    const allpost = await postModel.find({_id : req.body.id});
    // allpost[0].time_ago = tm.format(allpost[0].time)
    // data[0].time_ago = tm.format(data[0].time)
    // console.log(allpost)
    res.json(allpost[0])
}