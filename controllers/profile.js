const postModel = require("../models/post");
const userModel = require("../models/users");
const fs = require("fs")
const { tm } = require("./allpost.controller");
const notiModel = require("../models/notification");
const reviewModel = require("../models/reviews");
const coverModel = require("../models/cover");

exports.own_profile = async (req, res) => {
    res.redirect(`/profile/${req.session.user_id}`);
}

exports.show_profile = async (req, res) => {
    const givenId = req.params.id
    const view_user = await userModel.find({_id : givenId}) 
    const user = await userModel.find({_id : req.session.user_id})
    const allpost = await postModel.find({user : givenId });
    const allreview = await reviewModel.find({id : givenId });

    allreview.reverse()

    for (let i = 0; i < allpost.length; i++) {
        allpost[i].detail1 = allpost[i].detail.substring(0, 10)
        allpost[i].detail2 = allpost[i].detail.substring(10)
        allpost[i].time_ago = tm.format(allpost[i].time)
    }

    const loginId = req.session.user_id
    const MainUser = (req.session.user_id == givenId)

    const noti = await notiModel.find({"user" : req.session.user_id})
    noti.reverse()
    let unseen = false
    for (let i = 0; i < noti.length; i++) {
        unseen = unseen || noti[i].unseen
    }


    res.render("./profile/profile.hbs", {user, view_user, allpost, givenId, loginId, MainUser, noti, unseen, allreview})
}

exports.load_image = async (req, res) => {
    const ans = await userModel.updateOne({_id : req.session.user_id}, { $set: { img : {
        data: fs.readFileSync('uploads/' + req.file.filename),
        contentType: "image/png"
        }}}
    );
    // remove that image from disk
    fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error(err)
          return
        }
    })
    res.redirect('/profile')
}

exports.load_coverimage = async (req, res) => {
    const exist = await coverModel.find({id: req.session.user_id})
    
    if(exist.length != 0) {
        const ans = await coverModel.updateOne({id : req.session.user_id}, { $set: { cover : {
            data: fs.readFileSync('uploads/' + req.file.filename),
            contentType: "image/png"
            }}}
        );
    }
    else {
        const new_cover = new coverModel({
            id : req.session.user_id,
            cover: {
                data: fs.readFileSync('uploads/' + req.file.filename),
                contentType: "image/png"
            }
        })
        const cover = await new_cover.save();
    }
    
    // remove that image from disk
    fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error(err)
          return
        }
    })
    res.redirect('/profile')
}

exports.edit_user_info = async (req, res) => {
    const ans = await userModel.updateOne({_id : req.body.id}, { $set: { password : req.body.password, bio: req.body.bio,
        category: req.body.category }}
    );
    res.send({"message":"Success"})
}

exports.review = async (req, res) => {
    try {
        const new_review = new reviewModel({
            id: req.body.id,
            reviewer : req.body.reviewer,
            text: req.body.text,
            rating: req.body.rating
        })
        if(req.body.rating == "") {
            res.send({"message" : "Give rating!"});
        }
        else if(req.session.user_id == req.body.id) {
            res.send({"message" : "You can't review yourself!"});
        }
        else {
            const output = await new_review.save();
            const allreview = await reviewModel.find({id : req.body.id})
            let sum = 0, cnt = 0
            for(let i = 0; i < allreview.length; i++) {
                sum += parseInt(allreview[i].rating)
                cnt += 1
            }
            sum = sum / cnt
            sum = sum.toFixed(1)
            const updateRating = await userModel.updateOne({_id : req.body.id}, { $set: {rating: sum}}
            );
            res.json({"message" : "Review Added!", "rating" : sum});
        }
        
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
}

exports.delete_post = async (req, res) => {
    const ans = await postModel.deleteOne({_id : req.body.id});
    console.log("done")
    res.send({"message":"Success"})
}