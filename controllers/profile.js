const postModel = require("../models/post");
const userModel = require("../models/users");
const fs = require("fs")
const { tm } = require("./allpost.controller");

exports.own_profile = async (req, res) => {
    res.redirect(`/profile/${req.session.user_id}`);
}

exports.show_profile = async (req, res) => {
    const givenId = req.params.id
    const view_user = await userModel.find({_id : givenId}) 
    const user = await userModel.find({_id : req.session.user_id})
    const allpost = await postModel.find({user : givenId });
    for (let i = 0; i < allpost.length; i++) {
        allpost[i].detail1 = allpost[i].detail.substring(0, 10)
        allpost[i].detail2 = allpost[i].detail.substring(10)
        allpost[i].time_ago = tm.format(allpost[i].time)
    }

    const loginId = req.session.user_id
    const MainUser = (req.session.user_id == givenId)
    res.render("./profile/profile.hbs", {user, view_user, allpost, givenId, loginId, MainUser})
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