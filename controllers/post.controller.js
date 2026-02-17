const notiModel = require("../models/notification");
const postModel = require("../models/post");
const userModel = require("../models/users");
const commentModel = require("../models/comment");
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

        const user = await userModel.find()
        const new_noti = []
        for(let i = 0; i < user.length; i++) {
            let noti = 'You have a new post to see " ' + req.body.title + ' "'
            if(user[i].category == req.body.category && user[i]._id != req.session.user_id && user[i].mood == true) {
                const temp = new notiModel({
                    user: user[i]._id,
                    type: noti,
                    postid: post_res._id
                })
                new_noti.push(temp)
            }
        }
        const noti_res = await notiModel.insertMany(new_noti)
        
        res.send({"message" : "Success"})

    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
}

exports.post_detail = async (req, res) => {
    const allpost = await postModel.find({_id : req.body.id});
    const ans = await notiModel.updateOne({postid : req.body.id, user: req.session.user_id}, { $set: {unseen:false}});
    res.json(allpost[0])
}

exports.add_comment = async (req, res) => {
    try {
        if (!req.session.user_id) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        
        const user = await userModel.findOne({_id: req.session.user_id});
        
        const newComment = new commentModel({
            post_id: req.body.post_id,
            parent_id: req.body.parent_id || null,
            user_id: req.session.user_id,
            user_name: user ? `${user.fname} ${user.lname}` : "Unknown",
            text: req.body.text
        });
        
        await newComment.save();
        res.json({ message: "Success", comment: newComment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add comment" });
    }
};

exports.get_comments = async (req, res) => {
    try {
        const comments = await commentModel.find({ post_id: req.body.post_id }).sort({ created_at: -1 });
        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get comments" });
    }
};