const blockModel = require("../models/block")
const categoryModel = require("../models/category")
const feedbackModel = require("../models/feedback")
const postModel = require("../models/post")
const reportModel = require("../models/reports")
const userModel = require("../models/users")

exports.admin_data = async (req, res) => {
    const user = await userModel.find({}, { "_id": 1 })
    const post = await postModel.find({}, { "time": 1, "max_bid": 1, "max_bid_user": 1 })
    const report = await reportModel.find({})
    const feedback = await feedbackModel.find({})

    let totaluser = user.length,
        totalpost = post.length,
        lastpost = 0,
        avgbid = 0, totalbid = 0
    let timenow = new Date().getTime() - (1 * 24 * 60 * 60 * 1000)

    for (let i = 0; i < totalpost; i++) {
        if (post[i].time >= timenow) lastpost++

        if (post[i].max_bid_user != "No bid yet") {
            avgbid += parseInt(post[i].max_bid)
            totalbid++
        }
    }
    avgbid = avgbid / totalbid
    avgbid = avgbid.toFixed(3)

    res.render("./Admin/admin.hbs", { totaluser, totalpost, lastpost, avgbid, report, feedback });
    // console.log(review)
    // console.log(report)
    // req.send({"user" : totaluser, "post" : totalpost, "24hr post" : lastpost, "avg bid" : avgbid})

}

exports.block_user = async (req, res) => {
    var user = await userModel.find({ _id: req.body.id })
    if (user.length == 0) {
        const ans1 = await reportModel.deleteOne({ _id: req.body.reportid })
        res.send({ "message": "Success" })
    }
    else {
        const nid = user[0].nid

        const blockuser = new blockModel({
            nid: nid
        })

        try {
            const final = await blockuser.save()
            const ans = await userModel.deleteOne({ _id: req.body.id });
            const ans1 = await reportModel.deleteOne({ _id: req.body.reportid })
            res.send({ "message": "Success" })

        } catch (error) {
            console.error(error);
            res.status(400).send(error);
        }
    }

}

exports.report_process = async (req, res) => {
    const ans = await reportModel.deleteOne({ _id: req.body.reportid })
    res.send({ "message": "Success" })
}

exports.category = async (req, res) => {
    const cat = new categoryModel({
        value : req.body.value
    })
    try {
        const val = await categoryModel.find({value: req.body.value})
        if(val.length == 0) {
            const final = await cat.save()
            res.send({ "message": "Success" })
        }
        else
        res.send({ "message": "exist" })

    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
}

exports.allcategory = async (req, res) => {
    const val = await categoryModel.find({})
   
    res.send(val)
}