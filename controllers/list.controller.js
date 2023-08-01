const notiModel = require("../models/notification");
const userModel = require("../models/users");

exports.show_list = async (req, res) => {
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
    const filterUser = []
    


    for(let i = 0; i < alluser.length; i++) {
        if(req.body.division != "" && req.body.division != alluser[i].division) {
            continue;
        }
        if(req.body.district != "" && req.body.district != alluser[i].district) {
            continue;
        }
        if(req.body.station != "" && req.body.station != alluser[i].station) {
            continue;
        }
        if(req.body.category != "" && req.body.category != alluser[i].category) {
            continue;
        }
        let username = alluser[i].fname + " " + alluser[i].lname
        if(req.body.searchValue != "" && username.toLowerCase().search(req.body.searchValue) == -1) {
            continue;
        }
        filterUser.push(alluser[i])
    }
    
    res.json({filterUser})
}