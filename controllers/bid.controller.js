const postModel = require("../models/post");
const userModel = require("../models/users");

exports.update_bid = async (req, res) => {
    const {id, new_bid, new_user_name} = req.body
    const val = await postModel.find({_id : id})
    if(val[0].user == req.session.user_id) res.json({"user_id" : "-1"})
    else {
        const ans = await postModel.updateOne({_id : id}, { $set: { max_bid: new_bid, max_bid_user: req.session.user_id, max_bid_user_name: new_user_name}});
        res.json({"user_id" : req.session.user_id})
    }
}