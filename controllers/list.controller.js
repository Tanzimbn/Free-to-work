const notiModel = require("../models/notification");
const userModel = require("../models/users");

exports.show_list = async (req, res) => {

    if(!req.session.user_id) {
        res.render("./other/error.hbs");
        return
    }
    
    const user = await userModel.find({_id : req.session.user_id});

    const noti = await notiModel.find({"user" : req.session.user_id})
    noti.reverse()
    let unseen = false
    for (let i = 0; i < noti.length; i++) {
        unseen = unseen || noti[i].unseen
    }

    res.render("./list/list.hbs", { user, noti, unseen });
}

exports.list_filter = async (req, res) => {
    const alluser = await userModel.find({});
    
    res.send({alluser})
}
