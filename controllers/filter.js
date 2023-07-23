const postModel = require("../models/post");
const { tm } = require("./allpost.controller");

exports.post_filter = async (req, res) => {
    const allpost = await postModel.find({});
    const filterPost = []
    const time_ago = []
    


    for(let i = 0; i < allpost.length; i++) {
        if(req.body.price_min != "" && parseInt(req.body.price_min) > allpost[i].budget) {
            continue;
        }
        if(req.body.price_max != "" && parseInt(req.body.price_max) < allpost[i].budget) {
            continue;
        }
        if(req.body.division != "" && req.body.division != allpost[i].division) {
            continue;
        }
        if(req.body.district != "" && req.body.district != allpost[i].district) {
            continue;
        }
        if(req.body.station != "" && req.body.station != allpost[i].station) {
            continue;
        }
        if(req.body.category != "" && req.body.category != allpost[i].category) {
            continue;
        }
        if(req.body.searchValue != "" && allpost[i].title.toLowerCase().search(req.body.searchValue) == -1) {
            continue;
        }
        time_ago.push(tm.format(allpost[i].time))
        filterPost.push(allpost[i])
    }
    filterPost.reverse()
    time_ago.reverse()
    res.json({filterPost, time_ago})
}
